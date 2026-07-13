# Kaelor Coach

Kaelor Coach será un agente entrenador personal que observa el estado real del usuario y transforma datos de recuperación, entrenamiento, alimentación, composición corporal y contexto de salud en decisiones diarias concretas.

## Regla de inicio

El desarrollo comienza por `mvp-001`: una miniapp mínima instalada en Amazfit Active 2 que valida reloj → app-side service → HTTPS. No se construye primero el backend completo ni la IA.

## Documentación

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/PERSISTENCE.md`
- `docs/FRONTEND_GUIDE.md`
- `feature_list.json`
- `issues/README.md`

## Harness

```bash
chmod +x init.sh verify.sh
./init.sh
```

## Crear issues GitHub y enlazar feature_list

```bash
gh auth status
node scripts/create-github-issues.mjs abejarano/KaelorCoach
node scripts/check-feature-issues.mjs
```
