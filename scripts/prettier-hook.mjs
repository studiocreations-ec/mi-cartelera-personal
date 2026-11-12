import { existsSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;
try {
  const event = JSON.parse(input || '{}');
  const candidate = event.tool_input?.file_path;
  if (typeof candidate !== 'string') process.exit(0);
  const root = resolve(process.cwd());
  const target = resolve(root, candidate);
  const rel = relative(root, target);
  if (rel.startsWith('..') || rel === '' || !/\.(tsx?|jsx?|json|md|css|html)$/.test(extname(target))) process.exit(0);
  if (!existsSync(target)) process.exit(0);
  const prettier = resolve(root, 'node_modules/.bin/prettier');
  if (!existsSync(prettier)) {
    process.stderr.write('Hook: Prettier no instalado; instala dependencia de desarrollo.\n');
    process.exit(0);
  }
  const res = spawnSync(prettier, ['--write', target], { cwd: root, encoding: 'utf8', timeout: 12000 });
  if (res.error || res.status !== 0) {
    process.stderr.write(`Hook Prettier falló: ${res.stderr ?? res.error?.message ?? 'sin detalles'}\n`);
    process.exit(2);
  }
} catch (error) {
  process.stderr.write(`Hook: entrada no válida: ${String(error)}\n`);
  process.exit(2);
}
