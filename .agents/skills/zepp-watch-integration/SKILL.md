---
name: zepp-watch-integration
description: Guía obligatoria para implementar, investigar o revisar miniapps Zepp OS, Device App, App-side Service, mensajería Bluetooth, sincronización HTTPS y pruebas físicas en Amazfit Active 2 dentro de KaelorCoach.
---

# Zepp Watch Integration Skill

## Objetivo

Asegurar que cualquier trabajo relacionado con Amazfit Active 2 se implemente con evidencia real, contratos explícitos y separación clara entre reloj, app-side service y backend.

Esta skill se usa para spikes, integración productiva, captura de entrenamientos, sincronización, persistencia local, sensores, mensajería y revisión técnica del código Zepp OS.

## Cuándo usarla

Usar obligatoriamente cuando la tarea toque cualquiera de estas superficies:

-   miniapp Zepp OS;
-   Device App del reloj;
-   App-side Service de Zepp;
-   mensajería reloj ↔ teléfono;
-   envío app-side → HTTPS;
-   persistencia local en el reloj;
-   reintentos o sincronización diferida;
-   sensores del Amazfit Active 2;
-   APIs de entrenamiento del reloj;
-   instalación, logs o pruebas en dispositivo físico;
-   migración de un spike Zepp hacia código productivo.

## Lectura obligatoria

Antes de planificar o implementar:

1.  `AGENTS.md`.
2.  `CODEX.md`.
3.  `feature_list.json`.
4.  `progress/current.md`.
5.  El issue completo de la feature activa.
6.  `docs/ARCHITECTURE.md`.
7.  `docs/verification.md`.
8.  Documentación del spike anterior, si existe:
    -   `docs/spikes/zepp-active2-roundtrip.md`;
    -   `docs/spikes/active2-capability-matrix.md`.
9.  Configuración real del proyecto Zepp: manifiesto, API level, permisos, target y scripts existentes.
10.  Documentación oficial de Zepp OS correspondiente a la API exacta que se va a utilizar.

No implementar basándose únicamente en memoria, ejemplos de otro modelo Amazfit o código encontrado para otro API level.

## Regla principal

> Primero demostrar el flujo mínimo en el Amazfit Active 2 físico. Después construir arquitectura productiva.

Para KaelorCoach, el orden técnico obligatorio es:

```text
Amazfit Active 2 físico
  -> Device App / miniapp
  -> App-side Service
  -> endpoint HTTPS de prueba
  -> evidencia reproducible
```

No comenzar Flutter productivo, NestJS, PostgreSQL, Health Connect o IA para resolver una incertidumbre que todavía pertenece al spike del reloj.

## Separación de responsabilidades

### Device App / miniapp

Responsabilidades permitidas:

-   renderizar UI del reloj;
-   capturar interacción del usuario;
-   leer únicamente APIs confirmadas para el dispositivo;
-   construir eventos pequeños y versionados;
-   mantener cola local cuando el issue lo requiera;
-   enviar mensajes al app-side;
-   mostrar ACK, pendiente o error explícito.

No debe:

-   llamar directamente al backend de KaelorCoach si el flujo aprobado usa app-side;
-   contener reglas clínicas;
-   calcular recomendaciones de entrenamiento con IA;
-   guardar tokens del backend;
-   bloquear la UI esperando red;
-   reportar éxito antes de recibir confirmación real.

### App-side Service

Responsabilidades permitidas:

-   recibir mensajes del reloj;
-   decodificar el formato acordado;
-   validar el payload una sola vez en el boundary;
-   enviar ACK al reloj;
-   llamar al endpoint HTTPS configurado;
-   traducir errores técnicos a estados explícitos;
-   registrar logs sanitizados;
-   aplicar reintento solamente cuando el issue lo defina.

No debe:

-   inventar valores ausentes;
-   transformar silenciosamente contratos inválidos;
-   ocultar errores de red;
-   almacenar secretos en archivos versionados;
-   mezclar lógica clínica o de planificación.

### Backend

El backend no forma parte del spike mínimo salvo que el issue lo indique explícitamente. Para pruebas se acepta un receptor HTTP mínimo y aislado.

