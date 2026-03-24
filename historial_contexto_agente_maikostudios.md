# Historial Operativo - Migración de MaikoStudios

**Rol de Autonomía:** ARQUITECTO PRINCIPAL + LEAD FRONTEND/BACKEND MIGRATION ENGINEER
**Fuente de Verdad:** `v2contabo.md`

Este documento mantiene el contexto entre bloques operativos para la migración de MakoStudios.

## [2026-03-24 12:25] FASE 4: ADAPTAR FRONTEND - Bloque 1: Preparación Base
- **Objetivo**: Inicializar el contexto, definir estrategia corto plazo, instalar el cliente API e interceptores.
- **Diagnóstico**: Existen llamadas activas a `firebase/*` en múltiples servicios (`authService`, `chatbotService`, `pricingService`, `services.js`, `store/main.js`). El backend local Node.js + Express ya está corriendo en el puerto 3001. Aún se empleaba la variable `dangerouslyAllowBrowser: true` en las apis de OpenAI y llamados crudos a Gemini.
- **Decisiones**: 
  1. Utilizar un `apiClient.js` con Axios que inyecte de forma global el interceptor del token JWT (`Authorization: Bearer`). 
  2. Sustituir `firebase/auth` por Endpoints REST `auth.routes.js` de nuestro backend.
  3. Desacoplar Firebase Auth como core de `authService.js` en una transición paulatina.
- **Riesgos**: Posible interrupción en las Protected Routes (Router Guards) si JWT no se almacena/limpia o hidrata a tiempo durante recargas de páginas.
- **Pendientes Inmediatos**:
  - Crear `src/api/apiClient.js`.
  - Refactorizar el `src/services/authService.js`.
  - Actualizar el login pinia store (`src/stores/main.js`).
  - Actualizar `src/router/index.js` para usar lectura JWT sincrona/asincrona (si es necesario).
