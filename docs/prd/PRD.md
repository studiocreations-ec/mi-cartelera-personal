# PRD — Mi Cartelera Personal

**Estado:** PRD E1/E2 de reconstrucción nueva. Las decisiones propuestas deben ser ratificadas por el estudiante; no se dispone del Proyecto 3 original. El PRD deliberadamente no define tablas, APIs, componentes ni librerías.

## Visión y problema
Mi Cartelera Personal ayuda al usuario a organizar títulos que quiere ver. En la E1 reconstruida puede guardar, consultar y gestionar sus preferencias (E1). La oportunidad E2 aparece cuando tiene una ventana libre y no sabe qué películas de su lista alcanzan a terminar antes de que se acabe ese tiempo. El éxito se logra cuando comienza un plan realista y puede terminarlo.

## Usuario objetivo
Persona autenticada que ya mantiene una lista de películas «por ver» y necesita seleccionar una o varias que se ajusten a su disponibilidad.

## E1 — Colección personal (reconstruida desde cero en esta entrega)
El usuario puede buscar títulos, agregarlos a su lista, consultar detalles, cambiar su estado, calificarlos, comentarlos, filtrar y eliminarlos. E2 debe convivir con estas funciones sin alterar comportamiento ni datos. **La E1 original de un Proyecto 3 anterior no estuvo disponible**, por lo que no puede garantizarse la continuidad histórica exigida por la consigna.

## E2 — Noche de película
### Resultado deseado
El usuario declara sus minutos disponibles, descubre qué películas pendientes caben, agrega o quita títulos a su sesión, observa minutos usados y restantes, y puede guardar y volver a consultar la sesión.

### Alcance
1. Entrada de tiempo disponible, entero de 30 a 600 minutos.
2. Exclusivamente películas propias en estado «por ver».
3. Duración conocida de cada película, o explicación clara si se desconoce.
4. Sesión de una o más películas y total que incorpora pausas intermedias.
5. Guardar una sesión y consultar luego su nombre, fecha, títulos, duraciones y total.
6. Experiencia exclusiva de la cuenta del usuario.
7. Mensajes claros ante vacíos, errores o falta de conexión.

### Fuera de alcance
Series; sesiones compartidas o con amigos; recordatorios; notificaciones; calendarios; sincronización con servicios de streaming; sugerencias de títulos fuera de la lista personal; reproducción de películas; recomendaciones automáticas de combinaciones (opcional futuro).

### Reglas de negocio fijadas por cliente
- Tiempo libre: **solo números enteros de 30 a 600**.
- Solo películas **en estado «por ver»** que pertenezcan al usuario.
- **10 minutos entre películas**, nunca antes de la primera ni después de la última.
- La igualdad de tiempo **sí permite guardar**.
- Duración procedente de TMDB; si falta/no es válida, título no agregable y razón visible.
- Guardar no modifica estados de «por ver».
- Para `n` películas, tiempo total = suma de duraciones + `10 × (n − 1)` si `n > 0`.

### Cinco decisiones del estudiante propuestas
1. **Reutilización:** `[SUPUESTO]` una película sí puede aparecer en distintas sesiones guardadas. Razón: planear noches alternativas no implica haberla visto.
2. **Orden de alternativas:** `[SUPUESTO]` orden alfabético por título, estable y predecible; no promover contenido pagado.
3. **Edición posterior:** `[SUPUESTO]` sesiones guardadas son inmutables; se pueden borrar y crear otras. Evita cambiar silenciosamente una planificación ya confirmada.
4. **Eliminación de una película de la lista:** `[SUPUESTO]` la sesión conserva título y duración históricos aunque desaparezca de la lista. Evita perder el plan guardado.
5. **Nombre y fecha:** `[SUPUESTO]` fecha obligatoria; nombre opcional con texto por defecto «Noche de película». Facilita recuperar sesiones.

### Condiciones de éxito
- Entra un tiempo permitido, ve opciones elegibles y entiende por qué las demás no caben o no tienen duración.
- Nunca se guarda una sesión que supera el tiempo declarado.
- Tras recargar puede consultar los datos de su sesión.
- Otra cuenta no puede leer ni borrar sus sesiones.
- La colección original sigue intacta.

### Requisitos de experiencia
Mensajes legibles; orden claro; encabezados, controles accesibles por teclado; estados de carga, vacío y error distinguibles; interfaz coherente con la existente.

### Puntos abiertos reales
- Confirmar cinco `[SUPUESTO]` en revisión del estudiante antes de checkpoint 2.
- Comprobar el nombre de la ruta protegida existente y la experiencia previa con teclado.
- Determinar si el Proyecto 3 usa películas y series en la misma tabla tal como figura en su migración.
