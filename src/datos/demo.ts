import type { Titulo, MiItem, SesionGuardada } from '../types';
// Catálogo inventado para demostración offline; NO procede de TMDB.
export const catalogoDemo: Titulo[] = [
  { tmdb_id: 900001, titulo: 'El último faro', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Una ingeniera descubre una comunidad escondida en una costa que parecía deshabitada.', fecha_estreno: '2025-01-11', calificacion_tmdb: null, duracion: 96, generos: ['Drama', 'Aventura'] },
  { tmdb_id: 900002, titulo: 'Órbita azul', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Una tripulación recibe una señal imposible desde los confines de su sistema solar.', fecha_estreno: '2024-04-02', calificacion_tmdb: null, duracion: 128, generos: ['Ciencia ficción'] },
  { tmdb_id: 900003, titulo: 'Tardes de verano', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Dos amigos vuelven a su pueblo para cumplir una promesa hecha muchos años atrás.', fecha_estreno: '2023-08-15', calificacion_tmdb: null, duracion: 87, generos: ['Comedia', 'Drama'] },
  { tmdb_id: 900004, titulo: 'La carta de medianoche', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Una periodista investiga una serie de cartas anónimas que revelan recuerdos perdidos.', fecha_estreno: '2024-11-05', calificacion_tmdb: null, duracion: 112, generos: ['Misterio'] },
  { tmdb_id: 900005, titulo: 'Señales en la nieve', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'En una expedición polar, un grupo debe tomar decisiones difíciles antes del amanecer.', fecha_estreno: '2022-06-12', calificacion_tmdb: null, duracion: 137, generos: ['Thriller'] },
  { tmdb_id: 900006, titulo: 'Ciudad de papel', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Un ilustrador dibuja mapas que parecen cambiar la ciudad durante la noche.', fecha_estreno: '2026-03-18', calificacion_tmdb: null, duracion: null, generos: ['Fantasía'] },
  { tmdb_id: 900007, titulo: 'Rutas cruzadas', tipo_contenido: 'pelicula', poster_url: null, sinopsis: 'Una larga carretera reúne a personas que jamás se habrían conocido.', fecha_estreno: '2025-07-10', calificacion_tmdb: null, duracion: 104, generos: ['Aventura'] },
  { tmdb_id: 900008, titulo: 'Después de la lluvia', tipo_contenido: 'serie', poster_url: null, sinopsis: 'Una familia reconstruye sus vínculos después de un cambio inesperado.', fecha_estreno: '2024-09-25', calificacion_tmdb: null, duracion: null, generos: ['Drama'] },
];
const keyLista = 'cartelera_demo_lista_v1';
const keySesiones = 'cartelera_demo_sesiones_v1';
function leer<T>(key:string):T|null { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; } }
export function listaDemo():MiItem[] {
  const anterior = leer<MiItem[]>(keyLista);
  if (anterior) return anterior;
  const semilla = [0,1,2,5].map((i,index):MiItem=>({
    ...catalogoDemo[i], id:index+1, estado:'por_ver', calificacion_personal:null, comentario:null,
    fecha_agregado:new Date().toISOString(),
  }));
  localStorage.setItem(keyLista,JSON.stringify(semilla));return semilla;
}
export function guardarListaDemo(items:MiItem[]):void { localStorage.setItem(keyLista,JSON.stringify(items)); }
export function sesionesDemo():SesionGuardada[] { return leer<SesionGuardada[]>(keySesiones) ?? []; }
export function guardarSesionesDemo(items:SesionGuardada[]):void { localStorage.setItem(keySesiones,JSON.stringify(items)); }
