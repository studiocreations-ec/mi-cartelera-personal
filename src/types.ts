export type TipoContenido = 'pelicula' | 'serie';
export type Estado = 'por_ver' | 'viendo' | 'vista';
export interface Titulo {
  tmdb_id: number;
  titulo: string;
  tipo_contenido: TipoContenido;
  poster_url: string | null;
  sinopsis: string;
  fecha_estreno: string | null;
  calificacion_tmdb: number | null;
  duracion: number | null;
  generos: string[];
}
export interface MiItem extends Omit<Titulo, 'duracion' | 'generos'> {
  id: number;
  estado: Estado;
  calificacion_personal: number | null;
  comentario: string | null;
  fecha_agregado: string;
}
export interface PeliculaSesion {
  posicion: number;
  titulo_snapshot: string;
  duracion_minutos: number;
  tmdb_id: number;
}
export interface SesionGuardada {
  id: string;
  nombre: string;
  fecha: string;
  minutos_disponibles: number;
  total_minutos: number;
  creado_en: string;
  sesion_peliculas: PeliculaSesion[];
}
export interface EntradaSesion {
  nombre: string;
  fecha: string;
  minutos: number;
  peliculas: { id: number; duracion: number }[];
}
