# Kaelor Coach

Kaelor Coach es un entrenador personal asistido por IA que combina datos del Amazfit Active 2, Health Connect, entrenamientos, composición corporal, alimentación y contexto clínico para recomendar qué entrenar, cuándo hacerlo y con qué intensidad.

## Documentación principal

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/PERSISTENCE.md`
- `docs/FRONTEND_GUIDE.md`
- `docs/conventions.md`
- `docs/verification.md`
- `CODEX.md`
- `AGENTS.md`

## Arnés Codex

```text
leader -> implementer -> reviewer -> leader
```

El estado del trabajo vive en `feature_list.json` y `progress/`.
