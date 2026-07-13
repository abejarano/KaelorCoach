# Persistencia — Kaelor Coach

## 1. Fuente de verdad

PostgreSQL Neon es la fuente de verdad del MVP. Drizzle gestiona schema, queries y migraciones.

## 2. Reglas

- Tablas específicas por módulo.
- No tabla universal de documentos.
- No generic repository.
- UUID para ids externos.
- UTC para timestamps.
- Ownership por `user_id` en todos los datos privados.
- Foreign keys cuando exista relación real.
- Índices definidos por queries reales.
- Fotos y archivos en Google Cloud Storage; PostgreSQL conserva metadata exacta y object key.
- Secretos nunca en PostgreSQL.

## 3. Datos de salud

Cada registro normalizado conserva:

- usuario;
- tipo exacto;
- valor y unidad cuando corresponde;
- inicio/fin o timestamp;
- origen;
- id externo;
- fecha de recepción;
- calidad/confianza cuando el dato es estimado;
- referencia al payload de integración cuando sea necesaria para auditoría.

Los registros importados no se sobrescriben silenciosamente. Deduplicación usa origen + id externo o clave idempotente definida.

## 4. Migraciones

- `DATABASE_URL`: pooled runtime.
- `DATABASE_DIRECT_URL`: migraciones.
- Migraciones fuera del startup de Cloud Run.
- Toda modificación de schema exige migration versionada.

## 5. Modelos

Campos obligatorios por defecto. Un campo nullable solo existe cuando el estado nulo representa una condición funcional concreta y documentada.

Prohibido:

- `metadata` genérico en dominio;
- `extra`;
- `data` ambiguo;
- `OTHER` sin flujo;
- JSONB como sustituto de modelado.

JSONB se admite solo para payload externo bruto o snapshot de auditoría definido.
