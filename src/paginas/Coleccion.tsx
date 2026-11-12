import { useEffect,useMemo,useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart,Search,SlidersHorizontal } from 'lucide-react';
import { listarColeccion } from '../servicios/coleccion';
import { Tarjeta } from '../componentes/Tarjeta';
import type { Estado,MiItem } from '../types';
type Filtro='todos'|Estado;
export default function Coleccion(){const [items,setItems]=useState<MiItem[]>([]);const [error,setError]=useState('');const [loading,setLoading]=useState(true);const [filtro,setFiltro]=useState<Filtro>('todos');const [q,setQ]=useState('');const [orden,setOrden]=useState('reciente');
 useEffect(()=>{let a=true;void listarColeccion().then(i=>{if(a)setItems(i);}).catch((e:unknown)=>{if(a)setError(e instanceof Error?e.message:'No se pudo cargar tu colección.');}).finally(()=>{if(a)setLoading(false);});return()=>{a=false;};},[]);
 const visibles=useMemo(()=>items.filter(i=>(filtro==='todos'||i.estado===filtro)&&i.titulo.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>orden==='titulo'?a.titulo.localeCompare(b.titulo):orden==='puntuacion'?(b.calificacion_personal??0)-(a.calificacion_personal??0):b.fecha_agregado.localeCompare(a.fecha_agregado)),[items,q,filtro,orden]);
 return <main><div className="page-overline">TU PROPIA HISTORIA</div><header className="page-heading"><span className="eyebrow">TU COLECCIÓN PERSONAL</span><h1>Todo lo que amas, <em>en un lugar.</em></h1><p>Revisa tus títulos pendientes, lo que estás viendo y tus favoritos de siempre.</p></header>
 <div className="filter-toolbar"><div className="segmented" role="group" aria-label="Filtrar por estado">{([['todos','Todos'],['por_ver','Por ver'],['viendo','Viendo'],['vista','Vistas']] as const).map(([k,v])=><button key={k} aria-pressed={filtro===k} onClick={()=>setFiltro(k)} className={filtro===k?'selected':''}>{v} <span>{k==='todos'?items.length:items.filter(x=>x.estado===k).length}</span></button>)}</div><div className="filter-controls"><label className="filter-search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar en mi lista" aria-label="Buscar en mi lista"/></label><label className="filter-sort"><SlidersHorizontal size={16}/><select value={orden} onChange={e=>setOrden(e.target.value)} aria-label="Ordenar colección"><option value="reciente">Más recientes</option><option value="titulo">Título A-Z</option><option value="puntuacion">Mi calificación</option></select></label></div></div>
 {error&&<div className="alert alert-danger" role="alert">{error}</div>}{loading?<div className="loader">Cargando tu colección...</div>:visibles.length?<div className="movie-grid">{visibles.map(item=><Tarjeta key={item.id} titulo={item} item={item}/>)}</div>:<div className="empty-state"><Heart size={35}/><h3>Aún no hay títulos aquí</h3><p>Encuentra algo que te interese y agrégalo a tu colección.</p><Link className="btn-main" to="/buscar">Descubrir películas ↗</Link></div>}
 </main>;
}
