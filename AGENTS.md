# AGENTS.md — Mapa de navegación para agentes IA

## 1. Producto

Kaelor Coach es un entrenador personal asistido por IA para Android y Amazfit Active 2.

Fuente funcional principal:

- `docs/PRODUCT.md`
- `feature_list.json`
- `progress/current.md`
- `progress/history.md`

## 2. Lectura obligatoria

### Siempre

- `AGENTS.md`
- `CODEX.md`
- `docs/PRODUCT.md`
- `docs/verification.md`
- `feature_list.json`
- `progress/current.md`

### Backend

- `docs/ARCHITECTURE.md`
- `docs/PERSISTENCE.md`
- `docs/conventions.md`
- `.agents/skills/repo-reader/SKILL.md`

### Flutter/reloj

- `docs/FRONTEND_GUIDE.md`
- `.agents/skills/frontend-flutter/SKILL.md`

### Salud, recuperación, IA

- `.agents/skills/health-safety-reviewer/SKILL.md`

## 3. Mapa objetivo

```text
apps/api
apps/mobile
apps/watch
apps/zepp-side-service
packages/contracts
packages/domain
packages/ai
packages/shared
docs
progress
```

No asumir que una ruta existe hasta comprobarla.

## 4. Reglas duras

- No mezclar features.
- No inventar arquitectura paralela.
- No agregar campos opcionales para esconder contratos incompletos.
- No agregar fallbacks silenciosos.
- No inventar datos de salud.
- No permitir que IA eluda Safety Engine.
- No duplicar validación de tipos después del middleware.
- No introducir Redis, colas o microservicios sin ADR aprobado.
- No exponer secretos, tokens, resultados clínicos completos ni fotos.
- Toda implementación requiere verificación concreta.

## 5. Flujo

```text
leader -> implementer -> reviewer -> leader
```

## 6. Datos sensibles

Tratar como sensibles:

- información de salud;
- medicamentos;
- diagnósticos;
- resultados de laboratorio;
- fotos de comidas o cuerpo;
- tokens de Zepp, OpenAI y Google;
- identificadores de dispositivos.

Nunca incluirlos en logs sin sanitización.
