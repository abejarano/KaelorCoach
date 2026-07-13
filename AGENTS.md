# AGENTS.md — Mapa de navegación para agentes IA

## 1. Producto

Kaelor Coach es un entrenador personal asistido por IA para Android y Amazfit Active 2. Combina entrenamiento, recuperación, alimentación, composición corporal y contexto de salud para producir decisiones diarias explicables.

## 2. Fuentes de verdad

1. GitHub issue enlazado desde `feature_list.json`: alcance ejecutable.
2. `docs/PRODUCT.md`: reglas funcionales.
3. `docs/ARCHITECTURE.md`: límites técnicos.
4. `docs/PERSISTENCE.md`: almacenamiento.
5. `docs/FRONTEND_GUIDE.md`: Flutter y reloj.
6. `docs/conventions.md`: estilo de implementación.
7. `docs/verification.md`: comandos reales.

Ante contradicción, bloquear y documentar; no inventar una resolución.

## 3. Lectura obligatoria

Siempre:

- `AGENTS.md`
- `CODEX.md`
- `feature_list.json`
- issue asociado a la feature
- `progress/current.md`
- `docs/PRODUCT.md`
- `docs/verification.md`

Backend:

- `docs/ARCHITECTURE.md`
- `docs/PERSISTENCE.md`
- `docs/conventions.md`
- `.agents/skills/repo-reader/SKILL.md`

Flutter/reloj:

- `docs/FRONTEND_GUIDE.md`
- `.agents/skills/frontend-flutter/SKILL.md`
- `.agents/skills/zepp-watch-integration/SKILL.md`

Salud/IA:

- `.agents/skills/health-safety-reviewer/SKILL.md`

## 4. Arquitectura obligatoria

- NestJS modular pragmático.
- No DDD fuerte.
- No carpetas `domain/application/infrastructure/presentation` por defecto.
- Controllers delgados.
- Services contienen orquestación y reglas.
- Repositories específicos contienen persistencia.
- ValidationPipe en el boundary HTTP.
- No repetir validaciones primitivas después del DTO.
- No generic repositories.
- No CQRS, event bus o microservicios sin issue/ADR aprobado.

## 5. Reglas duras

- Una sola feature por ciclo.
- La primera feature pendiente válida es el spike mínimo del reloj.
- No ampliar alcance.
- No refactor oportunista.
- No inventar carpetas, scripts, modelos o endpoints.
- Campos obligatorios por defecto.
- Sin `any`.
- Sin fallback silencioso.
- Sin valores fisiológicos por defecto.
- Dato ausente no equivale a cero.
- No permitir que IA eluda Safety Engine.
- No exponer secretos, tokens, PII ni datos clínicos en logs.
- Toda implementación requiere evidencia de verificación.

## 6. Mapa objetivo

```text
apps/api       NestJS
apps/mobile    Flutter
apps/watch     Zepp OS app + app-side service
spikes         validaciones técnicas temporales
docs
issues
progress
scripts
```

No asumir que una ruta ya existe.

## 7. Flujo

```text
leader -> implementer -> reviewer -> leader
```

Cada feature produce:

```text
progress/plan_<id>_<slug>.md
progress/impl_<id>_<slug>.md
progress/review_<id>_<slug>.md
```

## 8. Estrategia para el harness

```text
Leader
└── gpt-5.6-terra

Implementer
└── gpt-5.6-terra

Reviewer normal
└── gpt-5.6-terra

Arquitectura crítica / integraciones difíciles
└── gpt-5.6-sol

Cambios mecánicos, documentación y tareas pequeñas
└── gpt-5.6-luna
```

No reasignar estos modelos salvo orden explícita del usuario.
