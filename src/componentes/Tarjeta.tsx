import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Film, Tv } from 'lucide-react';
import type { Titulo, MiItem } from '../types';
import { Poster } from './Poster';
export function Tarjeta({titulo,item}: {titulo:Titulo|MiItem;item?:MiItem}) {
  const subtitulo=(titulo.fecha_estreno??'').slice(0,4);
  const kind=titulo.tipo_contenido;
  const duracion='duracion' in titulo?titulo.duracion:null;
  return <article className="movie-card">
    <Link to={`/titulo/${kind}/${titulo.tmdb_id}`} className="movie-poster-link" aria-label={`Ver detalle de ${titulo.titulo}`}><Poster titulo={titulo.titulo} url={titulo.poster_url}/><span className="poster-arrow"><ArrowUpRight size={16}/></span></Link>
    <div className="movie-card-meta"><span>{kind==='pelicula'?<Film size={13}/>:<Tv size={13}/>} {kind==='pelicula'?'PELÍCULA':'SERIE'}</span><span>{subtitulo||'Sin año'}</span></div>
    <Link className="movie-card-title" to={`/titulo/${kind}/${titulo.tmdb_id}`}>{titulo.titulo}</Link>
    <div className="movie-card-footer">{item?<span className={`tag-estado ${item.estado}`}>{item.estado.replace('_',' ')}</span>:duracion?<span><Clock3 size={14}/> {duracion} min</span>:<span>Descubre más</span>}</div>
  </article>;
}
