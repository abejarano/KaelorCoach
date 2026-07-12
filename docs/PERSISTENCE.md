# Persistence — Kaelor Coach

## 1. Base principal

PostgreSQL en Neon es la fuente de verdad del MVP.

Drizzle ORM será utilizado para schema, queries y migraciones.

## 2. Reglas

- Tablas y columnas específicas.
- Campos `NOT NULL` por defecto.
- `NULL` requiere una razón de negocio documentada.
- No usar columnas genéricas `metadata`, `data`, `extra` o `config` en dominio.
- JSONB solo para payload externo bruto, auditoría técnica o contratos de proveedor.
- Las fotos nunca se almacenan en PostgreSQL.
- Timestamps en UTC.
- El timezone del usuario se aplica en presentación y reglas temporales.
- Relaciones con foreign keys reales.
- Ownership verificable mediante `user_id`.
- Sin hard delete de datos clínicos o históricos en el MVP; usar estado explícito o proceso de eliminación completo por usuario.

## 3. Áreas de datos

```text
users
user_goals
health_conditions
medications
supplements
physical_limitations
laboratory_observations
device_connections
raw_integration_records
health_observations
sleep_sessions
sleep_stages
workout_sessions
strength_exercises
strength_sets
taekwondo_sessions
body_measurements
meal_entries
meal_analysis
recovery_snapshots
training_plans
training_recommendations
coach_context_snapshots
ai_executions
consents
audit_events
```

Crear tablas solo cuando la feature correspondiente se implemente.

## 4. Observaciones

Las observaciones son append-only.

Cada observación conserva:

- user id;
- tipo exacto;
- valor;
- unidad;
- fecha de medición;
- fecha de recepción;
- origen;
- identificador de origen;
- nivel de confianza;
- confirmación del usuario cuando aplique.

## 5. Payload bruto

`raw_integration_records` puede usar JSONB porque representa contratos externos.

No exponerlo como modelo de dominio ni respuesta normal del API.

## 6. Idempotencia

Cada integración debe definir una clave concreta. Ejemplo:

```text
source + source_record_id + record_type
```

Si la fuente no entrega id:

```text
source + user_id + record_type + measured_at + deterministic_hash
```

No agregar reintentos silenciosos que oculten duplicados.

## 7. Conexiones

- `DATABASE_URL`: pooler para Cloud Run.
- `DATABASE_DIRECT_URL`: migraciones y tareas administrativas.
- SSL obligatorio.
- No ejecutar migraciones en cada startup.
