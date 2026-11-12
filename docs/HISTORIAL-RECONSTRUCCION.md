# Git — historial auténtico de reconstrucción desde cero

Este proyecto NO contiene el repositorio del Proyecto 3 original. Los commits se crearon localmente en la reconstrucción nueva y **no prueban continuidad con una entrega anterior**.

## Inspección

```bash
git log --oneline --reverse
git status --short
git show --stat HEAD
```

Los commits muestran snapshots separados para harness, PRD/backlog/spec, aplicación base E1 reconstruida, cálculo E2, SQL E2, servicio E2 y pantalla E2. La verificación con servicios reales permanece pendiente y no está marcada como realizada.
