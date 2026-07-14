# QA — mvp-001: Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS

## Resultado

**PENDING — no aprobada para el head actual.** Las pruebas físicas antes registradas usaron una implementación anterior; no prueban esta versión con configuración local ignorada, rechazo correlacionado inmediato y depuración de payload desactivada.

## Verificación local exigida

| Verificación | Estado |
| --- | --- |
| `./init.sh` | Pendiente de repetir sobre el commit final. |
| `node scripts/sync-features.mjs --check` | Pendiente; debe completar contra GitHub sin drift. |
| `zeus build` | Pendiente sobre el commit final. |
| `node --check app-side/index.js` y `node --check page/index.js` | Pendiente sobre el commit final. |
| Revisión de configuración y logs | El código requiere `receiver-config.local.js` ignorado y mantiene `DEBUG = false`; pendiente de build/QA final. |

## Recorrido físico obligatorio

Usar el `.zab` producido por `zeus build` desde el SHA final, instalarlo con `zeus preview` en el Amazfit Active 2 Square (firmware `4.1.0.2`, Zepp `10.5.2`) y guardar evidencia sanitizada:

1. Receptor HTTPS 2xx: un `WATCH_PING` y `ACEPTADO` con el mismo `eventId`.
2. Endpoint HTTPS inválido: `ERROR RED` o `ERROR HTTP` inmediatamente, sin `ACEPTADO` ni una espera de timeout de diez segundos.
3. Dos pulsaciones consecutivas: dos POST y `eventId` distintos.

No guardar URL, payload completo, credenciales ni tokens. QA solo puede cambiar a **PASS** después de los tres casos y de `node scripts/sync-features.mjs --check` exitoso.
