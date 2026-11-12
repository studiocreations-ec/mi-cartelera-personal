/**
 * Proxy TMDB protegido. El token TMDB_READ_ACCESS_TOKEN solo vive en Secrets de Supabase.
 * La seguridad de sesión la maneja withSupabase({ auth:'user' }).
 * Requiere [functions.tmdb] verify_jwt = true.
 */
import { withSupabase } from 'npm:@supabase/server@1';
interface Payload { action?:unknown; query?:unknown; kind?:unknown; id?:unknown }
interface TMDBTitle { id:number; media_type?:string; title?:string; name?:string; overview?:string; poster_path?:string|null; release_date?:string; first_air_date?:string; vote_average?:number; runtime?:number|null; genres?:Array<{name:string}>; }
const imageUrl=(ruta:unknown)=>typeof ruta==='string'&&ruta.startsWith('/')?`https://image.tmdb.org/t/p/w500${ruta}`:null;
function mapear(p:TMDBTitle,kind:'pelicula'|'serie'){
  return {
    tmdb_id:p.id,
    titulo:(kind==='pelicula'?p.title:p.name)??'Sin título',
    tipo_contenido:kind,
    poster_url:imageUrl(p.poster_path),
    sinopsis:p.overview??'',
    fecha_estreno:(kind==='pelicula'?p.release_date:p.first_air_date)??null,
    calificacion_tmdb:typeof p.vote_average==='number'?Math.round(p.vote_average*10)/10:null,
    duracion:kind==='pelicula'&&Number.isSafeInteger(p.runtime)&&Number(p.runtime)>0?p.runtime:null,
    generos:(p.genres??[]).map(g=>g.name),
  };
}
export default {
  fetch: withSupabase({ auth:'user' }, async(req)=>{
    if(req.method!=='POST')return Response.json({ error:'Método no permitido' },{status:405});
    let body:Payload;
    try { body=await req.json() as Payload; }catch{return Response.json({error:'JSON inválido'},{status:400});}
    const token=Deno.env.get('TMDB_READ_ACCESS_TOKEN');
    if(!token)return Response.json({error:'Falta TMDB_READ_ACCESS_TOKEN en Supabase Secrets'},{status:500});
    let endpoint='';
    const accion=body.action;
    if(accion==='search'){
      if(typeof body.query!=='string'||body.query.trim().length<1||body.query.length>120)return Response.json({error:'Consulta de búsqueda inválida (1-120 caracteres)'},{status:400});
      endpoint=`/search/multi?query=${encodeURIComponent(body.query.trim())}&language=es-ES&include_adult=false&page=1`;
    }else if(accion==='detail'||accion==='runtime'){
      if(typeof body.id!=='number'||!Number.isSafeInteger(body.id)||body.id<=0)return Response.json({error:'ID inválido'},{status:400});
      const tipo=accion==='runtime'?'movie':body.kind==='pelicula'?'movie':body.kind==='serie'?'tv':null;
      if(!tipo)return Response.json({error:'Tipo de contenido inválido'},{status:400});
      endpoint=`/${tipo}/${body.id}?language=es-ES`;
    }else return Response.json({error:'Acción desconocida'},{status:400});
    try{
      const resp=await fetch(`https://api.themoviedb.org/3${endpoint}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'},signal:AbortSignal.timeout(12000)});
      if(!resp.ok)return Response.json({error:resp.status===404?'Película no encontrada':'Error temporal de TMDB'},{status:resp.status===404?404:502});
      const data=await resp.json() as TMDBTitle & {results?:TMDBTitle[]};
      if(accion==='search'){
        const results=(data.results??[]).filter(x=>x.media_type==='movie'||x.media_type==='tv').map(x=>mapear(x,x.media_type==='movie'?'pelicula':'serie'));
        return Response.json({results});
      }
      if(accion==='runtime')return Response.json({runtime:Number.isSafeInteger(data.runtime)&&Number(data.runtime)>0?data.runtime:null});
      return Response.json({title:mapear(data,body.kind as 'pelicula'|'serie')});
    }catch{return Response.json({error:'No fue posible conectar con TMDB'},{status:504});}
  }),
};
