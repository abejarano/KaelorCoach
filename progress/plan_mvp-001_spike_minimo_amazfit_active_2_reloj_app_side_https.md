# Plan — mvp-001: Spike mínimo Amazfit Active 2: reloj → app-side → HTTPS

## Contexto y precondiciones

- Issue: [#1](https://github.com/abejarano/KaelorCoach/issues/1), `mvp-001`, `M0 Discovery`, `priority:p0`, `type:spike`.
- El artefacto generado indica `status:ready`, sin dependencias, y las etiquetas `platform:watch` y `risk:integration`.
- `progress/current.md` no registra otra feature activa; `./init.sh` pasó en la planificación.
- El repositorio todavía no contiene proyecto Zepp, manifiesto, versión de API/SDK ni comandos de build, empaquetado, instalación o logs. Deben obtenerse de las herramientas Zepp realmente instaladas, no suponerse desde documentación orientativa.
- El objetivo es evidencia física de una ruta mínima. No es la creación de `apps/watch` productivo: el roadmap reserva esa estructura para después de validar el spike M0.

## Alcance obligatorio

1. Crear un spike Zepp aislado bajo la superficie prevista `spikes/zepp-active2-roundtrip/`, usando la estructura que genere el SDK Zepp disponible.
2. Implementar una interacción mínima en el Amazfit Active 2 físico que origine un evento técnico no clínico y sanitizado.
3. Transportar ese evento del reloj al app-side service mediante la API de mensajería que el SDK real exponga.
4. Hacer que el app-side valide el boundary del mensaje y envíe el evento por HTTPS a una URL de prueba configurable.
5. Recibir y correlacionar una confirmación por `eventId` antes de mostrar éxito en el reloj. La UI debe distinguir, como mínimo, pendiente/envío, aceptado y error.
6. Documentar evidencia reproducible y sanitizada: modelo del reloj, firmware, versión de Zepp, versión/API del SDK, pasos, resultado de cada tramo y limitaciones observadas.

## Fuera de alcance

- Monorepo o proyecto productivo en `apps/watch`.
- NestJS, Cloud Run, base de datos, autenticación, Flutter o Health Connect.
- Sensores, datos de salud, auditoría de capacidades, persistencia diferida, cola de reintentos o reenvío offline; corresponden a `mvp-002` a `mvp-004` cuando aplique.
- Telemetría con PII, secretos, tokens, fotos o datos clínicos.
- Declarar éxito de red antes del ACK correlacionado.

## Superficies reales y archivos previsibles

| Superficie | Estado actual | Cambio previsto |
| --- | --- | --- |
| `spikes/zepp-active2-roundtrip/` | No existe | Proyecto mínimo generado por el SDK Zepp real, con código del reloj y del app-side según su estructura oficial. |
| Configuración/manifiesto del spike | No existe | API level, permisos y URL HTTPS de prueba configurables, usando los nombres y formato del SDK generado. |
| `progress/impl_mvp-001_spike_minimo_amazfit_active_2_reloj_app_side_https.md` | No existe | Evidencia de implementación, entorno físico, comandos reales y resultado sanitizado. |
| `progress/review_mvp-001_spike_minimo_amazfit_active_2_reloj_app_side_https.md` | No existe | Revisión de alcance, contratos, ausencia de datos sensibles y evidencia del ACK. |
| `progress/qa_mvp-001_spike_minimo_amazfit_active_2_reloj_app_side_https.md` | No existe | Repetición del recorrido crítico en dispositivo físico y resultado. |

No se nombran archivos fuente, comandos de Zepp ni permisos concretos antes de crear/inspeccionar el proyecto generado: hoy no existen en el repositorio y deducirlos violaría las reglas del proyecto.

## Contratos e invariantes

- El evento de reloj a app-side debe tener una versión explícita, un `eventId` único e idempotente y una referencia temporal con unidad/formato explícitos. No transportará señales fisiológicas ni valores inventados.
- El app-side es el único responsable del HTTPS: recibe el mensaje, valida forma y versión en el boundary, conserva el `eventId` durante el recorrido y rechaza mensajes inválidos sin enviarlos.
- El endpoint HTTPS de prueba debe poder configurarse fuera del payload y no puede registrar ni exponer secretos. El spike no presupone un backend Kaelor Coach.
- La respuesta aceptada debe incluir el `eventId` del evento enviado. Solo esa coincidencia habilita el estado `aceptado` en el reloj; timeout, respuesta inválida o `eventId` distinto quedan visibles como `pendiente` o `error`, sin éxito falso.
- Cualquier decisión sobre nombres exactos del envelope, mecanismo de ACK y permisos queda anclada al API level y SDK constatados, y se registra en la evidencia del spike.

## Secuencia de implementación

1. Confirmar en el issue remoto que el alcance y criterios siguen siendo los de `mvp-001`; ejecutar el check de gobernanza antes de crear runtime.
2. Provisionar o inspeccionar el SDK Zepp y crear el proyecto mínimo en el directorio del spike. Registrar versiones, API level, manifiesto y comandos que realmente genere/acepte la herramienta.
3. Implementar el emisor técnico y su estado visual en el reloj; implementar receptor/validador app-side y la llamada HTTPS configurable.
4. Implementar la correlación de ACK por `eventId` y los estados visibles; no añadir persistencia ni reintentos, que no pertenecen a este issue.
5. Ejecutar la prueba extremo a extremo en Amazfit Active 2 enlazado con Android/Zepp, conservar solo evidencia sanitizada y documentar fallos o límites de la plataforma.
6. Crear los artefactos de implementación, revisión y QA exigidos por el harness antes de solicitar aceptación.

## Verificación y evidencia

Comandos existentes y verificables antes/durante el cambio:

```bash
./init.sh
node scripts/sync-features.mjs --check
```

Tras generar el proyecto, el implementer debe leer su configuración y registrar en `progress/impl_...` los comandos exactos de build, package, instalación y logs del SDK real. No se autoriza sustituirlos por comandos supuestos ni afirmar una prueba física con emulador.

Evidencia mínima del dispositivo:

1. Modelo Amazfit Active 2, firmware, teléfono Android, versión de Zepp y versión/API del SDK.
2. Captura o log sanitizado de un `eventId` emitido por el reloj, recibido por app-side y enviado al endpoint HTTPS.
3. Captura o log sanitizado del ACK HTTPS correlacionado y del estado `aceptado` mostrado después de ese ACK.
4. Un caso negativo reproducible (sin ACK, respuesta inválida o `eventId` no coincidente) que demuestre estado pendiente/error sin confirmación falsa.
5. Resultado y limitaciones para alimentar las siguientes features de M0, sin extrapolar disponibilidad de sensores.

## Riesgos y bloqueos

- **Reloj físico y teléfono enlazado:** sin Amazfit Active 2, Android y Zepp vinculados no se cumple la evidencia de salida M0; un emulador no desbloquea la feature.
- **SDK/API/permisos no confirmados:** el repositorio no contiene aún ese contexto. Si la mensajería reloj → app-side o HTTPS no está soportada por el API level real, documentar el resultado y bloquear/escalar la decisión; no inventar adaptadores.
- **Endpoint HTTPS de prueba:** debe existir una URL segura alcanzable desde app-side y un mecanismo de ACK correlacionado. Si requiere credenciales, provisión o un proveedor nuevo, pedir decisión explícita antes de introducirlos.
- **Conectividad:** la evidencia debe diferenciar fallo de enlace reloj/app-side de fallo HTTPS. Persistencia y reintento diferido no se incorporan como solución en este issue.
- **Privacidad:** logs y evidencia no pueden incluir URL con credenciales, tokens, identificadores personales ni datos de salud.
- **Confirmación del issue remoto:** durante la planificación falló la consulta a `api.github.com`; el `--check` anterior a implementar debe pasar con conectividad para confirmar que el issue remoto no cambió respecto de `feature_list.json`.
