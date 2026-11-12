# CONTROL LOCAL REALIZADO — no sustituye Vitest / build

## Evidencias de este entorno
- Revisión AST TypeScript/TSX (`node scripts/validacion-estatica.mjs`): se analizaron **20 archivos TS/TSX** sin errores de sintaxis ni imports relativos inexistentes al efectuar la prueba.
- Revisión de sintaxis de scripts `.mjs` (`node --check`): sin errores en la ejecución local.
- Se transpilaron únicamente las funciones puras del dominio con la instalación global de TypeScript y se ejecutaron **12 aserciones manuales**, 12/12 correctas: límites 30/600, invalidación de 29/601 y fracciones, igualdad 200=100+10+90, película sola, pausas con 3 películas, runtime null, exceso, retirada, pausa negativa.
- `AGENTS.md` contiene menos de 40 líneas y no se encontraron secretos evidentes en el directorio `src`.

## Límites explícitos
- La instalación `npm install` no pudo completarse en el entorno por falta de acceso al registro npm; por tanto **no se ejecutaron Vitest ni `npm run build`**, ni se verificó la interfaz con la app corriendo.
- No se ha desplegado Supabase/TMDB ni se dispone de cuentas de prueba A/B; **no se validaron RLS, registro, TMDB real, guardado de producción ni captura de navegación**.
- Los resultados de aserciones manuales no son los resultados de Vitest, y la inspección AST no es un typecheck semántico de TypeScript.

## Pendientes cuando tengas npm y Supabase
Ejecutar `npm install`, `npm test`, `npm run build`; si hay errores, corregirlos y documentar evidencia real. Crear dos cuentas Supabase y ejecutar las pruebas de `docs/VERIFICACION.md`. Revisar el CSS en 360 px y escritorio en navegador.
