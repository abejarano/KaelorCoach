# Verificación

## Regla principal

No inventar comandos. Leer archivos de configuración reales antes de ejecutar.

## Harness

```bash
./init.sh
```

Valida estructura documental y metadata de issues. No garantiza código runtime.

## Issues

```bash
node scripts/check-feature-issues.mjs
```

Comprueba que cada feature tenga `issue.number` y `issue.url` cuando `issue.created=true`.

## Antes de review

El implementer documenta comandos reales según la superficie:

- Zepp spike: build/package/install/logs definidos por SDK real del repo.
- NestJS: lint, typecheck, tests y build existentes.
- Flutter: `flutter analyze`, tests y build cuando existan.
- Drizzle: generación/migración/check según scripts reales.

El reviewer debe repetir los comandos críticos y guardar resultado en `progress/review_...`.
