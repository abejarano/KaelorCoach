# CODEX.md — Instrucciones raíz para Codex CLI

Codex actúa por defecto como **leader**. El leader administra una sola feature y no implementa runtime salvo orden explícita.

## 1. Protocolo inicial

1. Leer `AGENTS.md`.
2. Leer `feature_list.json`.
3. Verificar que exista como máximo una feature `inprogress`.
4. Seleccionar la feature activa o la primera `pending` cuyo `dependsOn` esté terminado.
5. Leer el GitHub issue indicado por `issue.number`.
6. Si `issue.created=true`, confirmar que `issue.number` y `issue.url` coinciden con `feature_list.json`.
7. Leer `progress/current.md` y `progress/history.md`.
8. Leer documentación según la superficie.
9. Ejecutar `./init.sh`.
10. Crear `progress/plan_<id>_<slug>.md` antes de delegar.

## 2. GitHub issue y feature_list

- `feature_list.json` define orden, estado y dependencias.
- El issue define alcance, criterios de aceptación y evidencia.
- No cambiar el alcance del issue durante implementación.
- Un cambio de alcance exige actualizar issue GitHub y feature list antes de continuar.

## 3. Reglas del leader

- Una sola feature por ciclo.
- Si hay una `inprogress`, continuarla.
- Si hay más de una, bloquear.
- Si no hay `inprogress`, tomar la primera `pending` con dependencias `done`.
- Para el inicio del proyecto, `mvp-001` debe ejecutarse antes de plataforma, API, Flutter o base de datos.
- Crear rama `codex/<id>-<slug>` desde `main` actualizado.
- Marcar `inprogress` al iniciar.
- Delegar al implementer con plan terminado.
- Delegar review solo después de `progress/impl_...`.
- Cerrar únicamente con `APPROVED`.
- Commit, push y PR solo por orden explícita del usuario.

## 4. Arquitectura de implementación

- NestJS pragmático, no DDD fuerte.
- No crear capas ceremoniales.
- Controller -> Service -> Repository.
- DTO validado una vez por ValidationPipe.
- Services no repiten `typeof`, `undefined`, `isNaN` sobre DTOs válidos.
- Repositories concretos, nunca `GenericRepository<T>`.
- Campos exactos y requeridos por defecto.
- No agregar `notes`, `metadata`, `extra`, `config`, `OTHER` ni campos opcionales sin requisito.
- No CQRS, commands, handlers, aggregates, value objects o domain events sin requisito explícito.
- No fallback silencioso.
- Error real debe permanecer visible.

## 5. Artefactos

```text
progress/plan_<id>_<slug>.md
progress/impl_<id>_<slug>.md
progress/review_<id>_<slug>.md
progress/current.md
progress/history.md
```

## 6. Review obligatorio

Rechazar si:

- `./init.sh` falla;
- no se leyó el issue;
- falta plan o informe;
- se mezclaron features;
- hay cambios fuera del alcance;
- se introdujo DDD fuerte o abstracción especulativa;
- se repite validación de tipos después del boundary;
- se agregan opcionales injustificados;
- se agregan fallbacks silenciosos;
- se inventan datos de salud;
- IA puede saltar Safety Engine;
- faltan verificaciones y evidencia.

## 7. Cierre

Solo leader:

1. Confirmar `APPROVED`.
2. Ejecutar verificación indicada en el issue.
3. Marcar feature `done`.
4. Actualizar `progress/history.md` y `progress/current.md`.
5. No crear commit o PR sin orden explícita.

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
