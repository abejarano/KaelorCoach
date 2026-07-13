# Arquitectura — Kaelor Coach

## 1. Propósito

Este documento define la arquitectura obligatoria del MVP de Kaelor Coach. La prioridad es validar primero la integración real con Amazfit Active 2 y Health Connect, y después construir el producto sobre datos comprobados.

La arquitectura debe mantenerse simple, explícita y adecuada para un equipo pequeño. **Kaelor Coach no utiliza DDD fuerte.**

## 2. Principios no negociables

1. Primero validar el reloj físico; después construir plataforma.
2. NestJS directo y pragmático.
3. Monolito modular, no microservicios.
4. Validación HTTP una sola vez en el boundary.
5. Después del DTO validado, confiar en los tipos recibidos.
6. Reglas de negocio en services; persistencia en repositories concretos.
7. Campos obligatorios por defecto.
8. Sin campos especulativos, `any`, `OTHER`, `metadata` o `extra` en modelos de negocio.
9. Sin fallback silencioso ni valores fisiológicos inventados.
10. La IA explica y personaliza; no sustituye Safety Engine ni integridad de datos.

## 3. Orden de construcción

```text
Fase 0 — Validación técnica
  1. Miniapp mínima en Amazfit Active 2.
  2. Comunicación reloj ↔ app-side service.
  3. Envío desde app-side a endpoint HTTPS configurable.
  4. Auditoría de APIs/sensores disponibles.
  5. Auditoría de datos publicados por Zepp en Health Connect.
  6. Matriz de capacidades y decisión go/no-go.

Fase 1 — Plataforma
  7. Monorepo.
  8. API NestJS en Cloud Run.
  9. PostgreSQL Neon + Drizzle.
 10. Flutter Android.
 11. Autenticación.

Fase 2 — Captura
 12. Perfil clínico y de rendimiento.
 13. Mediciones corporales.
 14. Fuerza/casa.
 15. Taekwondo.
 16. Health Connect productivo.

Fase 3 — Inteligencia
 17. AIModelGateway + Codex OAuth.
 18. Comidas por fotografía.
 19. Recovery Engine.
 20. Safety Engine.
 21. Planificación y recomendación diaria.
```

## 4. Forma del repositorio

La estructura objetivo se crea gradualmente. No crear carpetas vacías por anticipado.

```text
apps/
  api/                  NestJS + TypeScript
  mobile/               Flutter Android-first
  watch/                Proyecto Zepp OS
    app/                 Código ejecutado en el reloj
    app-side/            Side Service ejecutado dentro de Zepp en Android
spikes/
  zepp-active2-roundtrip/
  health-connect-audit/
docs/
issues/
progress/
scripts/
```

No existe un paquete raíz `domain`. No se crean capas `domain/application/infrastructure/presentation` dentro de cada módulo.

## 5. Backend NestJS

### 5.1 Estructura

```text
apps/api/src/
  app.module.ts
  main.ts
  config/
  common/
    auth/
    database/
    errors/
    logging/
  modules/
    users/
    health-profile/
    health-data/
    body-measurements/
    workouts/
    nutrition/
    recovery/
    safety/
    planning/
    coach/
    integrations/
```

Un módulo típico:

```text
workouts/
  workouts.module.ts
  workouts.controller.ts
  workouts.service.ts
  workouts.repository.ts
  workouts.schema.ts
  dto/
  tests/
```

Crear archivos adicionales solo cuando exista una responsabilidad real.

### 5.2 Responsabilidades

**Controller**

- recibe HTTP;
- usa DTO ya validado;
- obtiene usuario autenticado;
- invoca service;
- devuelve respuesta;
- no contiene reglas de negocio ni SQL.

**Service**

- ejecuta el caso de uso;
- aplica reglas de negocio;
- verifica ownership y transiciones;
- coordina repositories e integraciones;
- no vuelve a validar tipos primitivos ya validados.

**Repository**

- contiene queries Drizzle del módulo;
- es específico, no genérico;
- no decide reglas de entrenamiento, salud o permisos;
- no devuelve estructuras ambiguas.

### 5.3 Validación

Usar `ValidationPipe` global de NestJS con DTOs explícitos. El servicio confía en el DTO transformado.

Correcto:

