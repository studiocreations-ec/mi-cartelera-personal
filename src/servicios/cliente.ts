import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';
export const esDemo = !url.startsWith('https://') || url.includes('TU_PROYECTO') || !key || key.includes('TU_CLAVE');
export const supabase = esDemo ? null : createClient(url, key, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});
export function clienteReal() {
  if (!supabase) throw new Error('El modo real requiere configurar Supabase.');
  return supabase;
}
