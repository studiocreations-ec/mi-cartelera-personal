/** Reglas de negocio puras de E2: ninguna llamada a red ni base de datos. */
export const MIN_MINUTOS = 30;
export const MAX_MINUTOS = 600;
export const PAUSA_ENTRE_PELICULAS = 10;

export type ValidacionMinutos =
  | { valido: true; valor: number }
  | { valido: false; motivo: string };

export type EvaluacionSesion =
  | { valido: true; cabe: boolean; total: number; pausas: number; restante: number; motivo: string }
  | { valido: false; cabe: false; total: 0; pausas: 0; restante: 0; motivo: string };

export function validarMinutos(entrada: unknown): ValidacionMinutos {
  const numero = typeof entrada === 'number'
    ? entrada
    : typeof entrada === 'string' && /^\d+$/.test(entrada.trim())
      ? Number(entrada.trim())
      : NaN;
  if (!Number.isSafeInteger(numero) || numero < MIN_MINUTOS || numero > MAX_MINUTOS) {
    return { valido: false, motivo: `Ingresa un número entero entre ${MIN_MINUTOS} y ${MAX_MINUTOS} minutos.` };
  }
  return { valido: true, valor: numero };
}

export function evaluarSesion(
  minutosDisponibles: unknown,
  duraciones: ReadonlyArray<number | null | undefined>,
  pausa: number = PAUSA_ENTRE_PELICULAS,
): EvaluacionSesion {
  const tiempo = validarMinutos(minutosDisponibles);
  if (!tiempo.valido) {
    return { valido: false, cabe: false, total: 0, pausas: 0, restante: 0, motivo: tiempo.motivo };
  }
  if (!Number.isSafeInteger(pausa) || pausa < 0) {
    return { valido: false, cabe: false, total: 0, pausas: 0, restante: 0, motivo: 'La pausa debe ser un entero no negativo.' };
  }
  for (const duracion of duraciones) {
    if (!Number.isSafeInteger(duracion) || typeof duracion !== 'number' || duracion <= 0) {
      return { valido: false, cabe: false, total: 0, pausas: 0, restante: 0, motivo: 'Hay una película sin duración válida de TMDB.' };
    }
  }
  const pausas = Math.max(0, duraciones.length - 1) * pausa;
  const total = duraciones.reduce<number>((acumulado, duracion) => acumulado + (duracion ?? 0), 0) + pausas;
  if (!Number.isSafeInteger(total)) {
    return { valido: false, cabe: false, total: 0, pausas: 0, restante: 0, motivo: 'El tiempo calculado no es válido.' };
  }
  const cabe = total <= tiempo.valor;
  return {
    valido: true,
    cabe,
    total,
    pausas,
    restante: tiempo.valor - total,
    motivo: cabe ? 'La sesión cabe en tu tiempo.' : `La sesión excede tu tiempo en ${total - tiempo.valor} minutos.`,
  };
}

export function puedeAgregar(
  minutosDisponibles: unknown,
  duracionesElegidas: ReadonlyArray<number | null | undefined>,
  duracionNueva: number | null | undefined,
  pausa: number = PAUSA_ENTRE_PELICULAS,
): EvaluacionSesion {
  return evaluarSesion(minutosDisponibles, [...duracionesElegidas, duracionNueva], pausa);
}
