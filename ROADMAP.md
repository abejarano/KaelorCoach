# Kaelor Coach Roadmap

Kaelor Coach avanza desde evidencia fisica hasta una decision diaria segura. Ninguna fase se inicia por expectativa de una plataforma: se inicia cuando el criterio de salida de la anterior esta demostrado.

## M0 - Discovery

Objetivo: demostrar que Amazfit Active 2, Zepp OS y Health Connect entregan las senales reales que necesita el producto.

Entregables: spike reloj-app-side-HTTPS, auditoria de sensores, prueba de persistencia diferida, auditoria Health Connect y matriz de capacidades con decision go/no-go.

Dependencia: reloj fisico, telefono Android vinculado y acceso a Zepp/Health Connect.

Riesgo principal: que una senal requerida no sea accesible desde el reloj ni publicada por Zepp. La respuesta es flujo manual o exclusion explicita del MVP, no datos inventados.

Criterio de salida: `mvp-001` a `mvp-005` cerrados, con evidencia fisica y una matriz que nombre fuente, unidad, limitacion y alternativa de cada dato del MVP.

## M1 - Foundation

Objetivo: establecer una plataforma minima sin adelantar comportamiento de entrenador.

Entregables: monorepo, API NestJS en Cloud Run, Neon con Drizzle, autenticacion Android, shell Flutter y proyecto Zepp productivo.

Dependencia: decision de M0. La estructura productiva del reloj solo se crea despues del spike validado.

Riesgo principal: congelar contratos de datos antes de conocer las capacidades del dispositivo. La matriz M0 es la condicion de entrada.

Criterio de salida: una identidad autenticada puede usar los clientes previstos y el backend dispone de almacenamiento versionado y despliegue reproducible.

## M2 - Capture

Objetivo: obtener datos propios e integrados con procedencia, consentimiento y trazabilidad.

Entregables: Health Connect, perfil clinico y deportivo, mediciones Relaxmedic, sesiones de entrenamiento y fusion de fuentes.

Dependencia: M1 y un consentimiento base antes de persistir datos clinicos, imagenes o integraciones de salud.

Riesgo principal: mezclar observaciones de distintas fuentes o tratar ausencia como cero. Cada registro conserva origen, fecha, unidad y confianza cuando corresponda.

Criterio de salida: los datos que alimentan una decision pueden distinguirse entre medidos, reportados, calculados y estimados; ownership y deduplicacion estan demostrados.

## M3 - Intelligence

Objetivo: introducir IA como componente acotado, auditable y no decisor.

Entregables: AIModelGateway, adaptador autorizado, analisis de fotos de comida con confirmacion y lectura asistida de captura Relaxmedic.

Dependencia: M2 y una decision explicita sobre proveedor, credenciales, retencion y minimizacion de contexto.

Riesgo principal: enviar mas datos de los necesarios o presentar estimaciones como mediciones. Todo output es estructurado, validado y corregible por el usuario.

Criterio de salida: cada llamada tiene contexto minimo, proveedor/modelo/auditoria y manejo explicito de error sin fallback silencioso.

## M4 - Coach

Objetivo: generar una decision diaria explicable sobre entrenar, intensidad, descanso y limites.

Entregables: check-in, Safety Engine, Recovery Snapshot, plan semanal, recomendacion diaria, conversacion y revision semanal.

Dependencia: M2 para las entradas y M3 solo para lenguaje, imagen o personalizacion. Safety Engine precede recovery, planning y cualquier IA que redacte la decision.

Riesgo principal: permitir que una respuesta del modelo eleve una decision de seguridad. Los motores deterministas definen el maximo nivel permitido; la IA solo explica o reduce.

Criterio de salida: ante entradas completas, incompletas y bloqueadas, el sistema entrega una decision trazable, con razones, confianza, datos faltantes y feedback del usuario.

## M5 - Operations

Objetivo: completar privacidad, consentimiento, retencion, exportacion y eliminacion de datos.

Entregables: controles de consentimiento, revocacion de integraciones, exportacion y eliminacion verificables.

Dependencia: los mecanismos base de consentimiento y clasificacion de datos deben existir antes de M2; este hito completa el ciclo de vida y la experiencia de usuario.

Riesgo principal: dejar datos clinicos, fotos u objetos fuera de la eliminacion. La eliminacion debe producir evidencia de solicitud y ejecucion.

Criterio de salida: el usuario puede conocer, revocar, exportar y eliminar sus datos sin acceso cruzado ni retencion no documentada.
