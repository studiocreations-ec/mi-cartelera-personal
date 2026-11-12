# VERIFICACIÓN — registro reproducible

**Estado del documento:** archivo preparado; rellenar en el entorno real. No escribir «cumple» por ver código, ni confundir el catálogo ficticio con TMDB real. La reconstrucción no hereda el repositorio original.

| ID | Prueba | Resultado esperado | Resultado obtenido | Estado | Evidencia |
|---|---|---|---|---|---|
| V01 | `npm install`, `npm test` | Tests Vitest verdes | Pendiente en equipo con npm | Sin verificar | `evidencias/V01-vitest.png` |
| V02 | `npm run build` | TypeScript sin errores y dist generado | Pendiente | Sin verificar | `V02-build.png` |
| V03 | 30, 600, 29, 601 y 90.5 min | extremos válidos, resto rechazado | Pendiente en navegador | Sin verificar | `V03-minutos.png` |
| V04 | 100 + pausa 10 + 90 en 200 | total 200 y restante 0 | Pendiente | Sin verificar | `V04-exacto.png` |
| V05 | Agregar título que excede, duplicado y quitar | impide, explica, recalcula | Pendiente | Sin verificar | `V05-bordes.png` |
| V06 | Película TMDB sin runtime | no agregable y razón | Pendiente con backend real | Sin verificar | `V06-runtime.png` |
| V07 | Listar solo película por_ver | no series ni vistas | Pendiente | Sin verificar | `V07-filtros.png` |
| V08 | Guardar, recargar y borrar sesión | persiste y usuario gestiona propia | Pendiente en Supabase real | Sin verificar | `V08-sesion.png` |
| V09 | B inicia sesión e intenta leer/borrar A | B no ve ni modifica A | Pendiente: requiere dos cuentas | Sin verificar | `V09-rls.png` |
| V10 | En E1: registro, login, búsqueda, CRUD, estados | funciones presentes y funcionales | Pendiente con Supabase real | Sin verificar | `V10-regresion.png` |
| V11 | 360 px, teclado, foco visible y etiquetas | sin desborde, campos accesibles | Pendiente en navegador | Sin verificar | `V11-responsive.png` |
| V12 | /commit, PostToolUse Prettier | hook funciona en Claude Code | Pendiente en Claude Code | Sin verificar | `V12-harness.png` |
| V13 | Origen histórico E1 | mismo repo y modificaciones rastreables | No puede verificarse sin repositorio 3 | No cumple continuidad | documentación de origen |

## Cómo actualizar
Escribe bajo «Resultado obtenido» fecha, URL/entorno, pasos reproducibles y valor que observaste. Guarda capturas sin tokens, contraseñas ni emails personales. Nunca fabrique una prueba con modo demo como si fuera TMDB/Supabase real.

## Prueba RLS A/B
1. Crear usuarios A/B reales (con credenciales privadas, nunca en Git). A guarda una película y una sesión.
2. Con la sesión B, `.from('sesiones_noche').select('*')` no devuelve las sesiones de A.
3. Con B, `.from('sesiones_noche').delete().eq('id', idA).select()` no debe devolver fila borrada.
4. Volver a A y comprobar que sigue visible su sesión.
5. Repetir para `sesion_peliculas`; verificar que el usuario A sí puede borrar su sesión.

**Pregunta de pausa:** ¿Qué podría fallar aunque el flujo visual funcione? La separación de datos entre usuarios; una app puede ocultar información en pantalla mientras su BD está mal protegida. Por eso se exige probar RLS con cuentas distintas, no únicamente con una demo local.
