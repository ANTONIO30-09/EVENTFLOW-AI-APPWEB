# PROGRESS — EVENTFLOW AI Admin Web

## Estado actual (fecha: 2026-11-07)

- **Fase 1 (Landing page):** ✅ Completada y rediseñada con Glassmorphism.
- **Repositorio formalizado:** ✅ Ramas `dev` y flujo de PR establecidos.
- **Despliegue:** ✅ Subido a Firebase Hosting (https://admin-eventflow-ai.web.app/).
- **Fase 2 (Auth + Dashboard + Eventos):** 🚧 Siguiente paso.

## Decisiones técnicas recientes

- **Diseño (Landing):** Se implementó Glassmorphism (cristal esmerilado), Gradient Mesh y un fondo unificado de video fijo.
- **Animaciones:** Se usó `HandwrittenTitle.tsx` (SVG Path Animation) para el trazo del logo y Kinetic Typography (letra por letra) para el storytelling. Todo optimizado con `Variants` de Framer Motion.
- **Rendimiento:** Se creó `ParticlesBackground.tsx` usando Canvas HTML5 (evitando sobrecargar el DOM) y se optimizaron las transiciones del slider (Cross-fade).
- **Tipografía:** Great Vibes (logo), Playfair Display (títulos editoriales), Inter (UI).

## Próximos pasos pendientes

- [ ] **Hito 2:** Autenticación real con Firebase + layout protegido del dashboard.
- [ ] **Hito 3:** CRUD de eventos y lectura desde Firestore.
- [ ] **Hito 4:** Integración con IA + invitados (distribución y reglas de compatibilidad).

## Notas

- No subir secretos ni datos reales. Usar `.env.local` (ignorado).
- Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.
