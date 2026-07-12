# Product — Kaelor Coach

## 1. Visión

Kaelor Coach es un agente entrenador personal que transforma datos de recuperación, entrenamiento, composición corporal, alimentación y contexto clínico en decisiones diarias concretas, explicables y seguras.

La pregunta central del producto es:

> ¿Qué debo entrenar hoy, con qué intensidad, durante cuánto tiempo y por qué?

## 2. Ciclo principal

```text
Medir -> Interpretar -> Recomendar -> Ejecutar -> Evaluar -> Aprender
```

## 3. Fuentes de datos

- Amazfit Active 2 mediante miniapp Zepp OS.
- Zepp Side Service.
- Health Connect en Android.
- Registro directo de sesiones de fuerza, casa y taekwondo.
- Balanza Relaxmedic mediante carga manual o captura confirmada.
- Fotografías de comidas.
- Perfil clínico y de rendimiento.
- Check-in diario subjetivo.

## 4. Objetivo del MVP

Crear una aplicación Android-first capaz de:

1. Obtener datos disponibles desde Health Connect.
2. Registrar entrenamientos desde el reloj y el móvil.
3. Diferenciar taekwondo, gimnasio y entrenamiento en casa.
4. Registrar ejercicios, series, repeticiones, carga, descanso y RPE.
5. Registrar composición corporal de Relaxmedic.
6. Analizar comidas por imagen con confirmación del usuario.
7. Crear un estado diario de recuperación.
8. Recomendar el entrenamiento del día.
9. Explicar qué datos influyeron en la recomendación.
10. Adaptar el plan semanal según respuesta real.

## 5. Principios de producto

- La aplicación no diagnostica enfermedades.
- La IA no reemplaza evaluación médica.
- Los datos medidos, reportados, calculados y estimados deben distinguirse.
- Ninguna estimación visual de comida se presenta como exacta.
- Los datos faltantes no se sustituyen con valores inventados.
- Las recomendaciones deben ser trazables.
- El usuario puede corregir cualquier estimación de IA.
- Las reglas de seguridad prevalecen sobre la recomendación del modelo.

## 6. Perfil clínico y de rendimiento

Debe incluir, solo mediante modelos específicos:

- identidad fisiológica;
- objetivos deportivos;
- experiencia y disponibilidad;
- enfermedades confirmadas;
- medicamentos activos;
- suplementos;
- lesiones y limitaciones;
- contexto hormonal y reproductivo cuando aplique;
- resultados de laboratorio estructurados;
- antecedentes familiares relevantes;
- restricciones indicadas por profesionales.

Los campos son obligatorios por defecto. Un campo opcional requiere una razón funcional real y documentada.

## 7. Métrica principal

Porcentaje de días en los que el usuario recibe una decisión útil, la ejecuta y reporta que fue adecuada para su estado.
