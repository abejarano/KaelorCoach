# Estandar de Issues

GitHub Issues es la fuente de verdad ejecutable. Cada issue usa `.github/ISSUE_TEMPLATE/feature.md`; la plantilla y `scripts/sync-github-project.mjs` mantienen la estructura y el Definition of Done compartidos.

`## Definition of Done` es la ultima seccion de nivel 2. Cualquier evidencia, referencia o nota de migracion debe ir antes de ella. Esta convencion permite al sincronizador reemplazar el DoD completo sin conservar criterios obsoletos ni duplicados.

Etiquetas permitidas:

- Una `priority:p0`, `priority:p1` o `priority:p2`.
- Una `epic:discovery`, `epic:foundation`, `epic:capture`, `epic:intelligence`, `epic:coach` o `epic:operations`.
- Una `type:spike` o `type:feature`.
- Una `status:ready`, `status:in-progress` o `status:blocked`. Un issue cerrado representa `done`.
- Cero o mas `risk:health`, `risk:privacy`, `risk:integration`.
- Una o mas `platform:watch`, `platform:mobile`, `platform:api` cuando aplique.

El milestone se deriva del epic. No se crea un milestone por issue.

Flujo operativo:

```bash
node scripts/sync-github-project.mjs
node scripts/sync-github-project.mjs --apply
node scripts/sync-features.mjs
node scripts/verify-project.mjs
```

El primer comando es un dry run. `--apply` es la unica operacion que modifica GitHub. `sync-features` genera `feature_list.json`; no se edita a mano.
