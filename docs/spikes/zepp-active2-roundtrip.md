# Spike Zepp Active 2: reloj → app-side → HTTPS

Este spike envía exclusivamente un evento técnico `WATCH_PING`; no contiene datos de salud ni identificadores personales.

## Entorno confirmado

- Amazfit Active 2 Square, firmware `4.1.0.2`.
- Zepp `10.5.2`.
- El dispositivo soporta API level `4.2`; el CLI local Zeus `1.9.2` genera API `4.0`, compatible.
- Target generado: Square, `390x450`.

## Configuración local del receptor

El repositorio no contiene ningún receptor real. Antes de compilar, crea la configuración local ignorada por Git:

```bash
cd spikes/zepp-active2-roundtrip
cp app-side/receiver-config.example.js app-side/receiver-config.local.js
```

Define en ese archivo una URL de prueba desechable que empiece por `https://`. No versiones `receiver-config.local.js`, credenciales, tokens ni datos personales.

El app-side rechaza inmediatamente la configuración vacía o no HTTPS. Nunca muestra `ACEPTADO` hasta recibir un 2xx del receptor y construir un ACK con el mismo `eventId`.

## Contrato

El reloj solicita `SEND_WATCH_PING` con:

```json
{
  "schemaVersion": 1,
  "eventId": "uuid-v4",
  "eventType": "WATCH_PING",
  "deviceTimestamp": 0,
  "sessionId": "uuid-v4"
}
```

`deviceTimestamp` y `receivedAt` son marcas de tiempo Unix en **milisegundos**. `deviceTimestamp` debe ser finito y positivo. El app-side exige exactamente estos cinco campos, versión, tipo y UUID v4 para los dos identificadores antes del POST HTTPS. Solo registra el tipo, los últimos ocho caracteres de `eventId` y el resultado; las librerías de transporte tienen su depuración de payload desactivada.

El único resultado exitoso es:

```json
{
  "schemaVersion": 1,
  "eventId": "<mismo-eventId>",
  "receivedAt": 0,
  "status": "ACCEPTED"
}
```

Los rechazos correlacionados usan el mismo `eventId` y uno de `REJECTED_INVALID_MESSAGE`, `REJECTED_RECEIVER_NOT_CONFIGURED`, `REJECTED_RECEIVER_INVALID_URL`, `REJECTED_RECEIVER_HTTP` o `REJECTED_RECEIVER_NETWORK`. El reloj los traduce inmediatamente a `ERROR MENSAJE`, `ERROR CONFIG`, `ERROR HTTP` o `ERROR RED`; un ACK con contrato inválido permanece como `ERROR ACK`.

## Build e instalación

```bash
cd spikes/zepp-active2-roundtrip
npm install
zeus build
zeus preview
```

`zeus preview` requiere que Zeus esté autenticado y el teléfono Android con Zepp y el reloj estén enlazados. El build generado se deposita bajo `dist/`; usa el flujo que Zeus muestre para instalarlo, sin reemplazarlo por emulador.

## QA física requerida para este head

1. Abrir la miniapp en el reloj y tocar `Enviar prueba`.
2. Guardar un log sanitizado del `eventId` recibido por el receptor HTTPS.
3. Confirmar que el reloj muestra `ACEPTADO` con el mismo identificador.
4. Cambiar temporalmente el receptor por una URL HTTPS inválida y confirmar `ERROR RED` o `ERROR HTTP`, sin éxito falso ni espera del timeout de 10 segundos.
5. Realizar dos envíos consecutivos y confirmar `eventId` distintos.

No hay evidencia física válida para el código con configuración local, rechazos inmediatos y logging de payload desactivado. Debe construirse, instalarse y verificarse este head exacto antes de cambiar QA a PASS.
