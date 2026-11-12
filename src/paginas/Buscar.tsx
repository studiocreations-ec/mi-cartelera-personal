import { useEffect,useState } from 'react';
import { Search,Clapperboard } from 'lucide-react';
import { buscarTitulos } from '../servicios/catalogo';
import type { Titulo } from '../types';
import { Tarjeta } from '../componentes/Tarjeta';
export default function Buscar(){
 const [q,setQ]=useState(''); const [aplicada,setAplicada]=useState('');const [resultados,setResultados]=useState<Titulo[]>([]);const [cargando,setCargando]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{let activo=true;setCargando(true);setError('');void buscarTitulos(aplicada).then(x=>{if(activo)setResultados(x);}).catch((e:unknown)=>{if(activo)setError(e instanceof Error?e.message:'No fue posible buscar títulos.');}).finally(()=>{if(activo)setCargando(false);});return()=>{activo=false;};},[aplicada]);
 return <main><div className="page-overline">EXPLORA · CREA TU LISTA</div><header className="page-heading"><span className="eyebrow">BUSCADOR DE PELÍCULAS</span><h1>Encuentra tu próxima <em>obsesión.</em></h1><p>Explora títulos, revisa su información y agrégalos a tu colección.</p></header><form onSubmit={e=>{e.preventDefault();setAplicada(q);}} className="search-box" role="search"><Search size={20}/><input aria-label="Buscar películas o series" placeholder="Busca una película, serie o género..." value={q} onChange={e=>setQ(e.target.value)}/><button type="submit">Buscar <span aria-hidden="true">↗</span></button></form>
 <div className="section-heading result-heading"><div><span className="eyebrow">RESULTADOS</span><h2>{aplicada?`Resultados para «${aplicada}»`:'Películas para comenzar'}</h2></div><span className="count-label">{resultados.length} títulos</span></div>
 {error&&<div role="alert" className="alert alert-danger">{error} Comprueba la configuración de TMDB y vuelve a intentar.</div>}
 {cargando?<div className="loader" role="status">Buscando títulos...</div>:resultados.length?<div className="movie-grid">{resultados.map(f=><Tarjeta titulo={f} key={`${f.tipo_contenido}-${f.tmdb_id}`}/>)}</div>:<div className="empty-state"><Clapperboard size={36}/><h3>No encontramos resultados</h3><p>Prueba con otra palabra o revisa tu conexión.</p></div>}
 </main>;
}
