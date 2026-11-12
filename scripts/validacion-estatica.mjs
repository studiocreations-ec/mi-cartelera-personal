/** Sintaxis e imports relativos, sin pretender sustituir TypeScript/Vitest/build. */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); }
catch { ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js'); }
let archivos = 0;
let errores = 0;
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!/\.(ts|tsx)$/.test(p)) continue;
    archivos += 1;
    const content = readFileSync(p, 'utf8');
    const kind = p.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sf = ts.createSourceFile(p, content, ts.ScriptTarget.ESNext, true, kind);
    for (const d of sf.parseDiagnostics) { console.error('Sintaxis:', p, d.messageText); errores += 1; }
    for (const match of content.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      const candidate = resolve(dirname(p), match[1]);
      if (![candidate, `${candidate}.ts`, `${candidate}.tsx`, `${candidate}.js`, `${candidate}.jsx`, `${candidate}/index.ts`, `${candidate}/index.tsx`].some(existsSync)) {
        console.error('Import no encontrado:', p, match[1]); errores += 1;
      }
    }
  }
}
walk('src'); walk('supabase/functions');
console.log(`Revisión sintáctica: ${archivos} archivos TS/TSX, ${errores} errores.`);
process.exitCode = errores ? 1 : 0;