## Contratos de mensajes

Todo mensaje debe tener contrato exacto, versión y dirección definida.

Contrato base del spike inicial:

```json
{
  "schemaVersion": 1,
  "eventId": "uuid",
  "eventType": "WATCH_PING",
  "deviceTimestamp": 0,
  "sessionId": "uuid"
}
```

ACK base:

```json
{
  "schemaVersion": 1,
  "eventId": "uuid",
  "receivedAt": 0,
  "status": "ACCEPTED"
}
```

Reglas:

-   `schemaVersion` es obligatorio;
-   `eventId` identifica un único envío;
-   `eventType` pertenece a un enum explícito;
-   timestamps usan una única unidad documentada;
-   no agregar `metadata`, `extra`, `data`, `notes` o campos opcionales sin necesidad del issue;
-   no aceptar múltiples formas equivalentes del mismo payload;
-   no usar valores por defecto para completar datos faltantes;
-   un contrato inválido debe generar error explícito.

## Mensajería y serialización

-   Usar el mecanismo de mensajería soportado por el proyecto y API level real.
-   Mantener encode/decode en helpers pequeños y deterministas.
-   No mezclar serialización con UI.
-   No duplicar la validación en varias capas.
-   Después de validar el mensaje en el boundary, confiar en el tipo interno.
-   Toda respuesta debe correlacionarse por `eventId`.
-   Mensajes duplicados deben ser detectables; la política de deduplicación se implementa solo cuando el issue la exija.

## Estado visible en el reloj

La UI debe distinguir al menos:

```text
IDLE
SENDING
ACCEPTED
PENDING_SYNC
ERROR
```

No mostrar `ACCEPTED` cuando solamente se encoló localmente.

Mensajes visibles deben ser breves y entendibles. El detalle técnico queda en logs sanitizados.

## Persistencia local y reenvío

Solo implementar cuando el issue lo incluya.

Reglas obligatorias:

-   cada registro conserva `eventId`, payload, estado y contador de intentos;
-   no perder eventos silenciosamente;
-   no crear reintentos infinitos;
-   no bloquear la interacción del reloj;
-   un ACK debe actualizar exactamente el evento correlacionado;
-   al reiniciar la miniapp, la cola debe mantener el estado requerido por el issue;
-   documentar límites reales de almacenamiento y comportamiento observado.

No introducir una base de datos, cola genérica o framework de sincronización si una estructura local simple cubre el spike.

## Sensores y APIs de entrenamiento

Toda capacidad debe clasificarse mediante prueba real en Amazfit Active 2:

```text
AVAILABLE
UNAVAILABLE
REQUIRES_PERMISSION
NOT_TESTED
```

Para cada capacidad registrar:

-   API utilizada;
-   resultado en dispositivo físico;
-   permiso requerido;
-   unidad;
-   frecuencia de muestreo observada;
-   disponibilidad durante entrenamiento;
-   disponibilidad en background;
-   limitaciones o errores.

No declarar una señal como disponible porque aparece en la interfaz de Zepp o porque otro reloj la soporta.

No implementar reconocimiento automático de ejercicios, repeticiones o patadas durante el spike de capacidades.

## Arquitectura y estilo de código

-   Solución directa y específica para KaelorCoach.
-   No DDD fuerte.
-   No CQRS.
-   No event bus.
-   No factories o interfaces para una única implementación.
-   No abstracciones genéricas para mensajes o sensores sin dos casos reales.
-   No refactors fuera del issue.
-   No dependencias nuevas sin justificación concreta.
-   No fallbacks silenciosos.
-   No contratos opcionales para esconder inconsistencias.

Estructura orientativa del spike:

```text
spikes/zepp-active2-roundtrip/
├── app.js
├── app-side/
├── pages/
├── shared/
├── app.json
└── README.md
```

La estructura real del SDK y del proyecto prevalece. No inventar carpetas si el scaffold oficial usa otra forma.

## Seguridad y privacidad

No registrar ni exponer:

-   access tokens;
-   refresh tokens;
-   cookies;
-   credenciales;
-   identificadores personales del usuario;
-   datos clínicos completos;
-   fotografías;
-   payloads sensibles sin sanitizar.

