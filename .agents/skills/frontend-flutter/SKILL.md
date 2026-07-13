---
name: frontend-flutter
description: Reglas de implementación UI/UX Flutter para Kaelor Coach.
---

# Flutter Frontend Skill

## Antes de implementar

Leer `docs/FRONTEND_GUIDE.md` y detectar theme, navegación, componentes y solución de estado reales.

## Reglas

- No inventar paleta ni tipografía.
- Screens orquestan; widgets encapsulan bloques.
- No mezclar fetch, validación, transformación y UI extensa en un archivo.
- Cubrir loading, empty, error y success.
- Usar `partialData` solo cuando exista un caso real.
- Formularios exactos, sin campos opcionales inventados.
- Flujos críticos no se cierran por backdrop.
- Accesibilidad y touch targets obligatorios.
- No mostrar estimaciones de comida como exactas.
- La recomendación diaria debe explicar razones y datos faltantes.
