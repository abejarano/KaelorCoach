# Convenciones de desarrollo

## Backend NestJS

- Módulos por capacidad de negocio.
- Un controller, service y repository concretos cuando la feature los necesita.
- No DDD fuerte.
- No generic repository.
- No CQRS.
- No interfaces para una sola implementación salvo límite externo real.
- `ValidationPipe` global en HTTP.
- DTOs exactos; campos requeridos por defecto.
- El service confía en DTOs validados.
- El service valida negocio, ownership y transiciones.
- El repository contiene Drizzle y no reglas de entrenamiento/salud.
- No capturar excepciones para devolver defaults.

## TypeScript

- `strict: true`.
- No `any`.
- Preferir enums/unions cerrados cuando el conjunto está definido.
- No usar `Record<string, unknown>` dentro de modelos de negocio.
- Payload bruto externo puede conservarse en integración/auditoría.
- Nombres completos y legibles.

## Flutter

- Screens orquestan.
- Widgets encapsulan bloques visuales.
- Services/repositories móviles encapsulan API y plataforma.
- No lógica extensa de negocio en widgets.
- Estados explícitos: loading, empty, error, success.
- No duplicar modelos de respuesta manualmente si existe generación aprobada.

## Errores

- Fail fast.
- Sin fallback silencioso.
- Sin valores fisiológicos por defecto.
- Un dato faltante se representa explícitamente.
- Logs estructurados sin secretos ni contenido clínico completo.

## Alcance

- Modificar solo archivos relacionados con el issue.
- No refactor oportunista.
- No instalar dependencias sin justificar en el plan.
- No crear infraestructura no solicitada.
