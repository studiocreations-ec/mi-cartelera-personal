import { guardarSesionesDemo, listaDemo, sesionesDemo } from '../datos/demo';
import { clienteReal, esDemo } from './cliente';
import { evaluarSesion } from '../dominio/nochePelicula';
import type { EntradaSesion, SesionGuardada } from '../types';
export async function listarSesiones():Promise<SesionGuardada[]> {
  if(esDemo) return sesionesDemo().sort((a,b)=>b.creado_en.localeCompare(a.creado_en));
  const {data,error}=await clienteReal().from('sesiones_noche').select('id,nombre,fecha,minutos_disponibles,total_minutos,creado_en,sesion_peliculas(posicion,titulo_snapshot,duracion_minutos,tmdb_id)').order('creado_en',{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]).map(s=>({...s,sesion_peliculas:[...(s.sesion_peliculas??[])].sort((a,b)=>a.posicion-b.posicion)})) as SesionGuardada[];
}
export async function crearSesion(x:EntradaSesion):Promise<void>{
  const validacion=evaluarSesion(x.minutos,x.peliculas.map(p=>p.duracion));
  if(!validacion.valido||!validacion.cabe||!x.peliculas.length)throw new Error('La sesión no cabe o está vacía.');
  if(esDemo) {
    const lista=listaDemo();
    const peliculas=x.peliculas.map((p,i)=>{
      const item=lista.find(t=>t.id===p.id&&t.estado==='por_ver'&&t.tipo_contenido==='pelicula');
      if(!item)throw new Error('Hay una película que no está disponible en tu lista.');
      return { posicion:i+1,titulo_snapshot:item.titulo,tmdb_id:item.tmdb_id,duracion_minutos:p.duracion };
    });
    const s:SesionGuardada={id:crypto.randomUUID(),nombre:x.nombre.trim()||'Noche de película',fecha:x.fecha,minutos_disponibles:x.minutos,total_minutos:validacion.total,creado_en:new Date().toISOString(),sesion_peliculas:peliculas};
    guardarSesionesDemo([s,...sesionesDemo()]);return;
  }
  const {error}=await clienteReal().rpc('guardar_sesion_noche',{p_nombre:x.nombre,p_fecha:x.fecha,p_minutos:x.minutos,p_peliculas:x.peliculas.map(p=>({mi_lista_id:p.id,duracion_minutos:p.duracion}))});
  if(error)throw new Error(error.message);
}
export async function eliminarSesion(id:string):Promise<void>{
  if(esDemo){guardarSesionesDemo(sesionesDemo().filter(x=>x.id!==id));return;}
  const {error}=await clienteReal().from('sesiones_noche').delete().eq('id',id);
  if(error)throw new Error(error.message);
}
