# ESTADO INICIAL — reconstrucción desde cero

**Fecha de elaboración:** noviembre de 2026.

## Procedencia y límite importante
El estudiante no cuenta con los archivos ni el repositorio original de su Proyecto 3. Se recibió únicamente una consigna del Entregable 4 y se recuperó un README y el esquema SQL que describían una versión anterior. **Este repositorio es una reconstrucción nueva**, no una copia verificada ni una evolución comprobable del Proyecto 3 entregado anteriormente. No hay evidencia de uso real de Claude Code plan mode sobre el repositorio anterior. **Este punto reduce potencialmente la puntuación de continuidad y deuda heredada de la rúbrica.**

## E1 reconstruida en este repositorio
- React + TypeScript estricto + Vite y Bootstrap 5.
- Supabase Auth para usuario registrado, rutas privadas, registro y login.
- Tabla propia `mi_lista`: CRUD, estados `por_ver`/`viendo`/`vista`, comentario y calificación 1–5; RLS por usuario.
- Búsqueda y detalle TMDB mediante Edge Function autenticada; token solo en secreto de Supabase.
- Interfaz responsiva con navegación, filtros, búsqueda, estadísticas y edición.
- Modo demostración separado, con títulos **ficticios** y persistencia local; este modo **no prueba RLS, TMDB ni Supabase**.

## E2 propuesta
- Nueva ruta `/noche` protegida por autenticación en modo real.
- Solo películas propias `por_ver`, duración TMDB o aviso de ausencia.
- Tiempo 30–600 enteros, pausas 10 min entre películas, guardar/consultar/borrar sesiones, RLS en tablas nuevas.

## Riesgos y deuda aceptada
| ID | Situación real | Acción necesaria |
|---|---|---|
| D01 | No se cuenta con Proyecto 3 original ni su historial | Recuperarlo si el profesor exige continuidad demostrable; no atribuir este ZIP a la entrega anterior |
| D02 | No hay claves ni cuentas de Supabase/TMDB en este ZIP | Configurar en entorno real; ejecutar migraciones y desplegar Edge Function |
| D03 | Build/Vitest dependen de `npm install` | Ejecutarlos en máquina del estudiante con acceso a npm |
| D04 | Políticas RLS escritas, aislamiento A/B sin comprobar | Ejecutar pruebas con dos usuarios reales y documentar capturas |
| D05 | Sin despliegue público | Publicar en Vercel y verificar acceso autenticado |
| D06 | Duración suministrada al RPC no se valida contra TMDB en el servidor | Validar runtime en servicio confiable si se amplía el alcance; regla matemática SQL sí se aplica |

## Registro del estudiante
- Revisión personal del diagnóstico: pendiente.
- Ejecución de Claude Code en plan mode: no realizada ni afirmada.
- Verificación de E1 anterior contra E1 reconstruido: no verificable sin repo original.
