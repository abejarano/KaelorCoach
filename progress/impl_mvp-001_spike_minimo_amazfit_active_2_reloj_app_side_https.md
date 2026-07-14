# Implementación — mvp-001: Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS

## Estado

**Implementación lista para build y QA física; QA pendiente sobre el head actual.** La evidencia física registrada antes de esta corrección no corresponde a este código y no se usa como aceptación.

## Alcance implementado

- Proyecto Zepp aislado, API `4.0`, target Square `390x450`, con reloj, app-side y POST HTTPS técnico `WATCH_PING`.
- El reloj genera un UUID v4 por pulsación y solo muestra `ACEPTADO` ante el ACK correlacionado con el mismo `eventId`.
- `AppSideService` recibe la solicitud mediante el `MessageBuilder` oficial incluido en el spike y usa el `fetch` global de Zepp OS para el POST.
- El receptor se lee exclusivamente de `app-side/receiver-config.local.js`, ignorado por Git. El único archivo versionado es `receiver-config.example.js`, vacío.

## Contrato y rechazos

- El boundary exige exactamente `schemaVersion`, `eventId`, `eventType`, `deviceTimestamp` y `sessionId`; no admite campos extra.
- Exige `schemaVersion: 1`, `eventType: WATCH_PING`, UUID v4 y un `deviceTimestamp` finito y positivo.
- El endpoint debe ser una cadena no vacía que comience por `https://`.
- `ACCEPTED` es el único resultado exitoso. Mensaje inválido, configuración ausente/no HTTPS, HTTP no 2xx y fallo de red responden inmediatamente con un estado `REJECTED_*` correlacionado. El reloj muestra el error específico sin esperar el timeout como mecanismo normal de rechazo.

## Privacidad operativa

- `shared/message.js` y `shared/message-side.js` tienen `DEBUG = false`; no se escriben buffers ni request/response completos.
- El app-side registra solo `WATCH_PING`, el sufijo de ocho caracteres de un UUID válido y el resultado. No registra URL ni payload.

## Verificación pendiente

La comprobación sintáctica y `zeus build` produjeron `dist/24635-Kaelor_Roundtrip_Spike-1.0.8-20260714150411.zab` desde esta implementación. `./init.sh` y `node scripts/sync-features.mjs --check` también completaron correctamente.

Antes de aprobar QA falta instalar ese `.zab` y repetir: éxito 2xx/`ACEPTADO`, endpoint HTTPS inválido con rechazo inmediato y dos pulsaciones con `eventId` distintos.
