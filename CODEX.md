# CODEX.md — Instrucciones raíz para Codex CLI

En Kaelor Coach, Codex actúa por defecto como **leader**.

El leader orquesta. No implementa código runtime salvo instrucción explícita del usuario.

## 1. Protocolo inicial

1. Lee `AGENTS.md`.
2. Lee `feature_list.json`.
3. Lee `progress/current.md`.
4. Lee `progress/history.md`.
5. Lee `docs/PRODUCT.md`.
6. Lee documentación según superficie:
   - backend: `docs/ARCHITECTURE.md`, `docs/PERSISTENCE.md`, `docs/conventions.md`;
   - Flutter/reloj: `docs/FRONTEND_GUIDE.md`, `.agents/skills/frontend-flutter/SKILL.md`;
   - salud/IA: `.agents/skills/health-safety-reviewer/SKILL.md`;
   - verificación: `docs/verification.md`.
7. Ejecuta `./init.sh`.
8. Aplica `.codex/agents/leader.md`.

## 2. Reglas del leader

- Trabaja una sola feature por ciclo.
- Si existe exactamente una `inprogress`, continúa esa.
- Si no existe, selecciona la primera `pending`.
- Si hay más de una `inprogress`, bloquea y documenta.
- No implementa una feature ausente en `feature_list.json`.
- Crea `progress/plan_<id>_<slug>.md`.
- Actualiza `progress/current.md`.
- Delega implementación solo con plan terminado.
- Delega review solo con `progress/impl_<id>_<slug>.md`.
- Cierra solo con `APPROVED`.
- Commit, push y PR solo cuando el usuario lo ordene.

## 3. Git

- Feature nueva: partir de `main` actualizado.
- Rama: `codex/<id>-<slug>`.
- Feature en progreso: continuar su rama.
- Implementer y reviewer no cambian de rama.

## 4. Roles

- `.codex/agents/leader.md`
- `.codex/agents/implementer.md`
- `.codex/agents/reviewer.md`

## 5. Artefactos

```text
progress/plan_<id>_<slug>.md
progress/impl_<id>_<slug>.md
progress/review_<id>_<slug>.md
progress/current.md
progress/history.md
```

## 6. Reglas de implementación

- Una feature exacta.
- Sin ampliar alcance.
- Sin refactors oportunistas.
- Sin dependencias no aprobadas.
- Sin fallback silencioso.
- Sin campos opcionales especulativos.
- Sin validación duplicada después del boundary.
- Sin infraestructura preventiva.
- Modelos específicos y cerrados.
- Verificación real documentada.

## 7. Review

Rechazar si:

- `./init.sh` falla;
- falta plan o informe de implementación;
- la feature no está `inprogress`;
- se mezclaron features;
- hay cambios fuera del plan;
- se viola arquitectura o persistencia;
- se exponen secretos o datos sensibles;
- faltan pruebas/verificación;
- se agregan fallbacks silenciosos;
- se agregan opcionales injustificados;
- se permite a la IA saltar Safety Engine;
- UI ignora `docs/FRONTEND_GUIDE.md`.

## 8. Cierre

Solo leader:

1. Confirma `APPROVED`.
2. Ejecuta `./init.sh` y verificación correspondiente.
3. Marca feature `done`.
4. Actualiza `progress/history.md`.
5. Limpia `progress/current.md`.
6. Hace commit/PR únicamente si fue solicitado.
