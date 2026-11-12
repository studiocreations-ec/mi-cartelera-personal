import { catalogoDemo } from '../datos/demo';
import { esDemo, clienteReal } from './cliente';
import type { Titulo, TipoContenido } from '../types';
type ResultadoTMDB = { results?: Titulo[]; title?: Titulo; runtime?: number | null };
async function llamarTMDB(body:Record<string,unknown>):Promise<ResultadoTMDB> {
  const { data, error } = await clienteReal().functions.invoke<ResultadoTMDB>('tmdb', { body });
  if (error || !data) throw new Error(error?.message ?? 'No se pudo consultar TMDB.');
  return data;
}
export async function buscarTitulos(texto:string):Promise<Titulo[]> {
  const q=texto.trim(); if (!q) return esDemo ? catalogoDemo : [];
  if (esDemo) return catalogoDemo.filter(x=>`${x.titulo} ${x.sinopsis} ${x.generos.join(' ')}`.toLocaleLowerCase('es').includes(q.toLocaleLowerCase('es')));
  const resultado=await llamarTMDB({ action:'search', query:q });
  return resultado.results ?? [];
}
export async function detalleTitulo(tipo:TipoContenido,id:number):Promise<Titulo> {
  if (esDemo) { const f=catalogoDemo.find(x=>x.tmdb_id===id&&x.tipo_contenido===tipo); if(!f) throw new Error('Título no encontrado en el catálogo de demostración.'); return f; }
  const resultado=await llamarTMDB({ action:'detail', kind:tipo, id });
  if (!resultado.title) throw new Error('No hay detalle disponible para este título.');
  return resultado.title;
}
export async function duracionPelicula(id:number):Promise<number|null> {
  if (esDemo) return catalogoDemo.find(x=>x.tmdb_id===id&&x.tipo_contenido==='pelicula')?.duracion ?? null;
  const result=await llamarTMDB({ action:'runtime', id });
  return Number.isSafeInteger(result.runtime) && (result.runtime ?? 0)>0 ? result.runtime ?? null : null;
}
