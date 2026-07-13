---
name: frontend-flutter
description: Implementa o revisa superficies Flutter de Kaelor Coach con estados, accesibilidad y decisiones de salud comprensibles.
---

# Flutter Surface

Leer `docs/FRONTEND_GUIDE.md` y la estructura real antes de crear widgets. Usar tema y navegacion existentes; screens coordinan y widgets encapsulan bloques.

Cada flujo tiene estados relevantes: carga, vacio, error recuperable, exito, permiso denegado y datos insuficientes cuando apliquen. Formularios conservan entrada ante error y los flujos criticos no se cierran por backdrop.

Para recomendaciones, mostrar decision, razones, datos faltantes y confianza. Nunca presentar una estimacion visual como medicion exacta.