Para spikes usar datos sintéticos o mínimos.

El endpoint de prueba debe configurarse fuera del código. No versionar URLs privadas, secretos ni headers de autenticación.

## Observabilidad

Cada prueba debe permitir reconstruir el flujo:

```text
watch event created
  -> message sent
  -> app-side received
  -> ACK returned
  -> HTTPS attempted
  -> HTTP result recorded
```

Logs mínimos:

-   `eventId`;
-   etapa;
-   timestamp;
-   resultado;
-   código de error sanitizado.

No registrar el payload completo cuando contenga información sensible.

## Prueba física obligatoria

Un spike Zepp no se considera terminado con simulador solamente.

La evidencia debe indicar:

-   modelo exacto del reloj;
-   versión de firmware;
-   versión de Zepp app;
-   versión del SDK/toolchain;
-   API level configurado;
-   pasos de instalación;
-   escenario probado;
-   resultado observado;
-   logs o capturas sanitizadas;
-   limitaciones encontradas.

## Escenarios mínimos del roundtrip

1.  Envío exitoso y ACK con el mismo `eventId`.
2.  Dos envíos consecutivos con IDs diferentes.
3.  Endpoint HTTPS inválido o inaccesible.
4.  Teléfono sin conexión o app-side no disponible, cuando sea reproducible.
5.  Reinicio de miniapp, si el issue incluye persistencia.

No marcar una prueba como exitosa cuando no se observó el evento en el destino correspondiente.

## Documentación requerida

Un spike debe producir un documento en `docs/spikes/` con:

```md
# Resultado del spike

## Objetivo
## Hardware y versiones
## Configuración real
## Flujo implementado
## Contratos observados
## Pasos para reproducir
## Pruebas ejecutadas
## Evidencia
## Limitaciones
## Decisión técnica
## Siguiente issue recomendado
```

La decisión técnica debe ser explícita:

-   `VALIDATED`;
-   `VALIDATED_WITH_LIMITATIONS`;
-   `NOT_VALIDATED`.

No usar expresiones ambiguas como “parece funcionar” o “debería funcionar”.

## Entregable del implementer

Al terminar, crear:

```text
progress/impl_<id>_<slug>.md
```

Contenido mínimo:

1.  feature e issue implementado;
2.  archivos modificados;
3.  configuración real utilizada;
4.  contratos implementados;
5.  pruebas físicas ejecutadas;
6.  comandos y herramientas usados;
7.  evidencia sanitizada;
8.  limitaciones;
9.  decisión técnica;
10.  deuda no bloqueante.

## Reglas para reviewer

El reviewer debe emitir `CHANGES_REQUESTED` si ocurre cualquiera de estos casos:

-   no hay prueba en Amazfit Active 2 físico;
-   el flujo solo funciona en simulador;
-   reloj y app-side están mezclados sin separación clara;
-   no existe correlación por `eventId`;
-   se reporta éxito sin ACK real;
-   se ocultan errores con defaults o `catch` vacío;
-   se agregan campos opcionales especulativos;
-   se introducen Flutter, NestJS, PostgreSQL o IA fuera del alcance del spike;
-   faltan versiones, pasos reproducibles o evidencia;
-   una capacidad se declara disponible sin prueba real;
-   se exponen secretos o datos sensibles.

## Resultado previo a implementación

Antes de escribir código, el agente debe dejar en el plan:

```md
## Lectura Zepp

### Dispositivo objetivo
- Modelo:
- Forma:
- Firmware:
- Zepp app:
- SDK/toolchain:
- API level:

### Flujo a validar
- Device App:
- App-side Service:
- HTTPS receiver:

### APIs exactas a usar
- ...

### Contratos
- Evento:
- ACK:

### Evidencia esperada
- ...

### Riesgos conocidos
- ...
```

## Principio final

La integración Zepp no se aprueba por diseño teórico. Se aprueba cuando el flujo exacto funciona en el Amazfit Active 2 físico, el error también es observable y otra persona puede reproducirlo siguiendo la documentación.