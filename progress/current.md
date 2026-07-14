# Estado actual

## Feature activa

`mvp-001` — Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS (QA pendiente sobre el head endurecido).

## Proxima feature obligatoria

`mvp-001` — Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS.

No iniciar monorepo productivo, API, Flutter, PostgreSQL o IA antes de cerrar las features de descubrimiento `mvp-001` a `mvp-005`.

## Bloqueos

- La evidencia física anterior pertenece a una implementación previa y no vale para el head actual. Debe repetirse con el `.zab` construido desde el commit final: éxito, endpoint HTTPS inválido y dos `eventId` distintos.
- `node scripts/sync-features.mjs --check` debe completar correctamente contra GitHub antes de aceptar la feature.
