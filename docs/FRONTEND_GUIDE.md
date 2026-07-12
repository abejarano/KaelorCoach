# Frontend Guide — Kaelor Coach

## 1. Alcance

Flutter Android-first. La aplicación está especializada en Kaelor Coach y consume únicamente su API.

## 2. Principios

- Mobile-first real.
- Una pantalla debe tener un propósito principal.
- No mezclar dashboard, formulario, historial y detalle en una sola pantalla.
- La página/screen orquesta; widgets encapsulan bloques visuales.
- La lógica de negocio no vive en widgets.
- La transformación de datos no se duplica entre screen y widget.
- No crear componentes genéricos sin uso real.
- No inventar diseño fuera del design system.

## 3. Estructura recomendada

```text
lib/
  app/
  core/
    api/
    auth/
    health_connect/
    theme/
  features/
    onboarding/
    recovery/
    workouts/
    nutrition/
    body_measurements/
    coach/
  shared/
    widgets/
    formatting/
```

Cada feature puede tener:

```text
feature/
  data/
  domain/
  presentation/
```

No crear capas vacías por plantilla.

## 4. Estado

Elegir una única solución de estado al inicializar el proyecto y documentarla.

No mezclar múltiples librerías de estado.

Los estados de pantalla deben ser explícitos:

```text
initial
loading
success
empty
error
permissionRequired
partialData
```

`partialData` se utiliza solo cuando realmente hay datos incompletos que todavía permiten mostrar valor.

## 5. Formularios

- Campos exactos y alineados con el contrato backend.
- Validación humana en frontend.
- Validación de contrato nuevamente en middleware backend.
- Mensajes concretos.
- No cerrar diálogos por backdrop durante flujos críticos.
- Evitar campos opcionales “por si acaso”.
- No pedir información clínica irrelevante para la feature.

## 6. Pantalla diaria principal

Orden recomendado:

1. Estado de recuperación.
2. Recomendación principal.
3. Razones que influyeron.
4. Datos faltantes.
5. Próxima sesión.
6. Acciones: iniciar, adaptar, reportar limitación.

No llenar la pantalla con gráficos decorativos.

## 7. Entrenamiento en reloj

La UX del reloj debe minimizar interacción:

- seleccionar tipo;
- iniciar/pausar/finalizar;
- confirmar serie;
- ajustar repeticiones;
- ajustar carga;
- ver descanso;
- registrar RPE al finalizar.

## 8. Alimentación por foto

Flujo obligatorio:

```text
capturar -> procesando -> resultado estimado -> confirmar/corregir -> guardar
```

Siempre mostrar rango y confianza, nunca falsa precisión.

## 9. Accesibilidad

- touch targets suficientes;
- contraste adecuado;
- no depender solo del color;
- texto escalable;
- labels y semántica;
- estados anunciables.

## 10. Idioma

El MVP debe preparar i18n para español y portugués de Brasil, pero no duplicar implementación antes de que exista el catálogo base.
