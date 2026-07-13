# Kaelor Coach Agent Map

## Navegacion

Un desarrollador nuevo debe poder seguir esta ruta:

```text
ROADMAP.md -> GitHub issue -> CODEX.md -> skill de la superficie
```

`ROADMAP.md` explica fases, dependencias y salidas. El issue define alcance ejecutable, contratos y evidencia. `CODEX.md` contiene reglas globales. Cada skill agrega solo instrucciones de una superficie concreta.

GitHub Issues es la fuente de verdad de ejecucion. `feature_list.json` es un artefacto generado; ejecutar `node scripts/sync-features.mjs` despues de cambiar issues. Ante contradiccion, bloquear y documentar en el issue: no inventar una resolucion.

## Cadena del harness

```text
Leader -> Planner -> Implementer -> Reviewer -> QA -> Product Owner -> Done
```

- Leader selecciona una unica feature lista y coordina el ciclo.
- Planner convierte el issue en plan tecnico acotado.
- Implementer ejecuta solo el plan aprobado.
- Reviewer revisa alcance, arquitectura, contratos y seguridad.
- QA repite la evidencia critica y registra el resultado.
- Product Owner acepta el valor y alcance contra el issue; solo entonces se cierra.

Cada ciclo produce, cuando aplique:

```text
progress/plan_<id>_<slug>.md
progress/impl_<id>_<slug>.md
progress/review_<id>_<slug>.md
progress/qa_<id>_<slug>.md
```

## Estrategia fija del harness

```text
Leader, Planner, Implementer, Reviewer, QA y Product Owner
└── gpt-5.6-terra

Arquitectura critica / integraciones dificiles
└── gpt-5.6-sol

Cambios mecanicos, documentacion y tareas pequenas
└── gpt-5.6-luna
```

No reasignar estos modelos salvo orden explicita del usuario.
