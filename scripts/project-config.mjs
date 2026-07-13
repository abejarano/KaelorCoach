export const repository = 'abejarano/KaelorCoach';

export const labels = [
  ['priority:p0', 'B60205', 'Bloquea una decision central del MVP.'],
  ['priority:p1', 'D97706', 'Necesario para completar el MVP.'],
  ['priority:p2', '0E8A16', 'Importante, pero no bloquea el primer entrenador.'],
  ['epic:discovery', '1D76DB', 'Validacion tecnica antes de construir producto.'],
  ['epic:foundation', '1D76DB', 'Fundacion compartida del producto.'],
  ['epic:capture', '1D76DB', 'Captura y normalizacion de datos.'],
  ['epic:intelligence', '1D76DB', 'Interpretacion asistida por IA.'],
  ['epic:coach', '1D76DB', 'Decision diaria del entrenador.'],
  ['epic:operations', '1D76DB', 'Privacidad y operacion del producto.'],
  ['type:spike', '5319E7', 'Validacion tecnica con evidencia fisica.'],
  ['type:feature', '5319E7', 'Incremento ejecutable de producto.'],
  ['status:ready', '0E8A16', 'Lista para iniciar cuando sus dependencias terminen.'],
  ['status:in-progress', 'FBCA04', 'Unico trabajo activo del harness.'],
  ['status:blocked', 'B60205', 'No puede continuar sin resolver un bloqueo.'],
  ['risk:health', 'D93F0B', 'Interpreta o trata datos de salud.'],
  ['risk:privacy', 'D93F0B', 'Trata datos sensibles, consentimientos o retencion.'],
  ['risk:integration', 'D93F0B', 'Depende de una integracion externa o dispositivo fisico.'],
  ['platform:watch', '0052CC', 'Zepp OS, reloj o app-side service.'],
  ['platform:mobile', '0052CC', 'Android, Flutter o Health Connect.'],
  ['platform:api', '0052CC', 'NestJS, almacenamiento o Cloud Run.'],
].map(([name, color, description]) => ({ name, color, description }));

export const milestones = [
  ['M0 Discovery', 'Evidencia fisica y decision go/no-go de captura.'],
  ['M1 Foundation', 'Plataforma minima autenticada y desplegable.'],
  ['M2 Capture', 'Datos propios e integrados normalizados y trazables.'],
  ['M3 Intelligence', 'IA acotada para datos confirmados.'],
  ['M4 Coach', 'Recomendacion diaria segura y explicable.'],
  ['M5 Operations', 'Privacidad, consentimiento y ciclo de vida de datos.'],
];

export const epicToMilestone = {
  discovery: 'M0 Discovery',
  foundation: 'M1 Foundation',
  capture: 'M2 Capture',
  intelligence: 'M3 Intelligence',
  coach: 'M4 Coach',
  operations: 'M5 Operations',
};

export const legacyEpic = {
  spike: 'discovery',
  foundation: 'foundation',
  capture: 'capture',
  ai: 'intelligence',
  coach: 'coach',
  operational: 'operations',
};

export const sharedDefinitionOfDone = `## Definition of Done

- [ ] El alcance y los criterios de aceptacion del issue estan demostrados.
- [ ] Las dependencias, contratos y datos sensibles se respetan.
- [ ] La verificacion usa comandos reales y deja evidencia sanitizada.
- [ ] Se crea \`progress/impl_<id>_<slug>.md\` y la revision queda en \`progress/review_<id>_<slug>.md\`.
- [ ] QA registra evidencia proporcional al riesgo en \`progress/qa_<id>_<slug>.md\`.
- [ ] Product Owner acepta el resultado y el issue queda cerrado.`;

export const requiredIssueHeadings = [
  'Objetivo',
  'Contexto',
  'Dependencias',
  'Alcance obligatorio',
  'Fuera de alcance',
  'Contratos y decisiones exactas',
  'Archivos o superficies esperadas',
  'Criterios de aceptacion',
  'Verificacion minima obligatoria',
  'Evidencia requerida',
  'Definition of Done',
];
