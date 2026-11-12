# AUDITORÍA E4 — sin resultados inventados

| Criterio | Estado al entregar archivos | Evidencia / pendiente |
|---|---|---|
| Harness AGENTS/CLAUDE/skill/hook | Implementado estáticamente; ejecución pendiente | Verificar Claude Code y ≤40 líneas AGENTS |
| Estado inicial corregido por estudiante | Pendiente | No se tuvo Proyecto 3 original; reconstrucción explícita |
| PRD E1/E2, 5 decisiones y criterios | Preparados | Revisar y aprobar personalmente |
| Refinamiento y tickets INVEST/DoD | Preparados | `docs/backlog` |
| Spec, datos, RLS, contratos y trazabilidad | Preparados | `docs/specs/E2-NOCHE-PELICULA.md` |
| E2 cálculo de tiempo 30–600, pausas, igualdad | Implementado; ejecución de Vitest pendiente | `src/dominio/nochePelicula.ts`, tests |
| E2 interfaz y persistencia | Código preparado; backend real pendiente | Noche, servicios y migraciones |
| Claves TMDB fuera de frontend | Revisión estática favorable | Token solo en `supabase/functions/tmdb` |
| RLS con cuentas A/B | Sin verificar | Crear proyecto, 2 cuentas y tomar evidencia |
| Regresión E1 en reconstrucción | Sin verificar | Probar auth, TMDB, CRUD y filtros |
| Continuidad con Proyecto 3 original | No demostrable | El repositorio original no está disponible; NO afirmar cumplimiento |
| `npm run build` y `npm test` | Sin verificar | Requieren instalar dependencias npm |
| Diseño Bootstrap + brand board | Código/documentación preparados | Verificar 360 px, teclado, foco y contraste |
| URL pública | Sin publicar | Desplegar Vercel y confirmar acceso |
| Proceso/commits de tickets | Revisar log incluido si presente | No atribuir commits a Proyecto 3 anterior |

## Riesgos conocidos
1. Sin Proyecto 3 original no se puede satisfacer plenamente «evolucionar el mismo repositorio».
2. La demo local no prueba RLS, JWT ni TMDB.
3. La función SQL valida matemáticamente las duraciones enviadas, pero no compara con TMDB en una segunda consulta segura. Anotado en la spec.
4. Sin configurar Supabase + TMDB no está operativa la integración externa.

## Recomendación de corrección por prioridad
1. Ejecutar instalación, Vitest, build y pruebas UI.
2. Migrar Supabase y desplegar función TMDB; probar A/B y registrar V09.
3. Publicar en Vercel; comprobar login y rutas.
4. Si se consigue repositorio Proyecto 3, integrar cambios en él y sustituir historial de reconstrucción por historia legítima.
