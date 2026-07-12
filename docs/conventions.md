# Conventions — Kaelor Coach

## 1. Filosofía

- Solución más simple que cumpla completamente la feature actual.
- Sin abstracciones especulativas.
- Sin campos especulativos.
- Sin validaciones repetidas.
- Sin fallbacks silenciosos.
- Sin refactors oportunistas.
- Sin dependencias nuevas sin justificación.

## 2. TypeScript

- `strict: true`.
- No `any`.
- No `as unknown as` salvo integración externa documentada.
- Tipos de dominio concretos.
- Enums cerrados y específicos.
- Campos obligatorios por defecto.
- Nombres que expresen unidad: `weightKg`, `durationSeconds`, `measuredAt`.

## 3. Validación

- HTTP payload: una vez mediante schema middleware.
- Dominio: reglas de negocio.
- Persistencia: constraints e integridad.
- No repetir `typeof`, `undefined`, `NaN` en cada capa después del middleware.

## 4. Errores

- Fail fast.
- Error explícito.
- Dato faltante explícito.
- Nunca sustituir datos fisiológicos por defaults.
- No capturar excepciones para devolver valores inventados.

## 5. Modelos

No permitido por defecto:

```text
field?: type
field: type | null | undefined
metadata: Record<string, unknown>
data: any
extra: object
config: object
type: OTHER
```

Una excepción debe venir desde un requerimiento funcional o contrato externo.

## 6. Backend

- Controllers delgados.
- Application services concretos.
- Repositorios específicos.
- No `BaseService<T>`.
- No `GenericRepository<T>`.
- No DI container adicional sin ADR.

## 7. Frontend

- Screens como composición.
- Widgets con responsabilidad única.
- No fetch disperso.
- No lógica de dominio en UI.
- Reutilizar design system.
- Cubrir loading, empty, error y success.

## 8. IA

- Structured Outputs obligatorios.
- Schema específico por workload.
- Context snapshot versionado.
- Guardar modelo, provider, duración y resultado validado.
- No guardar chain-of-thought.
- No permitir a IA saltar reglas del Safety Engine.
