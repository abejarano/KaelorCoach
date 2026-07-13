---
name: zepp-watch-integration
description: Implementa o revisa Zepp OS, app-side service, mensajeria y pruebas fisicas del Amazfit Active 2.
---

# Zepp Watch Integration

Usar solo con API level, permisos, manifiesto y SDK reales. Antes de producto, demostrar el flujo en Amazfit Active 2 fisico y documentar modelo, firmware, version Zepp, SDK, pasos y resultado sanitizado.

Separar responsabilidades: el reloj crea eventos y muestra estado; app-side recibe, valida el boundary, confirma por `eventId` y realiza HTTPS; el backend no pertenece al spike salvo que el issue lo pida.

Todo mensaje define version, idempotencia, unidad temporal y ACK correlacionado. La UI distingue envio, aceptado, pendiente y error; no confirma exito antes del ACK. Persistencia diferida y reintentos existen solo cuando el issue los exige, sin perdida silenciosa ni reintentos infinitos.
