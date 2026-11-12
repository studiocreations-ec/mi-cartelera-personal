# ¿Cómo usar y entregar la cartelera desde cero?

## Opción rápida: mostrar que la app funciona como DEMO
1. Descomprime el ZIP. Abre la carpeta que contiene `package.json` en **Visual Studio Code**.
2. En la terminal ejecuta `npm install` (requiere internet).
3. Ejecuta `npm run dev`. Abre el enlace que aparece. Verás una etiqueta **MODO DEMOSTRACIÓN**.
4. En **Explorar títulos**, abre alguno y agrégalo a tu lista. En **Noche de película**, selecciona 180 minutos, añade películas que quepan, guarda la sesión y vuelve a cargar.
5. **No presentes la demo como Supabase/RLS/TMDB real**: sus películas son ficticias, por diseño.

## Opción para cumplir las partes funcionales y de seguridad de la rúbrica
1. Regístrate en Supabase y TMDB; sigue `README.md` para configurar ambas conexiones y desplegar la función `tmdb`.
2. Crea `.env.local` con URL y clave publicable de Supabase; nunca añadas el token privado TMDB a ese archivo.
3. Ejecuta los dos SQL en el orden indicado, crea dos cuentas reales distintas y prueba lectura/guardado/borrado de sesiones.
4. Ejecuta `npm test`, `npm run build`, `npm run format:check` (si Prettier detecta estilo, usa `npm run format` y vuelve a ejecutar check).
5. Registra **resultados observados**, fechas y capturas en `docs/VERIFICACION.md`; completa `docs/AUDITORIA.md`.
6. Publica el repositorio en GitHub y despliega en Vercel; añade variables públicas en Vercel y tu URL real en Supabase Auth.

## Punto que no se puede arreglar sin el repositorio antiguo
La consigna exige continuar el Proyecto 3 *en el mismo repositorio*. Este ZIP reconstruye E1 y E2 desde cero, pero no tiene el historial de la entrega anterior. El profesor podría bajar puntos por ese motivo aunque se ejecute el proyecto nuevo. No inventes commits ni una entrega 3 anterior.

## Archivos clave del ZIP
- `README.md`: guía de instalación completa.
- `AGENTS.md`, `CLAUDE.md`, `.claude/`: harness de Claude Code.
- `docs/prd/`, `docs/backlog/`, `docs/specs/`: planificación previa de E2.
- `supabase/migrations/`: tablas, políticas RLS y RPC.
- `src/dominio/nochePelicula.ts`: regla pura; `.test.ts` contiene Vitest.
- `docs/VERIFICACION.md` y `docs/AUDITORIA.md`: evidencias pendientes, sin pruebas inventadas.
