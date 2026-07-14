# Review — mvp-001: Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS

## Veredicto

**CHANGES_REQUESTED — evidencia pendiente.** El código actual resuelve los hallazgos de configuración versionada, payloads en logs, validación y rechazos sin respuesta. Aún no existe evidencia física ni un check remoto completado para este head exacto.

## Correcciones inspeccionadas

- El app-side usa `AppSideService` y el `fetch` global de Zepp OS; no usa `BaseSideService` ni `this.fetch`.
- `receiver-config.local.js` es la única fuente del receptor y está ignorada. `receiver-config.example.js` versionado contiene una cadena vacía; no hay URL real en el árbol versionado.
- El transporte compartido tiene `DEBUG = false`, y el log de aplicación no incluye URL, request, response ni payload completo.
- `isWatchPing` requiere exactamente el contrato de cinco campos, UUID v4, timestamp positivo/finito y versión/tipo correctos. El receptor debe comenzar por `https://`.
- Cada request obtiene una respuesta correlacionada. Solo un 2xx genera `ACCEPTED`; los demás casos responden `REJECTED_*` de inmediato y el reloj muestra una categoría de error.

## Corrección requerida antes de aprobar

1. Ejecutar `node scripts/sync-features.mjs --check` correctamente contra GitHub.
2. Construir desde el SHA final, instalar ese `.zab` y registrar éxito, endpoint HTTPS inválido y dos envíos consecutivos con IDs distintos.
3. Actualizar QA a PASS solo con esa evidencia y entonces revisar el artefacto final.
