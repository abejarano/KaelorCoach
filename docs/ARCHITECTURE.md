# Architecture — Kaelor Coach

## 1. Propósito

Este documento define la arquitectura objetivo del MVP y las reglas obligatorias para evolucionarla sin crear soluciones paralelas ni sobreingeniería.

## 2. Forma general

Kaelor Coach será un monorepo con cuatro superficies:

```text
apps/
  api/                Backend especializado para la app Kaelor Coach
  mobile/             Flutter Android-first
  watch/              Miniapp Zepp OS para Amazfit Active 2
  zepp-side-service/  Servicio de sincronización dentro de Zepp
packages/
  contracts/          Contratos compartidos explícitos
  domain/             Modelos y reglas de negocio
  ai/                 Gateway, prompts, schemas y auditoría
  shared/             Utilidades técnicas realmente transversales
```

No introducir nuevas aplicaciones o paquetes sin necesidad aprobada.

## 3. Infraestructura MVP

```text
Amazfit Active 2
  -> Zepp Side Service
  -> Flutter Android
  -> Cloud Run API
  -> Neon PostgreSQL
  -> Google Cloud Storage
  -> Codex OAuth Adapter
```

### GCP

- Cloud Run para `apps/api`.
- Artifact Registry para imágenes.
- Secret Manager para secretos.
- Cloud Logging para observabilidad.
- Cloud Storage para fotos y documentos.
- Cloud Scheduler/Cloud Tasks solo cuando exista un caso real.

### PostgreSQL

- Neon Free para el MVP.
- Conexión pooled para runtime serverless.
- Conexión directa para migraciones.
- Migraciones fuera del startup de Cloud Run.

### No incluido inicialmente

- Redis.
- BullMQ.
- Kafka.
- Pub/Sub.
- Microservicios.
- Kubernetes.

## 4. Backend especializado para un frontend específico

La API sirve exclusivamente al cliente Kaelor Coach durante el MVP.

Principio:

> Validar formato una vez en el borde, confiar en el DTO validado dentro de la aplicación y validar reglas de negocio en el dominio.

Flujo:

```text
HTTP Request
  -> Auth middleware
  -> Request schema middleware
  -> Controller
  -> Application service
  -> Domain/repository
  -> Response mapper
```

### Controllers

- Delgados.
- Sin reglas de negocio.
- Sin validación duplicada.
- Sin acceso directo a base de datos.

### Application services

- Orquestan casos de uso.
- Aplican permisos y reglas que cruzan agregados.
- Trabajan con modelos de dominio específicos.

### Domain

- Modelos explícitos.
- Campos requeridos por defecto.
- Sin `any`.
- Sin `metadata`, `extra`, `config` o `data` genéricos.
- Sin `OTHER` salvo caso funcional definido.
- Sin fallbacks silenciosos.

### Persistence

- Repositorios específicos por agregado.
- No `GenericRepository<T>`.
- No lógica de negocio dentro de repositorios.
- Integridad y ownership siempre verificados.

## 5. Módulos del backend

```text
identity
users
health-profile
health-observations
integrations-health-connect
integrations-zepp
workouts
nutrition
recovery
planning
safety
coach
notifications
audit
```

Cada módulo debe contener solo lo necesario:

```text
module/
  domain/
  application/
  infrastructure/
  http/
```

No crear todas las carpetas por plantilla cuando una feature no las necesita.

## 6. Ingesta de datos de salud

```text
Source payload
  -> Raw integration record
  -> Schema validation
  -> Unit normalization
  -> Deduplication
  -> Domain observation
  -> Daily aggregation
  -> Personal baseline
  -> Recovery snapshot
```

Reglas:

- Idempotencia por fuente, record id, tipo y timestamp.
- El payload bruto vive fuera del modelo de dominio.
- Las observaciones originales no se sobrescriben.
- Una corrección crea un registro explícito nuevo.
- La procedencia siempre se conserva.

## 7. Arquitectura de IA

La IA no recibe acceso libre a la base de datos y no decide antes del motor de seguridad.

```text
User request / scheduled event
  -> Context Builder
  -> Safety Engine
  -> Deterministic Decision Engine
  -> AI Model Gateway
  -> Structured Output Validator
  -> Policy Validator
  -> Stored recommendation + audit
```

### AIModelGateway

Única abstracción obligatoria porque existen dos implementaciones reales:

```text
CodexOAuthAdapter       MVP personal
OpenAIResponsesAdapter  Camino de producción
```

El dominio no conoce URLs, tokens ni nombres concretos de modelo.

### Responsabilidades de IA

- explicar;
- resumir;
- seleccionar entre opciones permitidas;
- producir recomendaciones estructuradas;
- analizar imágenes;
- redactar feedback.

### Responsabilidades no delegadas a IA

- autenticación;
- autorización;
- ownership;
- reglas médicas de bloqueo;
- integridad de datos;
- transiciones críticas;
- modificación de resultados clínicos;
- invención de datos faltantes.

## 8. Safety Engine

Se ejecuta antes del modelo.

Puede producir:

```text
ALLOWED
REDUCED_INTENSITY
RECOVERY_ONLY
BLOCKED
INSUFFICIENT_DATA
```

El modelo no puede elevar una decisión de seguridad.

Ejemplo:

```text
BLOCKED no puede convertirse en entrenamiento ligero.
```

## 9. Entrenamientos

### Taekwondo

- técnica;
- poomsae;
- patadas;
- raqueta;
- saco;
- combate;
- acondicionamiento;
- examen/simulación;
- duración;
- rounds;
- frecuencia cardiaca;
- zonas;
- RPE;
- fatiga y dolor reportado.

### Gimnasio

- ejercicio;
- serie;
- repeticiones;
- peso;
- RIR/RPE;
- descanso;
- volumen.

### Casa

- peso corporal;
- banda;
- carga improvisada;
- isometría;
- tiempo bajo tensión.

Las bandas no se modelan como kilos exactos sin medición real.

## 10. Asincronía

No crear infraestructura asíncrona genérica en el MVP.

Se permite:

- análisis de imagen mediante Cloud Tasks cuando la latencia lo justifique;
- tareas programadas con Cloud Scheduler;
- jobs Cloud Run específicos.

Toda introducción debe venir acompañada de requerimiento y ADR.

## 11. Observabilidad

Logs estructurados con:

- correlation id;
- user id en forma no sensible;
- source;
- feature;
- status;
- duración;
- provider de IA;
- context snapshot id.

Nunca registrar:

- tokens;
- secretos;
- fotos en base64;
- resultados clínicos completos;
- payloads sensibles sin sanitización.

## 12. Decisiones arquitecturales

- ADR-001 Monolito modular.
- ADR-002 Flutter Android-first.
- ADR-003 Zepp OS + Side Service.
- ADR-004 Cloud Run.
- ADR-005 Neon PostgreSQL para MVP.
- ADR-006 Google Cloud Storage para archivos.
- ADR-007 Drizzle ORM.
- ADR-008 Validación de request solo en boundary.
- ADR-009 Modelos explícitos y required-by-default.
- ADR-010 Sin fallback silencioso.
- ADR-011 AIModelGateway con Codex OAuth y Responses API.
- ADR-012 Safety Engine antes de IA.
- ADR-013 Memoria propia, estructurada y versionada.
- ADR-014 Sin Redis/colas hasta demostrar necesidad.
