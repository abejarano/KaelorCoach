# Verificación

## Regla principal

No inventar comandos. Leer archivos de configuración reales antes de ejecutar.

## Harness

```bash
./init.sh
node scripts/sync-features.mjs --check
```

Valida estructura documental y que `feature_list.json` coincida con los issues remotos, incluidos labels, estado, milestone, dependencias y URLs. No garantiza código runtime.

## Project governance

```bash
node scripts/verify-project.mjs
```

Comprueba el artefacto generado de GitHub, dependencias, plantilla de issues, skills y cadena del harness. Para refrescar issues, usar `node scripts/sync-features.mjs`; para comprobar drift sin escribir, usar `node scripts/sync-features.mjs --check`.

## Antes de review

El implementer documenta comandos reales según la superficie:

- Zepp spike: build/package/install/logs definidos por SDK real del repo.
- NestJS: lint, typecheck, tests y build existentes.
- Flutter: `flutter analyze`, tests y build cuando existan.
- Drizzle: generación/migración/check según scripts reales.

El reviewer debe repetir los comandos críticos y guardar resultado en `progress/review_...`.
