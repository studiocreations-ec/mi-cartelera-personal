# Backlog E2 — Historias de usuario y aceptación

Historias separables, negociables y pequeñas (INVEST). Los criterios expresan comportamiento, no implementación.

## HU-E2-01 — Encontrar películas que caben
**Como** usuario con una colección pendiente, **quiero** indicar mi tiempo libre y conocer las películas que puedo terminar, **para** elegir sin empezar algo demasiado largo.
- **C01.** DADO que he iniciado sesión, CUANDO introduzco 30 o 600 minutos exactos, ENTONCES el tiempo es aceptado.
- **C02.** DADO que introduzco un valor decimal, menor a 30, mayor a 600 o no numérico, CUANDO intento usarlo, ENTONCES veo el error y no se procesa como válido.
- **C03.** DADO que tengo películas «por ver», CUANDO declaro un tiempo válido, ENTONCES veo cuáles caben individualmente, con duración, ordenadas por título.
- **C04.** DADO que una película no tiene duración, CUANDO consulto opciones, ENTONCES se presenta como no agregable con explicación.
- **C05.** DADO que el servicio de información tarda o falla, CUANDO consulta las duraciones, ENTONCES veo un estado de carga o un error claro y puedo reintentar.
- **C06.** DADO que mi lista incluye series, títulos «vista» y «viendo», CUANDO consulto sugerencias, ENTONCES ninguno de ellos aparece como agregable.

## HU-E2-02 — Armar una sesión
**Como** usuario que ya conoce las opciones, **quiero** agregar y retirar películas para formar una sesión, **para** asegurar que toda la noche quepa en mi tiempo libre.
- **C07.** DADO que seleccioné una película, CUANDO agrego otra, ENTONCES se incluyen exactamente 10 minutos de pausa entre ellas.
- **C08.** DADO que propongo una combinación cuyo total iguala el disponible, CUANDO intento agregarla, ENTONCES se permite.
- **C09.** DADO que un título haría exceder el disponible, CUANDO intento agregarlo, ENTONCES no entra y veo por qué.
- **C10.** DADO que retiro un título, CUANDO cambia la sesión, ENTONCES se actualizan total, pausas y tiempo restante.
- **C11.** DADO que un título ya está agregado, CUANDO intento agregarlo otra vez a la misma sesión, ENTONCES no se duplica.

## HU-E2-03 — Guardar y recuperar
**Como** usuario con una sesión que cabe, **quiero** guardarla con fecha y consultar sus títulos más adelante, **para** recuperar mi plan sin volver a seleccionarlo.
- **C12.** DADO que armé una sesión válida con al menos una película, CUANDO la guardo, ENTONCES queda registrada con nombre, fecha, títulos y tiempo total.
- **C13.** DADO que guardé una sesión, CUANDO regreso o recargo, ENTONCES puedo consultar la sesión guardada.
- **C14.** DADO que guardo una sesión, CUANDO regreso a mi colección, ENTONCES las películas siguen «por ver».
- **C15.** DADO que borro de mi lista una película que figura en una sesión guardada, CUANDO consulto esa sesión, ENTONCES sigo viendo su título y duración guardados.
- **C16.** DADO que una película aparece en otra sesión, CUANDO la incluyo en una nueva noche, ENTONCES se permite.
- **C17.** DADO que una sesión está guardada, CUANDO quiero cambiarla, ENTONCES la interfaz me indica crear una nueva; puedo eliminar la anterior.

## HU-E2-04 — Mantener privacidad y continuidad
**Como** usuario autenticado, **quiero** que mis sesiones no sean accesibles desde otras cuentas, **para** conservar mi privacidad sin afectar mi colección existente.
- **C18.** DADO que no tengo sesión iniciada, CUANDO intento abrir «Noche de película», ENTONCES se me solicita iniciar sesión.
- **C19.** DADO que existen cuentas A y B, CUANDO B consulta o trata de borrar las sesiones de A, ENTONCES no puede verlas ni modificarlas.
- **C20.** DADO que vuelvo a las funciones de búsqueda, colección o detalle, CUANDO las uso, ENTONCES siguen funcionando como en E1.

## Revisión INVEST
| Historia | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| HU-E2-01 | Independiente del guardado | Orden y mensajes revisables | Evita abandonar películas | 6 criterios | Una pantalla de filtrado | C01–C06 |
| HU-E2-02 | Lógica pura aislable | Mensajes revisables | Sesión realizable | 5 criterios | Una interacción | C07–C11 |
| HU-E2-03 | Persistencia aislable | Nombre/fecha decidibles | Recuperación útil | 6 criterios | Registro + lista | C12–C17 |
| HU-E2-04 | Seguridad auditable aparte | Flujo de acceso revisable | Privacidad | 3 criterios | Acceso y regresión | C18–C20 |

> Historia C17 implementa decisiones `[SUPUESTO]` del PRD. El estudiante debe ratificarlas, o actualizar primero el PRD y estos criterios.
