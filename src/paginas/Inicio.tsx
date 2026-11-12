import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Clock3, Film, Heart, Search, Sparkles } from 'lucide-react';
import { listarColeccion } from '../servicios/coleccion';
import { listarSesiones } from '../servicios/sesiones';
import { buscarTitulos } from '../servicios/catalogo';
import type { MiItem,Titulo } from '../types';
import { Tarjeta } from '../componentes/Tarjeta';
export default function Inicio(){
  const [items,setItems]=useState<MiItem[]>([]);const [sesiones,setSesiones]=useState(0);const [tendencias,setTendencias]=useState<Titulo[]>([]);
  const [error,setError]=useState('');
  useEffect(()=>{let activo=true;void Promise.all([listarColeccion(),listarSesiones(),buscarTitulos('')]).then(([a,b,c])=>{if(activo){setItems(a);setSesiones(b.length);setTendencias(c.slice(0,4));}}).catch((e:unknown)=>{if(activo)setError(e instanceof Error?e.message:'Error al cargar datos');});return()=>{activo=false;};},[]);
  return <main>
    <div className="page-overline"><span className="pulse-dot"/> TU CINE, A TU RITMO</div>
    <section className="hero-home"><div className="hero-copy"><span className="eyebrow">UNA NUEVA FORMA DE ELEGIR</span><h1>Tu próxima gran <em>noche de cine.</em></h1><p>Guarda lo que quieres ver, organiza tus películas y encuentra la sesión perfecta para el tiempo que tienes.</p><div className="hero-actions"><Link to="/noche" className="btn-main"><CalendarClock size={19}/> Planear mi noche <ArrowRight size={18}/></Link><Link to="/buscar" className="btn-ghost">Explorar películas ↗</Link></div></div><div className="hero-art" aria-hidden="true"><div className="hero-ring"><div className="hero-circle"><span>✦</span><strong>MOVIE<br/>NIGHT</strong><small>PLAY YOUR NIGHT</small></div></div><div className="hero-pill hero-pill-top"><Clock3 size={16}/> 180 MIN DISPONIBLES</div><div className="hero-pill hero-pill-bottom"><Sparkles size={16}/> TU NOCHE PERFECTA</div></div></section>
    {error&&<div className="alert alert-warning" role="alert">{error}</div>}
    <section className="stats-grid" aria-label="Resumen de colección"><div className="stat-card"><span><Heart size={18}/></span><strong>{items.length}</strong><small>Títulos en mi lista</small></div><div className="stat-card"><span><Film size={18}/></span><strong>{items.filter(t=>t.estado==='por_ver').length}</strong><small>Pendientes por ver</small></div><div className="stat-card"><span><Sparkles size={18}/></span><strong>{items.filter(t=>t.estado==='vista').length}</strong><small>Ya disfrutadas</small></div><div className="stat-card"><span><CalendarClock size={18}/></span><strong>{sesiones}</strong><small>Noches planeadas</small></div></section>
    <section className="section-space"><div className="section-heading"><div><span className="eyebrow">TU PRÓXIMA HISTORIA</span><h2>Un lugar para cada película</h2><p>Deja de perder tiempo decidiendo qué ver.</p></div><Link to="/buscar" className="section-link">Explorar catálogo <ArrowRight size={16}/></Link></div>
      <div className="benefit-grid"><div className="benefit"><span className="benefit-icon"><Search size={24}/></span><h3>Descubre</h3><p>Encuentra películas y series que quieres recordar.</p></div><div className="benefit"><span className="benefit-icon"><Heart size={24}/></span><h3>Organiza</h3><p>Lleva tu lista, notas, estados y calificaciones.</p></div><div className="benefit"><span className="benefit-icon"><CalendarClock size={24}/></span><h3>Disfruta sin prisa</h3><p>Calcula cuánto cabe y guarda tu sesión ideal.</p></div></div></section>
    {tendencias.length>0&&<section className="section-space"><div className="section-heading"><div><span className="eyebrow">PARA EMPEZAR</span><h2>Historias para descubrir</h2></div></div><div className="movie-grid">{tendencias.map(f=><Tarjeta key={f.tmdb_id} titulo={f}/>)}</div></section>}
  </main>;
}
