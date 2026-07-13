# Guía Frontend — Flutter y Amazfit

## 1. Principios

- Android-first.
- Material 3.
- Tema centralizado; no colores hardcoded en screens.
- Seed inicial: `#4F46E5` hasta una revisión formal de branding.
- Claridad sobre decoración.
- Touch targets adecuados.
- Accesibilidad básica.
- No presentar estimaciones como mediciones exactas.

## 2. Flutter

Estructura orientativa, solo crear lo necesario:

```text
lib/
  app/
  core/
    api/
    auth/
    theme/
  features/
    recovery/
    workouts/
    profile/
    nutrition/
```

Una feature Flutter puede contener:

```text
screen/
widgets/
data/
models/
```

No crear todas las carpetas por plantilla.

Screens coordinan navegación y estado. Widgets encapsulan partes visuales. La lógica de plataforma/API vive fuera del widget.

Estados obligatorios cuando correspondan:

- loading;
- empty;
- error con reintento;
- success;
- permiso denegado;
- datos insuficientes.

## 3. Formularios

- Campos exactos.
- No agregar opcionales “por comodidad”.
- Errores humanos.
- Submit deshabilitado mientras procesa.
- No cerrar flujo crítico tocando fuera.
- Conservar datos ante error.

## 4. Recomendaciones de salud

Siempre mostrar:

- decisión;
- razones principales;
- datos faltantes;
- nivel de confianza;
- advertencia cuando el sistema no tiene información suficiente.

## 5. App del reloj

- Pantallas muy simples.
- Texto legible y acciones grandes.
- Una acción principal por vista.
- Feedback inmediato de envío/confirmación.
- No exigir teclado complejo para el primer spike.
- Persistencia local explícita cuando la feature la implemente.
- No bloquear el reloj esperando red.
