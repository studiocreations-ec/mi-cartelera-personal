# DESIGN — Mi Cartelera Personal

Sistema visual de la aplicación reconstruida. La pantalla E2 debe conservar coherencia con E1. Se usa **Bootstrap 5** importado desde `src/main.tsx` y CSS de marca en `src/styles.css`.

## Brand board
- Fondo: azul noche `#0c101d`; navegación `#111625`.
- Superficies: `#171d30`, `#181d30`; bordes `#33364e`.
- Acento primario: lavanda `#d7aafa`; secundario `#cda4ed`; éxito `#b9e5d5`; error `#ffc0cb`.
- Texto principal: `#e8eaf5`; texto secundario: `#a1abc3`.
- Tipografía: Manrope para títulos, DM Sans para texto, con fallbacks del sistema. Se cargan mediante @import CSS, pero no son requisito funcional.
- Componentes: paneles redondeados (14–22 px), CTA principal lavanda, tarjeta de póster, filtros segmentados, estados explícitos.
- Retícula escritorio: navegación lateral + contenido; móvil: navegación inferior y pantallas de una columna.

## Bootstrap y personalización
1. Bootstrap provee `container` si se usa, `alert`, `visually-hidden`, `form-control`, `form-select`, `w-100`, `d-flex`, utilidades.
2. Clases de aplicación propias prefijadas por superficie (`movie-*`, `noche-*`, `session-*`, `hero-*`).
3. Nunca editar el CSS compilado de Bootstrap ni eliminar el import.
4. Los inputs con errores exponen `role=alert` o `aria-invalid`, los botones tienen texto o `aria-label`.
5. No cargar fuentes desde JavaScript ni usar iconos de fuentes externas: SVG React Lucide.

## Reglas visuales verificables
- D01: campos `minutos`, `fecha`, `nombre` asociados a labels (label visible o `visually-hidden`).
- D02: verificar contraste WCAG AA 4.5:1 para texto normal con inspector o herramienta real (pendiente).
- D03: navegación completa por teclado, foco visible.
- D04: 360 px de ancho sin scroll horizontal del viewport.
- D05: `cargando`, `error`, `vacío`, `listo` distinguibles con texto.
- D06: no se suma a la sesión una película que exceda el presupuesto, con mensaje de motivo.
- D07: total, pausas y restante siempre visibles y actualizados.
- D08: navegación compartida E1/E2, Bootstrap y colores coherentes.

## Prohibiciones
- Secretos en frontend, `service_role` o token TMDB en `VITE_*`.
- Depender solo del color para mostrar errores.
- Modal/CTA inerte o botones que simulen pagos o reproducción real.
