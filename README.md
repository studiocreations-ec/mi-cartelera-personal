# 🎬 Mi Cartelera Personal — E1 reconstruida + E2 Noche de película

**Trabajo académico creado desde cero porque no se dispone del Proyecto 3 original.** No atribuir este código ni su historial al repo antiguo. Incluye código fuente para una aplicación React/TypeScript/Vite/Bootstrap, una **demo offline con películas ficticias**, y la arquitectura lista para integrarse con **Supabase Auth/PostgreSQL/RLS + TMDB** mediante una Edge Function autenticada.

## Lo que permite
- **E1:** inicio de sesión (modo real), buscar películas/series, ver detalle, añadir a mi lista, filtrar por estado, editar estado 3 opciones, calificar de 1 a 5, comentar y eliminar.
- **E2:** 30–600 minutos enteros, solo películas propias `por_ver`, duración de TMDB, hasta 10 minutos entre dos títulos, guardado/recuperación/borrado de sesiones, sin alterar estado de películas, RLS con ownership.
- **UI:** responsive, navegación lateral/escritorio e inferior/móvil, modo oscuro, Bootstrap, etiquetas y mensajes de error.

## 1. Ejecutar demo sin credenciales
Instala Node.js 20.19+ y dependencias, en la raíz:

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`). Sin `.env.local` (o usando los valores marcadores), se activa **MODO DEMOSTRACIÓN**: películas ficticias e información en localStorage. El registro y RLS no se prueban en demo. Para limpiar: herramientas de desarrollador → Almacenamiento → localStorage de ese origen.

## 2. Configurar modo real Supabase + TMDB
1. Crea un proyecto en <https://supabase.com/dashboard>, habilita Email Authentication y confirma el correo si procede.
2. En SQL Editor ejecuta **en este orden**:
   - `supabase/migrations/20261019000000_mi_lista.sql`
   - `supabase/migrations/20261104000000_noche_pelicula.sql`
3. Copia `.env.example` a `.env.local` y reemplaza solo las dos variables por las **públicas** reales:

```env
VITE_SUPABASE_URL=https://TU-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... 
```

4. Crea una cuenta TMDB y obtiene **API Read Access Token** en <https://www.themoviedb.org/settings/api>. Ese token **NUNCA** se pone en `VITE_*`, Git, screenshots ni en el navegador.
5. Instala/usa Supabase CLI y despliega la Edge Function:

```bash
npx supabase login
npx supabase link --project-ref TU_REF
npx supabase secrets set TMDB_READ_ACCESS_TOKEN=TU_TOKEN_PRIVADO
npx supabase functions deploy tmdb
```

No guardes `TU_TOKEN_PRIVADO` literalmente ni el comando con secreto en archivos Git. Para evitar el historial de shell, usa fichero temporal excluido por `.gitignore` y `npx supabase secrets set --env-file .env.functions`, después bórralo. La configuración exige JWT en `supabase/config.toml`.

6. `npm run dev` y registra una cuenta real. La ruta de sesión solo funciona tras login. Prueba la búsqueda, añade películas `por_ver`, luego **Noche de película**. Para producción, agrega la URL final en **Supabase Authentication → URL Configuration (Redirect URLs)**.

## 3. Verificar la calidad (obligatorio para entregar)

```bash
npm test
npm run build
npm run format:check
```

Documenta **la salida real** y capturas en `docs/VERIFICACION.md`. Prueba RLS con dos cuentas A/B; los roles SQL privilegiados del Dashboard no sirven para simular usuarios normales. No desactives RLS. Ejecuta la lista de `docs/AUDITORIA.md` antes de afirmar que está completo.

## 4. Publicación
Sube el proyecto a GitHub y luego a <https://vercel.com/new>. Framework Vite; Build `npm run build`, Output `dist`. Agrega las variables públicas a Environment Variables. Mantén secrets TMDB en Supabase. `vercel.json` evita 404 con rutas React. Copia la URL y comprueba `/`, `/coleccion`, `/noche` en navegador incógnito con cuenta válida.

## 5. Proceso rubricado
Lee `AGENTS.md`, `CLAUDE.md`, `.claude/skills/commit/SKILL.md`, `docs/ESTADO-INICIAL.md`, `docs/prd/PRD.md`, `docs/backlog/`, `docs/specs/E2-NOCHE-PELICULA.md`, `DESIGN.md` y `docs/diseno/brand-board.html`. Documenta decisiones ratificadas por ti, evidencias y commits reales. No inventes una historia de Proyecto 3 que no existe.

## Árbol
```text
src/{paginas,componentes,contexto,servicios,dominio,datos}
supabase/migrations/{...mi_lista.sql,...noche_pelicula.sql}
supabase/functions/tmdb/index.ts
docs/{ESTADO-INICIAL,prd,backlog,specs,diseno,VERIFICACION,AUDITORIA}
AGENTS.md | CLAUDE.md | DESIGN.md | .claude/skills/commit/SKILL.md
```

**TMDB attribution:** This product uses the TMDB API but is not endorsed or certified by TMDB.

**Fuentes oficiales consultadas:** [Supabase Edge Function authentication](https://supabase.com/docs/guides/functions/auth), [Supabase signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword), [TMDB API Docs](https://developer.themoviedb.org/reference/intro/getting-started), [Vite](https://vite.dev/guide/), [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

### Prueba RLS no destructiva opcional
Tras guardar una sesión con cada cuenta de prueba, crea un archivo privado `.env.pruebas-e4.local` a partir del ejemplo y ejecuta:

```bash
node --env-file=.env.local --env-file=.env.pruebas-e4.local scripts/probar-rls-lectura.mjs
```

El script prueba solo lectura cruzada. Para borrar sesión ajena, sigue el procedimiento manual de `docs/VERIFICACION.md` con una sesión **desechable**.
