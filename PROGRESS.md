# PROGRESS — EVENTFLOW AI Admin Web

## Estado actual (fecha: 2026-11-08)

- **Fase 1 (Landing page):** ✅ Completada y desplegada.
- **Hito 2 (Auth + Dashboard Protegido):** ✅ Completado.
- **Hito 3 (Gestión de Eventos):** 🚧 En progreso (80% completado).
  - ✅ Layout principal del Dashboard (Sidebar colapsable y estado global).
  - ✅ Rediseño UI: Glassmorphism avanzado, Gradient Mesh y animaciones con Framer Motion.
  - ✅ CRUD de Eventos: Crear, editar y eliminar eventos conectados a Firestore.
  - ✅ Integración de Mapa (Leaflet nativo) con búsqueda por texto (Nominatim), autocompletado contextual a Bolivia y soporte para coordenadas exactas.
  - ✅ Modal dinámico que expande el mapa y colapsa el Sidebar automáticamente.

## Decisiones técnicas recientes

- **Mapas:** Se descartó `react-leaflet` por conflictos con React 19. Se implementó Leaflet nativo con `useRef` y `useEffect` para inicializar el mapa de forma segura.
- **Framer Motion:** Uso de `Variants` y tipado `as const` para evitar errores de TypeScript en `easeOut`.
- **Comunicación de componentes:** Uso de `CustomEvent` (`collapse-sidebar`, `restore-sidebar`) para comunicar el Modal de Eventos con el Sidebar sin usar Context API.
- **Base de Datos:** Colección `events` con `organizerId`, `lat`, `lng`, `guestCount`, etc.

## Próximos pasos pendientes (Para mañana)

- [ ] **Hito 3:** Finalizar vista detallada de cada evento ("Administrar Evento").
- [ ] **Hito 3:** Módulo de Invitados (CRUD, importación CSV, asignación a mesas).
- [ ] **Hito 4:** Módulo de Distribución IA.
- [ ] **Hito 4:** Inventario y QRs.
- [ ] **Futuro:** Módulo de Staff (requiere Cloud Functions).

## Notas

- No subir secretos ni datos reales. Usar `.env.local` (ignorado).
- Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores.
