# Tickets de implementación E2

**Regla:** la documentación E2 se revisa antes de marcar tickets como terminados; los commits de este repositorio son una reconstrucción nueva, no del Proyecto 3 original. Solo reportar `done` tras pruebas reales.

| Ticket | Tipo | Resumen | Dependencias | Definition of Done (DoD) | Criterios |
|---|---|---|---|---|---|
| E2-T01 | feat/domain | Regla pura de límites, suma, pausa y «cabe» | Spec aprobada | Funciones sin red, tests de bordes en verde, sin `any` | C01,C02,C07–C11 |
| E2-T02 | feat/db | Migración SQL, snapshots, sesión y RLS | T01 | Migración aplicada, roles/privilegios revisados, dos usuarios prueban aislamiento | C12–C19 |
| E2-T03 | feat/api | Edge Function runtime TMDB + servicios de datos | T01,T02 | Token solo servidor, maneja error/carga, sin acceso directo a datos en UI | C03–C06,C12,C13 |
| E2-T04 | feat/ui | Pantalla privada y navegación integrada a E1 | T01,T03 | Responsive Bootstrap, accesibilidad, estados y guardado funcional | C01–C18 |
| E2-T05 | test/docs | Regresión E1, verificación y auditoría | T01–T04 | `VERIFICACION.md` con resultados reales, auditoría con evidencia y captura | C19,C20 |

## Registro de commits
Consultar `docs/HISTORIAL-RECONSTRUCCION.md` y `git log --oneline --reverse` si el ZIP incluye `.git`. Los tickets no se deben marcar terminados solo porque su archivo existe: la DoD exige pruebas reales con credenciales y evidencia de navegador.
