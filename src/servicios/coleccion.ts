import { listaDemo, guardarListaDemo } from '../datos/demo';
import { esDemo, clienteReal } from './cliente';
import type { Estado, MiItem, Titulo } from '../types';
export async function listarColeccion():Promise<MiItem[]> {
  if (esDemo) return listaDemo().sort((a,b)=>b.fecha_agregado.localeCompare(a.fecha_agregado));
  const { data, error }=await clienteReal().from('mi_lista').select('*').order('fecha_agregado',{ascending:false});
  if(error) throw new Error(error.message); return (data ?? []) as MiItem[];
}
export async function agregarColeccion(f:Titulo):Promise<MiItem> {
  if(esDemo) {
    const lista=listaDemo(); const duplicado=lista.find(x=>x.tmdb_id===f.tmdb_id&&x.tipo_contenido===f.tipo_contenido);
    if(duplicado) throw new Error('Este título ya está en tu lista.');
    const item:MiItem={...f,id:Math.max(0,...lista.map(x=>x.id))+1,estado:'por_ver',calificacion_personal:null,comentario:null,fecha_agregado:new Date().toISOString()};
    guardarListaDemo([item,...lista]);return item;
  }
  const { data, error }=await clienteReal().from('mi_lista').insert({
    tmdb_id:f.tmdb_id,titulo:f.titulo,poster_url:f.poster_url,tipo_contenido:f.tipo_contenido,
    sinopsis:f.sinopsis,fecha_estreno:f.fecha_estreno,calificacion_tmdb:f.calificacion_tmdb,
    estado:'por_ver',
  }).select('*').single();
  if(error) throw new Error(error.code==='23505'?'Este título ya está en tu lista.':error.message);
  return data as MiItem;
}
export async function actualizarColeccion(id:number,campos:{estado:Estado;calificacion_personal:number|null;comentario:string}):Promise<void> {
  if(esDemo){ const lista=listaDemo(); if(!lista.some(x=>x.id===id))throw new Error('Elemento no encontrado.');guardarListaDemo(lista.map(x=>x.id===id?{...x,...campos}:x));return; }
  const {error}=await clienteReal().from('mi_lista').update(campos).eq('id',id);
  if(error)throw new Error(error.message);
}
export async function quitarColeccion(id:number):Promise<void> {
  if(esDemo){guardarListaDemo(listaDemo().filter(x=>x.id!==id));return;}
  const {error}=await clienteReal().from('mi_lista').delete().eq('id',id);if(error)throw new Error(error.message);
}
