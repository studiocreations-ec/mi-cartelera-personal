# Poke-holes — Refinamiento propuesto con IA

**Procedencia:** casos borde sugeridos por el asistente de IA. **No equivalen a una sesión verificada de Claude Code ni a aprobación del estudiante.** Los aceptados se reflejan en la propuesta de PRD, criterios y spec; registrar revisión humana antes del checkpoint.

| ID | Pregunta / caso borde planteado por IA | Decisión propuesta | Razón | Evidencia/criterio |
|---|---|---|---|---|
| PH01 | ¿Exactamente 30 y 600 son válidos? | Aceptar | Ambos límites inclusivos | C01 |
| PH02 | ¿29, 601 y 90,5 minutos? | Rechazar entrada | Rango e integridad fijados | C02 |
| PH03 | ¿Valor vacío o letras? | Rechazar entrada | No representa minutos | C02 |
| PH04 | ¿Película de 100 min + otra de 90 con 10 de pausa en 200 min? | Aceptar | Igualdad exacta cabe | C08 |
| PH05 | ¿Dos películas sin pausa entre ellas? | Rechazar | El cliente fija 10 minutos | C07 |
| PH06 | ¿Pausa al inicio/final de una sola película? | Rechazar | Solo hay pausas intermedias | C07 |
| PH07 | ¿Duración nula, cero o negativa? | Rechazar agregar | Duración desconocida/inválida | C04 |
| PH08 | ¿Tiempo estimado por el usuario en vez de TMDB? | Rechazar | Fuente de runtime obligatoria | C04 |
| PH09 | ¿Serie guardada como «por ver»? | Rechazar agregar | E2 solo películas | C06 |
| PH10 | ¿Título «viendo» o «vista»? | Rechazar agregar | E2 usa pendientes | C06 |
| PH11 | ¿Cargar duplicado dentro de sesión? | Rechazar | No contar duración doble accidental | C11 |
| PH12 | ¿Seleccionar un título y reducir tiempo disponible? | Aceptar cambio, invalidar guardado y explicar | No persistir sesión que ya no cabe | C02,C09,C12 |
| PH13 | ¿Falla TMDB de una película pero otras responden? | Aceptar parcial, informar fallo | No bloquear toda la lista innecesariamente | C05 |
| PH14 | ¿Lista vacía? | Aceptar, explicar vacío | No confundir con error | C03 |
| PH15 | ¿Película eliminada después de guardar? | Conservar snapshot | Historial no debe evaporarse | C15 |
| PH16 | ¿Usuario B intenta adivinar ID de A? | Rechazar operación | Seguridad real del propietario | C19 |
| PH17 | ¿Guardado sin títulos? | Rechazar | No constituye una sesión | C12 |
| PH18 | ¿Guardar mientras la duración aún se consulta? | Rechazar | Datos incompletos | C04,C05 |
| PH19 | ¿Dos sesiones usan la misma película pendiente? | Aceptar | Las sesiones son planes, no visualizaciones | C16 |
| PH20 | ¿Agregar recomendaciones ajenas a la lista? | Rechazar | Fuera de alcance | C06 |

**Pendiente:** el estudiante debe registrar fecha y decisiones ratificadas/rechazadas con justificación personal.
