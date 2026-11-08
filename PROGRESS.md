# PROGRESS — EVENTFLOW AI Admin Web

## Estado actual (fecha: 2026-11-07)

- **Fase 1 (Landing page):** ✅ Completada y rediseñada con Glassmorphism.
- **Hito 2 (Auth + Dashboard Protegido):** ✅ Completado.
  - Auth real con Firebase (Email/Password + Google).
  - Rutas protegidas (Guardián en `/dashboard`).
  - Validaciones con Zod y React Hook Form.
  - Rediseño Split-Screen (Login y Registro) con imagen y cristal.
- **Repositorio formalizado:** ✅ Ramas `dev` y flujo de PR establecidos.
- **Despliegue:** ✅ Subido a Firebase Hosting (https://admin-eventflow-ai.web.app/).

## Decisiones técnicas recientes

- **Autenticación:** Firebase Auth con `AuthContext` y `authService` separado para mayor escalabilidad.
- **Roles:** El registro web crea el rol `organizador` por defecto. Los `staff` serán creados por el organizador a futuro.
- **Base de Datos:** Colección `profiles` en Firestore (alineada con las reglas de la app móvil).
- **Diseño (Auth):** Formularios validados y diseño de dos columnas asimétrico de alta gama.

## Próximos pasos pendientes

- [ ] **Hito 3:** CRUD de eventos y lectura desde Firestore.
- [ ] **Hito 4:** Integración con IA + invitados (distribución y reglas de compatibilidad).
- [ ] **Futuro:** Módulo para que el Organizador cree cuentas de Staff.

## Notas

- No subir secretos ni datos reales. Usar `.env.local` (ignorado).
- Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.
