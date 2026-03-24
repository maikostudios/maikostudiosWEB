# 🚀 PLAN DE CONTINUIDAD: MaikoStudios v2 → VPS Contabo

> **Documento vivo** — Se actualiza a medida que se completan las tareas.
> **Fecha de creación:** 24 de marzo de 2026
> **Autor:** Antigravity AI + Michael Sáez

---

## 📑 ÍNDICE

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Stack Tecnológico Actual](#2-stack-tecnológico-actual)
3. [Arquitectura Actual (Firebase)](#3-arquitectura-actual-firebase)
4. [APIs e Integraciones Externas](#4-apis-e-integraciones-externas)
5. [Sistema de Autenticación y Seguridad](#5-sistema-de-autenticación-y-seguridad)
6. [Base de Datos — Colecciones Firestore](#6-base-de-datos--colecciones-firestore)
7. [Fallas y Flujos Rotos Detectados](#7-fallas-y-flujos-rotos-detectados)
8. [Arquitectura Propuesta para VPS Contabo](#8-arquitectura-propuesta-para-vps-contabo)
9. [Decisión de Base de Datos: PostgreSQL vs NoSQL](#9-decisión-de-base-de-datos-postgresql-vs-nosql)
10. [Proyección de Mejoras de Rendimiento](#10-proyección-de-mejoras-de-rendimiento)
11. [Plan de Migración por Fases](#11-plan-de-migración-por-fases)
12. [Credenciales Necesarias](#12-credenciales-necesarias)
13. [Checklist de Tareas](#13-checklist-de-tareas)

---

## 1. Resumen del Proyecto

**MaikoStudios** es el sitio web corporativo/portafolio de la agencia de desarrollo "Maiko Studios" dirigida por Michael Sáez, ubicada en Temuco, Chile.

### ¿Qué hace la página?

| Módulo | Descripción |
|--------|-------------|
| **Landing / Home** | Página principal con hero section, proyecto estrella, servicios destacados |
| **Quiénes Somos** | Presentación del equipo de la agencia |
| **Servicios** | Catálogo de servicios empresariales y particulares |
| **Precios** | Sistema de packs (pago único) y planes (suscripción mensual) dinámicos desde Firestore |
| **Contacto** | Formulario de contacto con validación y almacenamiento |
| **Chatbot (MaikoBot)** | Chatbot con IA (Gemini) con sistema de strikes, validación de contacto y leads |
| **Generador de CV** | Sistema para generar CVs personalizados con IA (Gemini/DeepSeek/OpenAI) |
| **Panel Admin** | Dashboard protegido para gestionar mensajes, CVs, proyectos, precios |
| **Portafolio** | Galería de proyectos (actualmente oculto en el router, en transformación) |
| **Seguimiento** | Vista de seguimiento de proyectos (placeholder) |

---

## 2. Stack Tecnológico Actual

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Vue.js 3** | ^3.5.13 | Framework principal (Composition API) |
| **Vite** | ^6.2.0 | Bundler y dev server |
| **Vuetify 3** | ^3.8.1 | Framework de UI/componentes |
| **Pinia** | ^3.0.3 | Estado global |
| **Vue Router 4** | ^4.5.0 | Enrutamiento SPA |
| **Sass** | ^1.86.3 | Preprocesador CSS |
| **@vueuse/motion** | ^3.0.3 | Animaciones |
| **vue3-carousel** | ^0.16.0 | Carrusel de imágenes |
| **vee-validate + yup** | ^4.15.1 / ^1.6.1 | Validación de formularios |
| **html2pdf.js** | ^0.10.3 | Generación de PDFs |

### Backend / BaaS
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Firebase SDK** | ^11.9.1 | SDK de cliente |
| **Firebase Auth** | — | Autenticación (email/password + anónima) |
| **Cloud Firestore** | — | Base de datos NoSQL |
| **Firebase Storage** | — | Almacenamiento de archivos |
| **Firebase Hosting** | — | Hosting del sitio |
| **Firebase Cloud Functions** | v2 | Serverless (generación CV con DeepSeek) |
| **firebase-admin** | — | SDK de servidor (en Cloud Functions) |

### Integraciones de IA
| Servicio | Uso |
|----------|-----|
| **Google Gemini 1.5 Flash** | Chatbot MaikoBot + Generador de CV |
| **OpenAI GPT-3.5-turbo** | Chatbot alternativo (fallback) |
| **DeepSeek Chat** | Generación de CV via Cloud Functions |

### Testing
| Herramienta | Uso |
|-------------|-----|
| **Vitest** | Tests unitarios |
| **Cypress** | Tests E2E |
| **@vue/test-utils** | Testing de componentes Vue |

---

## 3. Arquitectura Actual (Firebase)

```
┌─────────────────────────────────────────────────┐
│                   USUARIO                       │
│              (Navegador Web)                    │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────▼────────────────┐
    │      Firebase Hosting       │
    │   (SPA Vue.js - dist/)      │
    │   maikostudios.com          │
    └────────────┬────────────────┘
                 │
     ┌───────────┼──────────────┐
     │           │              │
┌────▼────┐ ┌───▼───┐ ┌───────▼───────┐
│Firestore│ │ Auth  │ │   Storage     │
│  (DB)   │ │(Login)│ │ (Archivos)    │
└─────────┘ └───────┘ └───────────────┘
                 │
         ┌───────▼───────┐
         │Cloud Functions│
         │  (DeepSeek)   │
         └───────────────┘
                 │
     ┌───────────┼───────────────┐
     │           │               │
┌────▼────┐ ┌───▼────┐ ┌───────▼──────┐
│ Gemini  │ │ OpenAI │ │  DeepSeek    │
│  API    │ │  API   │ │    API       │
└─────────┘ └────────┘ └──────────────┘
```

### Proyectos Firebase activos:
- **Desarrollo:** `maikostudios-dev` → https://maikostudios-dev.firebaseapp.com/
- **Producción:** `maikostudios-a9162` → https://maikostudios.firebaseapp.com/

---

## 4. APIs e Integraciones Externas

| API/Servicio | Variable de Entorno | Estado | Uso |
|-------------|---------------------|--------|-----|
| Firebase | `VITE_FIREBASE_*` | ✅ Activo | BaaS completo |
| Google Gemini (CV) | `VITE_GEMINI_API_KEY` | ✅ Activo | Generación de CV |
| Google Gemini (Chatbot) | `VITE_GEMINI_CHATBOT_API_KEY` | ✅ Activo | MaikoBot |
| OpenAI GPT | `VITE_OPENAI_API_KEY` | ⚠️ Parcial | Chatbot fallback |
| DeepSeek | `DEEPSEEK_API_KEY` (functions config) | ⚠️ Parcial | CV via Cloud Functions |
| EmailJS | `VITE_EMAIL_SERVICE_ID/TEMPLATE_ID/PUBLIC_KEY` | ❌ No configurado | Emails de notificación |
| WhatsApp API | `VITE_WHATSAPP_TOKEN/PHONE_ID` | ❌ No configurado | Chatbot WhatsApp |
| GitHub Assets | Composable `useGitHubAssets` | ⚠️ Parcial | Carga de assets |

---

## 5. Sistema de Autenticación y Seguridad

### Autenticación actual
- **Método:** Firebase Authentication (email/password + anónima)
- **Admins hardcodeados:** `maikostudios@gmail.com`, `m.esteban.saez@gmail.com`, `admin@maikostudios.com`
- **Guard de navegación:** Protege `/admin` verificando auth + email autorizado
- **Auth anónima:** Para chatbot y visitantes generales

### Vulnerabilidades detectadas

> [!CAUTION]
> **Seguridad crítica encontrada:**

| # | Vulnerabilidad | Severidad | Detalle |
|---|---------------|-----------|---------|
| 1 | **API Keys expuestas en el frontend** | 🔴 ALTA | `VITE_OPENAI_API_KEY` y `VITE_GEMINI_API_KEY` se exponen en el bundle del navegador. Cualquiera puede extraerlas con DevTools. |
| 2 | **`dangerouslyAllowBrowser: true`** en OpenAI | 🔴 ALTA | El propio SDK de OpenAI advierte contra esto. Las llamadas a OpenAI deben ir por un backend. |
| 3 | **Contraseña admin débil** | 🟡 MEDIA | Documentada como `123456` en `CONFIGURACION_FIREBASE.md` |
| 4 | **Emails admin hardcodeados** | 🟡 MEDIA | La lista de admins está quemada en código; debería estar en la BD o en claims de JWT |
| 5 | **Función `autenticarAnonimo` duplicada** | 🟠 BAJA | Aparece dos veces en `authService.js`, la segunda sobreescribe la primera |
| 6 | **Firestore rules `allow create: if true`** en varias colecciones | 🟡 MEDIA | Permite spam/flooding sin rate limiting |

---

## 6. Base de Datos — Colecciones Firestore

### Colecciones documentadas en `firestore.rules`:

| Colección | Lectura | Escritura | Datos |
|-----------|---------|-----------|-------|
| `mensajes_contacto` | Solo admin | Pública (create) | Formularios de contacto |
| `solicitudes_cv` | Solo admin | Pública (create) | Solicitudes de CV |
| `cv_solicitudes` | Solo admin | Pública (create) | Colección alternativa de CV |
| `reclutadores_interesados` | Solo admin | Pública (create) | Reclutadores para CV personalizado |
| `proyectos` | Pública | Solo admin | Portafolio de proyectos |
| `plantillas` | Solo admin | Solo admin | Plantillas HTML de CV |
| `perfil_candidato` | Solo admin | Solo admin | Datos del candidato para CV |
| `conversaciones_chatbot` | Pública | Pública (create/update) | Conversaciones del chatbot |
| `visitas` | Solo admin | Pública (create) | Analytics de páginas visitadas |
| `pricing_packs` | Pública | Solo admin | Packs de precios (pago único) |
| `pricing_plans` | Pública | Solo admin | Planes de suscripción |
| `configuracion` | Solo admin | Solo admin | Config del sitio |
| `logs` | Solo admin | Pública (create) | Logs del sistema |

### Colecciones usadas en código pero no en rules:
| Colección | Archivo | Uso |
|-----------|---------|-----|
| `contactMessages` | `services.js` | Mensajes de contacto (duplicada con `mensajes_contacto`) |
| `cvRequests` | `services.js` | Solicitudes CV (duplicada con `solicitudes_cv`) |
| `statsVisits` | `services.js` | Visitas (duplicada con `visitas`) |
| `pricing` | `services.js` | Precios (colección genérica) |
| `cv_generaciones_deepseek` | `functions/index.js` | Log de generaciones con DeepSeek |

> [!WARNING]
> **Hay duplicación de colecciones.** El código apunta a nombres de colección distintos a los documentados en las reglas de Firestore. Esto significa que algunos datos pueden estar escribiéndose en colecciones sin reglas de seguridad.

---

## 7. Fallas y Flujos Rotos Detectados

### 🔴 Críticos (no funcionan)

| # | Falla | Archivo | Impacto |
|---|-------|---------|---------|
| 1 | **Formularios de contacto no envían notificaciones** | `FormularioContacto.vue` | Se guardan en Firestore pero NO llega email ni WhatsApp a Michael. Los datos se pierden en la BD sin aviso. |
| 2 | **EmailJS no configurado** | `.env.example` | Las variables `VITE_EMAIL_*` están vacías. No hay integración funcional de email. |
| 3 | **WhatsApp API no configurado** | `.env.example` | Las variables `VITE_WHATSAPP_*` están vacías. No hay integración de WhatsApp Business. |
| 4 | **CRM inexistente** | — | No hay sistema CRM real. Los leads del chatbot y formularios se guardan en Firestore sin procesamiento ni seguimiento posterior. |
| 5 | **Notificación de leads es un `console.log`** | `gptService.js` L228-252 | La función `notificarLead()` solo hace `console.log`, no envía email/push/WhatsApp real. |
| 6 | **Colecciones duplicadas** | `services.js` vs `firestore.rules` | Los datos se escriben en colecciones sin reglas de seguridad aplicadas. |

### 🟡 Importantes (funcionan parcialmente)

| # | Falla | Archivo | Impacto |
|---|-------|---------|---------|
| 7 | **Estadísticas incompletas** | `services.js` L659-686 | `obtenerEstadisticas()` retorna datos hardcodeados (100, 50, 20) en vez de consultar Firestore realmente. |
| 8 | **Vista de Seguimiento es un placeholder** | `SeguimientoView.vue` | Solo 2KB, sin funcionalidad real de seguimiento de proyectos. |
| 9 | **Portafolio oculto** | `router/index.js` L24-30 | Las rutas `/portafolio` y `/cv` están comentadas. El portafolio no es accesible. |
| 10 | **OpenAI con `dangerouslyAllowBrowser`** | `gptService.js` L12 | Llamadas directas a OpenAI desde el navegador exponiendo la API Key. |
| 11 | **Form Interactivo** | `FormInteractivoView.vue` | Solo 2KB, probablemente un placeholder sin funcionalidad real. |
| 12 | **Panel Admin monolítico** | `AdminView.vue` (53KB) | Un solo archivo de 53KB manejando todo el admin — difícil de mantener. |
| 13 | **Pricing duplicado** | `services.js` + `pricingService.js` | Dos servicios distintos para pricing, posible inconsistencia de datos. |

### 🟠 Mejoras necesarias

| # | Mejora | Detalle |
|---|--------|---------|
| 14 | Sin sistema de backups | Los datos de Firestore no tienen backup automatizado |
| 15 | Sin rate limiting | Formularios y chatbot sin protección contra abuso |
| 16 | Sin logging centralizado | Logs dispersos en `console.log` sin monitoreo |
| 17 | Sin SEO server-side | SPA pura sin SSR ni prerendering |
| 18 | Sin sistema de roles | Solo existe "admin" o "no admin", sin roles granulares |
| 19 | Sin tests E2E funcionales | Cypress configurado pero sin tests escritos |

---

## 8. Arquitectura Propuesta para VPS Contabo

```
┌─────────────────────────────────────────────────────────┐
│                    VPS CONTABO                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Nginx      │  │  Node.js     │  │ PostgreSQL   │  │
│  │ (Reverse     │──│  Backend     │──│  (Base de    │  │
│  │  Proxy +     │  │  (Express/   │  │  Datos       │  │
│  │  SSL/HTTPS)  │  │  Fastify)    │  │  Principal)  │  │
│  └──────────────┘  └──────┬───────┘  └──────────────┘  │
│                           │                             │
│  ┌──────────────┐  ┌──────┴───────┐  ┌──────────────┐  │
│  │   Redis      │  │   PM2        │  │   Docker     │  │
│  │ (Cache +     │  │ (Process     │  │ (Containers  │  │
│  │  Sessions)   │  │  Manager)    │  │  opcional)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Frontend Vue.js (dist/ estático)        │   │
│  │          Servido directamente por Nginx          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────────┐
           │               │                   │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌─────────▼─────────┐
    │  Gemini API │ │ OpenAI API  │ │  SMTP (Email)     │
    └─────────────┘ └─────────────┘ └───────────────────┘
```

### Componentes del Backend propio

| Componente | Tecnología | Responsabilidad |
|-----------|------------|-----------------|
| **API REST** | Node.js + Express/Fastify | Endpoints para contacto, CV, pricing, proyectos, chatbot |
| **ORM** | Prisma o Drizzle | Mapeo objeto-relacional para PostgreSQL |
| **Auth** | JWT + bcrypt (o Passport.js) | Autenticación propia con tokens |
| **Email** | Nodemailer + SMTP | Envío real de emails de notificación |
| **Cache** | Redis | Caché de precios, sesiones, rate limiting |
| **Process Manager** | PM2 | Control del proceso Node.js, auto-restart, logs |
| **Reverse Proxy** | Nginx | SSL, compresión, servir estáticos, proxy al backend |
| **Monitoreo** | PM2 + Logs | Monitoreo de errores y rendimiento |

---

## 9. Decisión de Base de Datos: PostgreSQL vs NoSQL

### Análisis de los datos actuales

| Criterio | PostgreSQL | MongoDB (NoSQL) |
|----------|-----------|-----------------|
| **Datos de contacto/CRM** | ✅ Excelente — Relaciones claras entre leads, mensajes, seguimiento | ⚠️ OK pero pierde integridad referencial |
| **Pricing (packs/planes)** | ✅ Relaciones Pack→Features, Plan→Features | ✅ Documentos anidados funcionan bien |
| **Chatbot conversaciones** | ⚠️ Funcional pero más rígido | ✅ Documentos dinámicos con historial variable |
| **Proyectos portafolio** | ✅ Relaciones con tags, tecnologías, imágenes | ✅ Documentos ricos con arrays |
| **Analytics/Visitas** | ✅ Queries de agregación potentes | ⚠️ Necesita pipelines complejos |
| **CV generaciones** | ⚠️ Datos semi-estructurados | ✅ Documentos con HTML embebido |
| **Escalabilidad** | ✅ Vertical, excelente hasta millones de registros | ✅ Horizontal |
| **Costos VPS** | ✅ 0 — Ya incluido en la VPS | ✅ 0 — También puede correr en la VPS |

### 🏆 Recomendación: **Enfoque Híbrido**

> [!IMPORTANT]
> **PostgreSQL como base de datos principal** + **Redis como caché y sesiones**

**Justificación:**
1. Los datos de MaikoStudios son **mayormente relacionales** (contactos → mensajes → seguimiento, usuarios → roles, packs → features)
2. PostgreSQL ofrece **integridad referencial** que Firestore no tiene — ideal para el CRM
3. Las queries de agregación para **estadísticas y analytics** son mucho más potentes en SQL
4. PostgreSQL con **JSONB** permite almacenar datos semi-estructurados (conversaciones de chatbot, configuraciones) sin perder las ventajas SQL
5. **Un solo motor** es más fácil de mantener, hacer backup y monitorear en la VPS
6. Redis complementa para **cache de precios** (evita queries repetidas) y almacenamiento de **sesiones JWT**

### Esquema de base de datos propuesto

```sql
-- Autenticación y usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user', -- admin, user, editor
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Mensajes de contacto (CRM)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    source VARCHAR(50), -- 'web_form', 'chatbot', 'whatsapp'
    read BOOLEAN DEFAULT FALSE,
    responded BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    responded_at TIMESTAMP,
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Conversaciones del chatbot (JSONB para flexibilidad)
CREATE TABLE chatbot_conversations (
    id SERIAL PRIMARY KEY,
    visitor_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    country VARCHAR(50),
    region_blocked BOOLEAN DEFAULT FALSE,
    strikes_remaining INTEGER DEFAULT 5,
    ai_responses_used INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'active',
    conversation_log JSONB, -- Historial flexible
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Proyectos del portafolio
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    image_url VARCHAR(500),
    demo_url VARCHAR(500),
    github_url VARCHAR(500),
    technologies TEXT[], -- Array de tecnologías
    category VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Packs de precios
CREATE TABLE pricing_packs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200),
    price_monthly INTEGER,
    price_annual INTEGER,
    currency VARCHAR(10) DEFAULT 'CLP',
    features TEXT[],
    active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Planes de suscripción
CREATE TABLE pricing_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200),
    price_monthly INTEGER,
    price_annual INTEGER,
    currency VARCHAR(10) DEFAULT 'CLP',
    features TEXT[],
    active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Solicitudes de CV
CREATE TABLE cv_requests (
    id SERIAL PRIMARY KEY,
    recruiter_name VARCHAR(100),
    company VARCHAR(200),
    position VARCHAR(200),
    required_skills TEXT[],
    job_description TEXT,
    ai_provider VARCHAR(20), -- 'gemini', 'deepseek', 'openai'
    generated_html TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics de visitas
CREATE TABLE page_visits (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100) NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    ip_hash VARCHAR(64), -- Hash del IP para privacidad
    visited_at TIMESTAMP DEFAULT NOW()
);

-- Logs del sistema
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10), -- info, warn, error
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Configuración del sitio
CREATE TABLE site_config (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. Proyección de Mejoras de Rendimiento

### Comparativa Firebase vs VPS Contabo

| Aspecto | Firebase (actual) | VPS Contabo (propuesto) | Mejora |
|---------|-------------------|------------------------|--------|
| **Latencia DB** | ~100-300ms (Firestore desde Chile a US) | ~1-5ms (PostgreSQL local) | **60-300x más rápido** |
| **Llamadas a IA** | Directo desde navegador (expone keys) | Proxy por backend (seguro) | **Seguridad + caching** |
| **Email** | ❌ No funciona | ✅ SMTP directo con Nodemailer | **Funcionalidad nueva** |
| **Costo mensual** | ~$0 (free tier) + $X Contabo sin uso | $X Contabo (todo en uno) | **Consolida costos** |
| **Control de datos** | Google tiene los datos | Tus datos en tu servidor | **100% ownership** |
| **SSL/Custom domain** | Limitado | Nginx + Let's Encrypt | **Flexibilidad total** |
| **Rate limiting** | ❌ No existe | ✅ Express-rate-limit + Redis | **Protección anti-spam** |
| **Backups** | Firestore automáticos | Cron + pg_dump diario | **Control total** |
| **Escalabilidad** | Automática (pero costosa) | Manual (pero suficiente para tráfico actual) | **Adecuada** |

### Qué se mantiene en Firebase (temporal o permanente)
- **Firebase Auth** puede mantenerse temporalmente durante la transición
- **Firebase Hosting** se reemplaza completamente por Nginx en la VPS
- **Cloud Functions** se reemplazan por endpoints del backend propio

---

## 11. Plan de Migración por Fases

### Fase 1: Preparar la VPS (Semana 1-2) `[ ]`
| Tarea | Estado |
|-------|--------|
| Instalar Node.js 20 LTS en la VPS | `[ ]` |
| Instalar PostgreSQL 16 en la VPS | `[ ]` |
| Instalar Redis en la VPS | `[ ]` |
| Configurar Nginx como reverse proxy | `[ ]` |
| Configurar SSL con Let's Encrypt (certbot) | `[ ]` |
| Instalar PM2 para gestión de procesos | `[ ]` |
| Configurar firewall (UFW) y SSH seguro | `[ ]` |

### Fase 2: Backend Node.js desde 0 (Semana 2-4) `[ ]`
| Tarea | Estado |
|-------|--------|
| Inicializar proyecto Node.js con Express/Fastify | `[ ]` |
| Configurar Prisma/Drizzle con PostgreSQL | `[ ]` |
| Crear esquema de base de datos (migrations) | `[ ]` |
| Implementar sistema de autenticación JWT | `[ ]` |
| API endpoints: `/api/auth/*` (login, register, refresh) | `[ ]` |
| API endpoints: `/api/contact/*` (CRUD mensajes) | `[ ]` |
| API endpoints: `/api/pricing/*` (packs, planes) | `[ ]` |
| API endpoints: `/api/projects/*` (portafolio) | `[ ]` |
| API endpoints: `/api/cv/*` (solicitudes, generación) | `[ ]` |
| API endpoints: `/api/chatbot/*` (conversaciones) | `[ ]` |
| API endpoints: `/api/stats/*` (analytics) | `[ ]` |
| Proxy seguro para LLMs (`/api/ai/*`) — Gemini, OpenAI | `[ ]` |
| Integrar Nodemailer para emails reales | `[ ]` |
| Implementar rate limiting y validación de inputs | `[ ]` |
| Configurar CORS para el frontend | `[ ]` |

### Fase 3: Migración de Datos (Semana 4-5) `[ ]`
| Tarea | Estado |
|-------|--------|
| Exportar datos de Firestore (mensajes, proyectos, pricing) | `[ ]` |
| Script de migración Firestore → PostgreSQL | `[ ]` |
| Verificar integridad de datos migrados | `[ ]` |
| Migrar usuarios de Firebase Auth a tabla `users` | `[ ]` |

### Fase 4: Adaptar Frontend (Semana 5-7) `[ ]`
| Tarea | Estado |
|-------|--------|
| Crear servicio `apiClient.js` con Axios apuntando al backend | `[ ]` |
| Reemplazar `firebase/services.js` por llamadas REST | `[ ]` |
| Reemplazar `authService.js` por auth JWT | `[ ]` |
| Reemplazar `chatbotService.js` — llamadas a `/api/chatbot` | `[ ]` |
| Reemplazar `geminiService.js` — llamadas a `/api/ai/gemini` | `[ ]` |
| Reemplazar `gptService.js` — llamadas a `/api/ai/openai` | `[ ]` |
| Reemplazar `pricingService.js` por llamadas REST | `[ ]` |
| Reemplazar `proyectosService.js` por llamadas REST | `[ ]` |
| Actualizar store Pinia para usar nuevos servicios | `[ ]` |
| Actualizar router guards para auth JWT | `[ ]` |

### Fase 5: Arreglar Flujos Rotos (Semana 7-8) `[ ]`
| Tarea | Estado |
|-------|--------|
| ✉️ Emails de notificación reales al recibir contacto | `[ ]` |
| 📊 Dashboard de estadísticas con queries SQL reales | `[ ]` |
| 🤖 CRM básico: listar, filtrar, responder leads | `[ ]` |
| 📱 Notificaciones de leads (email + opcional WhatsApp) | `[ ]` |
| 📋 Vista de seguimiento funcional | `[ ]` |
| 🔐 Roles granulares (admin, editor, viewer) | `[ ]` |
| 🚫 Rate limiting en formularios y chatbot | `[ ]` |
| 📂 Subir portafolio (descomentar ruta, conectar a BD) | `[ ]` |

### Fase 6: Despliegue y Verificación (Semana 8-9) `[ ]`
| Tarea | Estado |
|-------|--------|
| Deploy frontend en Nginx (dist/) | `[ ]` |
| Deploy backend con PM2 | `[ ]` |
| Configurar dominio maikostudios.com → VPS Contabo | `[ ]` |
| Testing E2E completo | `[ ]` |
| Configurar backups automáticos (pg_dump + cron) | `[ ]` |
| Monitoreo de logs y errores | `[ ]` |
| Apagar servicios Firebase (excepto los que se mantengan) | `[ ]` |

---

## 12. Credenciales Necesarias

> [!IMPORTANT]
> Para poder trabajar necesito las siguientes credenciales y accesos. **NUNCA los pegues en archivos de código.** Los configuraremos como variables de entorno en el servidor.

### Acceso a la VPS Contabo
| Dato | Necesito |
|------|----------|
| **IP del servidor** | La dirección IP pública de tu VPS |
| **Puerto SSH** | Puerto de acceso SSH (por defecto 22) |
| **Usuario SSH** | Usuario con acceso sudo |
| **Contraseña SSH o clave pública** | Para conectarme al servidor |
| **Sistema operativo** | Ubuntu, Debian, CentOS, etc. |
| **RAM / CPU / Disco** | Specs para dimensionar correctamente |

### Dominio y DNS
| Dato | Necesito |
|------|----------|
| **Registrador del dominio** | Donde tienes registrado maikostudios.com |
| **Acceso al panel DNS** | Para apuntar el dominio a la VPS |
| **Dominios/subdominios** | ¿Usarás api.maikostudios.com para el backend? |

### APIs de IA (ya las tienes, solo necesito verificar)
| Dato | Necesito |
|------|----------|
| `VITE_GEMINI_API_KEY` | Ya existe en `.env` — se moverá al backend |
| `VITE_GEMINI_CHATBOT_API_KEY` | Ya existe — se moverá al backend |
| `VITE_OPENAI_API_KEY` | Ya existe — se moverá al backend |
| `DEEPSEEK_API_KEY` | Ya existe en functions config |

### Email (para nuevo sistema de notificaciones)
| Dato | Necesito |
|------|----------|
| **Servidor SMTP** | Gmail, Mailgun, SendGrid, o tu propio SMTP |
| **Email remitente** | Ej: `no-reply@maikostudios.com` |
| **Contraseña SMTP o app password** | Para autenticar envío de emails |

### Firebase (para la migración)
| Dato | Necesito |
|------|----------|
| **Service Account JSON** | Para exportar datos de Firestore programáticamente |
| Acceso a la consola Firebase | Para verificar datos durante migración |

---

## 13. Checklist de Tareas

> Marca con `[x]` las tareas completadas y `[/]` las que están en progreso.

### ✅ Completado
- [x] Análisis completo del proyecto actual
- [x] Identificación de tecnologías
- [x] Mapeo de colecciones Firestore
- [x] Identificación de APIs e integraciones
- [x] Auditoría de seguridad
- [x] Detección de flujos rotos
- [x] Propuesta de arquitectura VPS
- [x] Análisis PostgreSQL vs NoSQL
- [x] Esquema de base de datos propuesto
- [x] Plan de migración documentado
- [x] Lista de credenciales necesarias

### ⏳ Pendiente (esperando aprobación)
- [ ] Recibir credenciales de la VPS Contabo
- [ ] Recibir acceso DNS del dominio
- [ ] Recibir configuración SMTP para emails
- [ ] Aprobación del plan de migración
- [ ] Iniciar Fase 1: Preparar la VPS

---

> **📌 Siguiente paso:** Revisar este documento, confirmar o corregir las decisiones de arquitectura, y proporcionar las credenciales listadas en la sección 12. Una vez aprobado, procedemos con la Fase 1.
