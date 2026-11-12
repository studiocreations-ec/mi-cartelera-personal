# SPEC E2 — Noche de película

**Estado:** diseño documentado para implementación en el repositorio reconstruido. Documentos fuente: `docs/prd/PRD.md`, `docs/backlog/HISTORIAS-Y-CRITERIOS.md` y `DESIGN.md`. Sin el Proyecto 3 original no se puede afirmar continuidad histórica.

## Datos
E1 crea `mi_lista` en `supabase/migrations/20261019000000_mi_lista.sql`.
E2 crea `sesiones_noche` y `sesion_peliculas` con migración `20261104000000_noche_pelicula.sql` (aditiva, sin alterar columnas E1). Sesión (`uuid`, `user_id`, `fecha`, `nombre`, `minutos_disponibles`, `total_minutos`, `creado_en`). Ítems (`sesion_id`, `user_id`, `mi_lista_id` nullable, `posicion`, `tmdb_id`, `titulo_snapshot`, `duracion_minutos`). Si se borra `mi_lista`, la sesión histórica conserva snapshots.

## RLS y seguridad
Las tablas E2 permiten SELECT por propietario; `sesiones_noche` permite DELETE por propietario. Inserción solo mediante la función `guardar_sesion_noche` concedida a `authenticated`: comprueba `auth.uid()`, `mi_lista_id`, propiedad, estado, tipo y total con pausas; no acepta `user_id` del cliente. `anon` no tiene acceso. La Edge Function `tmdb` exige JWT de usuario a través de `withSupabase({auth:'user'})`, y lee el token de `TMDB_READ_ACCESS_TOKEN` del servidor. En el cliente solo hay URL y clave publicable Supabase. **Límite conocido:** la función SQL recalcula las duraciones que recibe, pero no verifica con TMDB que sean auténticas; esta autenticidad requiere otro control servidor si se amplía alcance.

## Dominio puro
`src/dominio/nochePelicula.ts`: `validarMinutos`, `evaluarSesion`, `puedeAgregar`. Para N películas, total `sum(duraciones)+10*max(0,N-1)`. Una sola: sin pausa. Igualdad: cabe. Nunca usar `any`. `src/dominio/nochePelicula.test.ts` cubre mínimo, máximo, igualdad, ausencia de duración, pausa y exceso.

## Servicios separados
`src/servicios/catalogo.ts`: buscar y consultar TMDB; función `duracionPelicula()` usa detalle TMDB `runtime`. `src/servicios/coleccion.ts`: CRUD E1. `src/servicios/sesiones.ts`: listar, guardar por RPC y borrar sesiones. `src/servicios/cliente.ts`: conexión Supabase o modo demo explícito. Las páginas no hacen peticiones directas a Supabase ni a TMDB.

## Componentes y UX
`src/paginas/Noche.tsx` dentro de layout privado; control de minutos, presets, películas pendientes, mensajes carga/error/sin duración, selección, resumen de total/pausas/restante, nombre y fecha, botón de guardar, sesiones históricas y borrar. Interfaz guiada por `DESIGN.md`, Bootstrap y CSS propio.

## DEBE / NO DEBE
| ID | Contrato verificable | Criterios |
|---|---|---|
| S01 | DEBE aceptar solo enteros 30–600 | C01–C02 |
| S02 | DEBE listar solo películas personales `por_ver` con duración | C03, C06 |
| S03 | DEBE mostrar carga, error y ausencia de duración con motivo | C04–C05 |
| S04 | DEBE incluir pausas intermedias de 10 minutos y permitir límite exacto | C07–C08 |
| S05 | NO DEBE añadir si excede, si falta duración o si es repetida | C09, C11 |
| S06 | DEBE recalcular todo al retirar una película | C10 |
| S07 | DEBE guardar y recuperar snapshots sin modificar estado en E1 | C12–C15 |
| S08 | DEBE permitir reutilizar título entre sesiones e impedir su edición | C16–C17 |
| S09 | NO DEBE dar acceso a datos ajenos; ruta privada en modo real | C18–C19 |
| S10 | NO DEBE alterar otras funciones E1 dentro de este repo | C20 |

## Trazabilidad criterio → verificación
| Criterio | Qué probar | Evidencia a aportar |
|---|---|---|
| C01–C02 | 30, 600, 29, 601, decimal | Vitest + pantalla |
| C03, C06 | mezcla de series, vistas y pendientes | pantalla y consulta |
| C04–C05 | runtime null / TMDB error | pantalla y registro |
| C07–C11 | 100+10+90=200, 201 no cabe; retirar | Vitest + interacción |
| C12–C14 | guardar, refrescar, leer, comparar estados | pantalla + consulta SQL |
| C15–C17 | borrar título, reutilizar, intentar editar | consulta SQL + pantalla |
| C18–C19 | logout y acceso cruzado usuarios A/B | verificación Supabase con 2 cuentas |
| C20 | login, búsqueda, CRUD, filtros E1 | checklist regresión |

## Trazabilidad ticket → archivos
| Ticket | Tipo | Dependencia | Archivos | Definition of Done |
|---|---|---|---|---|
| E2-T01 | Dominio | Spec aprobada | `src/dominio/nochePelicula.ts`, `.test.ts` | Vitest verde, borde exacto, sin red |
| E2-T02 | Datos y seguridad | T01 | `supabase/migrations/20261104000000_noche_pelicula.sql` | Migración aplicada y RLS A/B probada |
| E2-T03 | Servicios | T02 | `src/servicios/catalogo.ts`, `sesiones.ts`, función `tmdb` | Carga/error/runtime correcto, secretos seguros |
| E2-T04 | Interfaz | T01–T03 | `src/paginas/Noche.tsx`, `src/styles.css`, `main.tsx` | Ruta, flujo completo, estados y responsive |
| E2-T05 | Verificación | T04 | `docs/VERIFICACION.md`, `docs/AUDITORIA.md` | Evidencias reales y fallos registrados |

## Anotaciones de implementación
- El modo demo usa ficción y localStorage; **jamás sustituye las pruebas Supabase/RLS ni TMDB**.
- Sin proyecto anterior, no existe comparación fiable de regresión con entrega E1 del usuario.
- Se requiere validar contratos con las cuentas y claves reales antes de afirmar conformidad total.