```text
HTTP -> ValidationPipe -> Controller -> Service
```

Incorrecto:

```text
Controller valida string
Service vuelve a validar string
Repository vuelve a validar string
```

El backend sí valida siempre:

- autenticación;
- autorización;
- ownership;
- invariantes de negocio;
- existencia de recursos;
- transiciones válidas;
- integridad referencial.

## 6. Infraestructura MVP

```text
Flutter / Zepp app-side
        ↓ HTTPS
Google Cloud Run — NestJS API
        ↓
Neon PostgreSQL — runtime pooled connection
        ↓
Google Cloud Storage — fotos y documentos
        ↓
Codex OAuth Adapter — uso personal MVP
```

GCP:

- Cloud Run;
- Artifact Registry;
- Secret Manager;
- Cloud Logging;
- Cloud Storage.

No incluir inicialmente:

- Redis;
- BullMQ;
- Kafka;
- Pub/Sub;
- Kubernetes;
- microservicios.

Cloud Tasks o Scheduler solo entran mediante una feature que demuestre necesidad.

## 7. PostgreSQL y Drizzle

- Neon Free durante el MVP.
- `DATABASE_URL` pooled para Cloud Run.
- `DATABASE_DIRECT_URL` para migraciones.
- Migraciones en CI/CD o comando explícito, nunca al iniciar cada instancia.
- UUID para identificadores públicos.
- Timestamps en UTC.
- Datos originales de salud y auditoría son append-only cuando el flujo lo exija.
- Imágenes fuera de PostgreSQL.

No usar repositorios genéricos ni una tabla universal `records`.

## 8. Integración Amazfit / Zepp OS

La miniapp del reloj y su app-side service forman un solo producto Zepp dentro de `apps/watch`.

Flujo objetivo:

```text
Amazfit Active 2
  -> message API
Zepp app-side service
  -> HTTPS
Kaelor Coach API
```

Requisitos:

- funcionamiento temporal sin red;
- identificador idempotente por evento;
- reintento explícito, no silencioso;
- confirmación de recepción;
- payload versionado;
- logs sin datos sensibles.

La primera feature no construye el registrador completo: solo valida el roundtrip técnico.

## 9. Health Connect

Flutter usa un bridge Kotlin nativo para Health Connect cuando el plugin Flutter no cubra el contrato exacto.

Reglas:

- leer solo permisos aprobados por el usuario;
- conservar `dataOrigin` y `recordId`;
- sincronizar con cursor/fecha de última lectura;
- deduplicar por origen + id externo;
- no asumir que Zepp publica un tipo hasta comprobarlo en dispositivo real;
- diferenciar dato ausente de valor cero.

## 10. IA

```text
Datos normalizados
  -> Context Builder
  -> Safety Engine
  -> motores determinísticos
  -> AIModelGateway
  -> Structured Output validation
  -> recomendación auditada
```

Implementaciones previstas:

```text
CodexOAuthAdapter          MVP personal
OpenAIResponsesAdapter     camino de producción posterior
```

Solo se introduce la interfaz porque existen implementaciones reales previstas. No crear factories o strategies adicionales.

La IA puede:

- explicar;
- resumir;
- analizar imágenes;
- redactar recomendaciones dentro de límites;
- personalizar lenguaje.

La IA no puede:

- diagnosticar;
- modificar resultados originales;
- inventar sueño, HRV, calorías o frecuencia cardiaca;
- levantar un bloqueo del Safety Engine;
- cambiar medicamentos;
- activar un plan sin el flujo definido.

## 11. Seguridad de salud

Orden obligatorio:

```text
Daily safety check
  -> hard rules
  -> readiness/recovery
  -> planning
  -> IA
```

Estados:

```text
ALLOWED
REDUCED_INTENSITY
RECOVERY_ONLY
BLOCKED
INSUFFICIENT_DATA
```

La IA solo puede mantener o reducir el nivel permitido.

## 12. Decisiones prohibidas sin aprobación

- DDD fuerte;
- CQRS;
- event sourcing;
- domain event bus;
- generic repository;
- microservicios;
- fallback de proveedor automático;
- campos opcionales “por si acaso”;
- valores por defecto para señales fisiológicas;
- persistir secretos o fotos como Base64 en PostgreSQL.
