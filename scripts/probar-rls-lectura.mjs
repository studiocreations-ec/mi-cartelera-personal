/**
 * Prueba NO DESTRUCTIVA de aislamiento de lectura RLS E2.
 * Ejecutar desde repo E1 integrado:
 * node --env-file=.env.local --env-file=.env.pruebas-e4.local scripts/probar-rls-lectura.mjs
 * Requiere supabase-js instalado por E1 y sesiones E2 preexistentes para las dos cuentas.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
const configs = [
  { alias: 'A', email: process.env.E4_TEST_A_EMAIL, password: process.env.E4_TEST_A_PASSWORD },
  { alias: 'B', email: process.env.E4_TEST_B_EMAIL, password: process.env.E4_TEST_B_PASSWORD },
];
function fail(message) { console.error(`❌ ${message}`); process.exitCode = 1; }
function requireInput(value, label) { if (!value) throw new Error(`Falta ${label} en el archivo local de variables`); }
async function run() {
  requireInput(url, 'VITE_SUPABASE_URL'); requireInput(key, 'VITE_SUPABASE_PUBLISHABLE_KEY');
  if (configs[0].email === configs[1].email) throw new Error('Las cuentas A y B deben ser distintas');
  const auths = [];
  for (const c of configs) {
    requireInput(c.email, `E4_TEST_${c.alias}_EMAIL`);
    requireInput(c.password, `E4_TEST_${c.alias}_PASSWORD`);
    const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await client.auth.signInWithPassword({ email: c.email, password: c.password });
    if (error || !data.user) throw new Error(`No se puede autenticar usuario ${c.alias}: ${error?.message ?? 'sin usuario'}`);
    const { data: own, error: listError } = await client.from('sesiones_noche').select('id,user_id');
    if (listError) throw new Error(`Error consultando sesiones de ${c.alias}: ${listError.message}`);
    const leaked = (own ?? []).filter(row => row.user_id !== data.user.id);
    if (leaked.length) fail(`Usuario ${c.alias} recibió ${leaked.length} sesiones de otro dueño`);
    if (!own?.length) throw new Error(`El usuario ${c.alias} no tiene ninguna sesión: crea una en la interfaz y repite`);
    console.log(`✅ ${c.alias} listado propio: ${own.length} sesión(es); todas con user_id correcto`);
    auths.push({ client, user: data.user, own });
  }
  for (const [i,j] of [[0,1],[1,0]]) {
    const actor=auths[i], other=auths[j];
    const foreignId=other.own[0].id;
    const { data, error } = await actor.client.from('sesiones_noche').select('id,user_id').eq('id', foreignId);
    if (error) throw new Error(`Error consulta cruzada ${configs[i].alias}→${configs[j].alias}: ${error.message}`);
    if ((data ?? []).length) fail(`${configs[i].alias} SÍ pudo leer sesión de ${configs[j].alias}`);
    else console.log(`✅ ${configs[i].alias} NO pudo leer sesión ajena de ${configs[j].alias}`);
    const { data: child, error: childErr } = await actor.client.from('sesion_peliculas').select('id,sesion_id').eq('sesion_id', foreignId);
    if (childErr) throw new Error(`Error consulta detalles cruzada: ${childErr.message}`);
    if ((child ?? []).length) fail(`${configs[i].alias} SÍ pudo leer detalle de ${configs[j].alias}`);
    else console.log(`✅ ${configs[i].alias} NO pudo leer detalles ajenos de ${configs[j].alias}`);
  }
  await Promise.all(auths.map(x => x.client.auth.signOut()));
  if (!process.exitCode) console.log('✅ Comprobación de lectura RLS superada. Falta probar DELETE cruzado con datos desechables en la UI.');
}
try { await run(); } catch (e) { fail(e instanceof Error ? e.message : String(e)); }
