# Codex Global Rules

## Inicio de una feature

1. Leer `ROADMAP.md`, el GitHub issue, este archivo y el skill aplicable.
2. Ejecutar `./init.sh` y confirmar que no existe mas de una feature `inprogress`.
3. Trabajar una sola feature cuyo issue este `status:ready` y cuyas dependencias esten cerradas.
4. Seguir la cadena de roles de `AGENTS.md`; no cerrar sin evidencia de review, QA y Product Owner.

## Reglas globales

- No ampliar alcance ni hacer refactors oportunistas.
- No inventar rutas, comandos, contratos, datos, endpoints o modelos.
- Campos obligatorios por defecto; el dato ausente se representa explicitamente y nunca como cero.
- Sin `any`, fallbacks silenciosos, valores fisiologicos inventados ni abstracciones especulativas.
- NestJS es un monolito modular pragmatico: controller -> service -> repository concreto. No DDD fuerte, CQRS, event bus, microservicios ni generic repositories sin una decision aprobada.
- La validacion de forma ocurre en el boundary; las reglas de negocio, ownership e invariantes siguen siendo obligatorias.
- La IA no diagnostica, no altera datos originales y no puede elevar una decision del Safety Engine.
- No registrar secretos, tokens, PII, fotos ni datos clinicos completos.
- Toda afirmacion de terminado requiere verificacion real y evidencia sanitizada.

## Limites de arquitectura

- Antes de M0 no existe plataforma productiva. Las capacidades de Zepp y Health Connect se prueban en dispositivo real.
- Flutter Android-first, NestJS en Cloud Run, PostgreSQL Neon con Drizzle y objetos en Cloud Storage siguen siendo la direccion objetivo, no autorizacion para crear infraestructura anticipada.
- Cualquier cambio de proveedor de IA, credenciales, retencion o datos clinicos requiere decision explicita antes de implementarse.
