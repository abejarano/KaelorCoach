# Project Audit

Auditoria organizativa realizada el 2026-07-13. No se implemento codigo de negocio.

## CRITICAL

### Privacidad llega despues de datos sensibles

Evidencia: `mvp-030` depende de perfil clinico, mediciones, fotos y conversacion. Por tanto, consentimiento y clasificacion de datos no son una precondicion de M2.

Correccion: dividir `mvp-030` en un issue temprano de consentimiento, clasificacion y retencion minima que bloquee M2, y un issue final de exportacion/eliminacion. Actualizar dependencias antes de iniciar `mvp-013`.

### El orden del Safety Engine contradice la arquitectura

Evidencia: `docs/ARCHITECTURE.md` establece `hard rules -> readiness/recovery -> planning -> IA`, pero `mvp-025` depende de `mvp-024` (Recovery Snapshot).

Correccion: eliminar `mvp-024` de las dependencias de `mvp-025`; hacer que `mvp-024` dependa de `mvp-025`, o documentar con precision por que Safety no necesita recovery. La primera alternativa preserva el principio de seguridad.

## HIGH

### El feature list era una copia manual de GitHub

Evidencia: version 2 de `feature_list.json` repetia estado, prioridad y enlaces sin generador funcional; `create-github-issues.mjs` exigia archivos `issues/` inexistentes.

Correccion: `scripts/sync-features.mjs` genera el archivo desde GitHub y `scripts/sync-github-project.mjs` normaliza proyecto remoto. No editar `feature_list.json` directamente.

### Issues sin milestones y taxonomia inconsistente

Evidencia: los 30 issues abiertos no tienen milestone y usan `phase:`/`area:` en lugar de un contrato de etiquetas estable.

Correccion: aplicar el dry run de `sync-github-project.mjs` con credenciales validas. Crea milestones M0-M5 y sustituye las etiquetas heredadas por priority, epic, type, status, risk y platform.

### Codex OAuth no tiene una decision operativa cerrada

Evidencia: arquitectura nombra `CodexOAuthAdapter` para uso personal y `OpenAIResponsesAdapter` posterior, sin una decision de credenciales, retencion, limites ni operacion en Cloud Run.

Correccion: antes de `mvp-020`, crear una ADR pequena que defina proveedor permitido, identidad propietaria, almacenamiento de tokens, minimizacion de contexto y criterio de cambio a produccion.

## MEDIUM

### El harness no tenia Planner, QA ni Product Owner

Evidencia: la cadena era `leader -> implementer -> reviewer -> leader`; no separaba plan tecnico, evidencia independiente ni aceptacion de producto.

Correccion: usar la cadena definida en `AGENTS.md` y sus seis agentes. QA no reimplementa; prueba evidencia. Product Owner solo acepta alcance y valor, no codigo.

### CODEX.md y skills repetian reglas globales

Evidencia: restricciones de alcance, DDD, fallbacks y logs aparecian en varios documentos y en cada issue.

Correccion: `CODEX.md` conserva reglas globales; los skills conservan solo procedimientos de superficie. La plantilla conserva el contrato ejecutable minimo.

### El README apuntaba a documentacion inexistente

Evidencia: referenciaba `issues/README.md`, pero no existe directorio `issues/`.

Correccion: README pasa a ser el indice unico y apunta a GitHub Issues y a los documentos reales.

## LOW

### "MVP" incluye capacidades post-decision diaria

Evidencia: conversacion, memoria y revision semanal aparecen como requisitos antes de finalizar el listado, aunque la promesa ya se cumple en `mvp-027`.

Correccion: tratar `mvp-028` y `mvp-029` como extensiones posteriores a la primera recomendacion diaria. Mantenerlos en roadmap, pero no bloquear el primer piloto de entrenador.

### "Relaxmedic" no tiene contrato de integracion probado

Evidencia: producto menciona carga manual o captura confirmada; la importacion por captura se programa despues como IA.

Correccion: declarar la entrada manual como camino MVP y mantener `mvp-022` como mejora opcional hasta que una muestra real confirme formato y calidad.
