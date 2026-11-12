import { useCallback,useEffect,useMemo,useState } from 'react';
import { CalendarClock,Clock3,Plus,X,Save,Trash2,RefreshCw,Film,CheckCircle2,AlertCircle,ArrowRight,Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listarColeccion } from '../servicios/coleccion';
import { duracionPelicula } from '../servicios/catalogo';
import { crearSesion,eliminarSesion,listarSesiones } from '../servicios/sesiones';
import { evaluarSesion,puedeAgregar,validarMinutos } from '../dominio/nochePelicula';
import type { MiItem,SesionGuardada } from '../types';
import { Poster } from '../componentes/Poster';
type DuracionEstado={estado:'cargando'|'ok'|'sin_duracion'|'error';minutos:number|null};
function hoy(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function mensaje(error:unknown){return error instanceof Error?error.message:'Algo salió mal. Intenta de nuevo.';}
export default function Noche(){
 const [minutos,setMinutos]=useState('180');const [seleccion,setSeleccion]=useState<number[]>([]);const [pendientes,setPendientes]=useState<MiItem[]>([]);const [duraciones,setDuraciones]=useState<Record<number,DuracionEstado>>({});const [sesiones,setSesiones]=useState<SesionGuardada[]>([]);
 const [cargando,setCargando]=useState(true);const [guardando,setGuardando]=useState(false);const [error,setError]=useState('');const [exito,setExito]=useState('');const [nombre,setNombre]=useState('');const [fecha,setFecha]=useState(hoy);
 const cargar=useCallback(async()=>{
   setError('');setCargando(true);
   try{
    const [lista,guardadas]=await Promise.all([listarColeccion(),listarSesiones()]);
    const films=lista.filter(x=>x.tipo_contenido==='pelicula'&&x.estado==='por_ver');
    setPendientes(films);setSesiones(guardadas);setSeleccion([]);
    setDuraciones(Object.fromEntries(films.map(f=>[f.id,{estado:'cargando' as const,minutos:null}])));
    for(let i=0;i<films.length;i+=4){
      const bloque=await Promise.all(films.slice(i,i+4).map(async f=>{
        try{const n=await duracionPelicula(f.tmdb_id);return [f.id,{estado:n===null?'sin_duracion':'ok',minutos:n}] as const;}
        catch{return [f.id,{estado:'error',minutos:null}] as const;}
      }));
      setDuraciones(prev=>({...prev,...Object.fromEntries(bloque)}));
    }
   }catch(e:unknown){setError(mensaje(e));}
   finally{setCargando(false);}
 },[]);
 useEffect(()=>{void cargar();},[cargar]);
 const validacion=useMemo(()=>validarMinutos(minutos),[minutos]);
 const elegidas=useMemo(()=>seleccion.map(id=>pendientes.find(p=>p.id===id)).filter((p):p is MiItem=>!!p),[seleccion,pendientes]);
 const tiempos=elegidas.map(p=>duraciones[p.id]?.minutos??null);
 const evaluacion=useMemo(()=>evaluarSesion(minutos,tiempos),[minutos,tiempos.join('|')]);
 function agregar(f:MiItem){const d=duraciones[f.id]?.minutos??null;const r=puedeAgregar(minutos,tiempos,d);
   if(seleccion.includes(f.id)){setError('La película ya está en tu sesión.');return;}
   if(!r.valido||!r.cabe){setError(r.motivo);return;}
   setError('');setSeleccion(a=>[...a,f.id]);
 }
 function quitar(id:number){setSeleccion(a=>a.filter(x=>x!==id));setError('');}
 async function guardar(){if(!validacion.valido||!evaluacion.valido||!evaluacion.cabe||!elegidas.length){setError('Revisa el tiempo y selecciona al menos una película.');return;}
   if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)){setError('Elige una fecha válida.');return;}
   setGuardando(true);setError('');setExito('');try{await crearSesion({nombre,fecha,minutos:validacion.valor,peliculas:elegidas.map(p=>({id:p.id,duracion:duraciones[p.id].minutos as number}))});
     setSesiones(await listarSesiones());setSeleccion([]);setNombre('');setExito('¡Sesión guardada! Tus películas continúan en estado «por ver».');}
   catch(e:unknown){setError(mensaje(e));}finally{setGuardando(false);}}
 async function borrar(id:string){if(!window.confirm('¿Eliminar esta sesión? Las películas no se eliminan.'))return;try{await eliminarSesion(id);setSesiones(await listarSesiones());setExito('Sesión eliminada.');setError('');}catch(e:unknown){setError(mensaje(e));}}
 const elegibles=pendientes.filter(p=>duraciones[p.id]?.estado==='ok'&&validacion.valido&&(duraciones[p.id]?.minutos??Infinity)<=validacion.valor);
 const inhabilitadas=pendientes.filter(p=>!elegibles.includes(p));
 return <main><div className="page-overline">NUEVO · ÉPICA E2</div><header className="page-heading noche-heading"><span className="eyebrow"><CalendarClock size={15}/> EL PLAN PERFECTO, SIN PRISA</span><h1>Noche de <em>película.</em></h1><p>Cuéntanos cuánto tiempo tienes. Nosotros te ayudamos a elegir lo que sí alcanzas a terminar.</p></header>
 {error&&<div className="alert alert-danger d-flex gap-2 align-items-center" role="alert"><AlertCircle size={19}/>{error}</div>}{exito&&<div className="alert alert-success d-flex gap-2 align-items-center" role="status"><CheckCircle2 size={19}/>{exito}</div>}
 <div className="noche-layout"><div className="noche-main">
 <section className="panel-box"><div className="step-heading"><span className="step-number">01</span><div><h2>¿Cuánto tiempo tienes?</h2><p>Entre 30 minutos y 10 horas. Sin comprometer tus planes.</p></div></div><div className="time-entry"><label htmlFor="minutos" className="visually-hidden">Minutos disponibles</label><input id="minutos" type="number" min="30" max="600" step="1" inputMode="numeric" aria-invalid={!validacion.valido} value={minutos} onChange={e=>setMinutos(e.target.value)}/><span>MINUTOS LIBRES</span><span className="time-icon"><Clock3 size={23}/></span></div>{!validacion.valido&&<p role="alert" className="time-error">{validacion.motivo}</p>}<div className="time-preset">{[90,120,180,240].map(n=><button aria-pressed={minutos===String(n)} key={n} className={minutos===String(n)?'active':''} onClick={()=>setMinutos(String(n))}>{n} min</button>)}</div></section>
 <section className="panel-box"><div className="step-heading"><span className="step-number">02</span><div><h2>Películas que caben</h2><p>Solo las películas pendientes de tu colección. Usamos su duración real en modo conectado.</p></div><button className="icon-button refresh" aria-label="Actualizar duraciones y películas" title="Actualizar" onClick={()=>{void cargar();}}><RefreshCw size={18}/></button></div>
 {cargando&&<div className="loader" role="status">Comprobando películas y duraciones...</div>}
 {!cargando&&pendientes.length===0&&<div className="empty-inline"><Film size={32}/><h3>No tienes películas pendientes</h3><p>Primero agrega películas a tu lista y vuelve aquí.</p><Link to="/buscar" className="text-link">Descubrir películas <ArrowRight size={15}/></Link></div>}
 {!cargando&&validacion.valido&&elegibles.length===0&&pendientes.length>0&&<p className="helper-copy">No hay películas con duración conocida que quepan individualmente en el tiempo indicado.</p>}
 {!cargando&&validacion.valido&&elegibles.map(f=>{const d=duraciones[f.id];return <div className="noche-film" key={f.id}><Poster titulo={f.titulo} url={f.poster_url}/><div className="noche-film-main"><h3>{f.titulo}</h3><span><Clock3 size={14}/> {d.minutos} min · Por ver</span></div><button className="round-add" disabled={seleccion.includes(f.id)} aria-label={`Añadir ${f.titulo}`} onClick={()=>agregar(f)}>{seleccion.includes(f.id)?<CheckCircle2 size={18}/>:<Plus size={19}/>}</button></div>;})}
 {!cargando&&validacion.valido&&inhabilitadas.length>0&&<details className="unavailable"><summary>Ver películas que no caben o no tienen duración ({inhabilitadas.length})</summary><div>{inhabilitadas.map(f=><p key={f.id}><b>{f.titulo}</b><span>{duraciones[f.id]?.estado==='sin_duracion'?'Sin duración disponible':duraciones[f.id]?.estado==='error'?'Error consultando TMDB':duraciones[f.id]?.estado==='cargando'?'Cargando duración':`${duraciones[f.id]?.minutos??'?'} min · No cabe`}</span></p>)}</div></details>}
 </section></div>
 <aside className="noche-aside"><section className="panel-box session-panel"><div className="step-heading"><span className="step-number">03</span><div><h2>Tu sesión de cine</h2><p>Combina películas y conoce el tiempo que queda.</p></div></div>
 {elegidas.length===0?<div className="session-empty"><div className="session-empty-icon"><ClapperboardMini/></div><strong>Tu sesión comienza aquí</strong><p>Agrega películas desde la lista de la izquierda.</p></div>:<ol className="session-items">{elegidas.map(f=><li key={f.id}><span>{f.titulo}<small>{duraciones[f.id]?.minutos} min</small></span><button aria-label={`Quitar ${f.titulo}`} onClick={()=>quitar(f.id)}><X size={16}/></button></li>)}</ol>}
 <div className="session-metrics"><div><span>Películas</span><b>{elegidas.length}</b></div><div><span>Pausas · 10 min entre títulos</span><b>{evaluacion.valido?evaluacion.pausas:0} min</b></div><div><span>Tiempo total</span><b>{evaluacion.valido?evaluacion.total:0} min</b></div><div className="remaining"><span>Tiempo restante</span><strong>{evaluacion.valido?evaluacion.restante:'—'} <small>min</small></strong></div></div>
 {evaluacion.valido&&!evaluacion.cabe&&<p className="time-error">{evaluacion.motivo}</p>}
 <label className="field-label" htmlFor="nombre-sesion">Nombre de la sesión (opcional)</label><input className="session-field" id="nombre-sesion" maxLength={100} value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Mi noche de viernes"/>
 <label className="field-label" htmlFor="fecha-sesion">Fecha</label><input className="session-field" id="fecha-sesion" type="date" value={fecha} onChange={e=>setFecha(e.target.value)}/>
 <button className="btn-main w-100 save-btn" disabled={guardando||!validacion.valido||!evaluacion.valido||!evaluacion.cabe||elegidas.length===0} onClick={()=>{void guardar();}}><Save size={17}/>{guardando?'Guardando...':'Guardar mi sesión'}<ArrowRight size={17}/></button><p className="footnote"><Lightbulb size={14}/> Guardar una sesión no cambia el estado de las películas.</p>
 </section></aside></div>
 <section className="section-space"><div className="section-heading"><div><span className="eyebrow">LISTAS PARA CUANDO QUIERAS</span><h2>Mis noches guardadas <span className="count-inline">{sesiones.length}</span></h2></div></div>{sesiones.length===0?<div className="empty-inline saved-empty"><CalendarClock size={27}/><p>Cuando guardes una sesión aparecerá aquí.</p></div>:<div className="saved-grid">{sesiones.map(s=><article className="saved-card" key={s.id}><span className="eyebrow">SESIÓN GUARDADA</span><h3>{s.nombre}</h3><span className="saved-date"><CalendarClock size={15}/> {s.fecha}</span><ol>{s.sesion_peliculas.map((p,i)=><li key={`${s.id}-${i}`}>{p.titulo_snapshot} <small>{p.duracion_minutos} min</small></li>)}</ol><div className="saved-bottom"><span>{s.total_minutos} / {s.minutos_disponibles} min</span><button aria-label={`Eliminar sesión ${s.nombre}`} onClick={()=>{void borrar(s.id);}}><Trash2 size={16}/> Eliminar</button></div></article>)}</div>}</section>
 </main>;
}
function ClapperboardMini(){return <Film size={29}/>;}
