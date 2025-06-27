# 🚀 Guía de Deployment - MaikoStudios Web

## 📋 Configuración Actual

### 🏗️ Estructura de Proyectos Firebase

#### **🔴 PRODUCCIÓN** - `maikostudios-a9162`
- **URL:** https://maikostudios-a9162.web.app
- **Proyecto ID:** `maikostudios-a9162`
- **Configuración:** Datos reales de producción
- **Deploy desde:** Rama `main` (configurado en `.firebaserc`)

#### **🟡 DESARROLLO** - `maikostudios-dev`
- **URL:** https://maikostudios-dev.web.app
- **Proyecto ID:** `maikostudios-dev`
- **Configuración:** Datos de testing y desarrollo
- **Variables de entorno actuales:** Configuradas en `.env`

### 🔧 Configuración Actual del Repositorio

```bash
# Rama activa para deploy
.firebaserc -> "default": "maikostudios-a9162" (PRODUCCIÓN)

# Variables de entorno activas
.env -> maikostudios-dev (DESARROLLO)

# Rama de trabajo actual
git branch -> BETA
```

## ⚠️ PROBLEMA IDENTIFICADO

**INCONSISTENCIA:** El proyecto está configurado para hacer deploy a **PRODUCCIÓN** (`maikostudios-a9162`) pero usando variables de entorno de **DESARROLLO** (`maikostudios-dev`).

## 🎯 SOLUCIÓN PROPUESTA

### 📝 Plan de Sincronización

1. **Sincronizar datos de DEV → PROD**
2. **Configurar variables de entorno para producción**
3. **Establecer workflow de deployment**
4. **Documentar proceso para futuros deploys**

## 🔄 Workflow de Deployment

### 🚀 Para Deploy a Producción

```bash
# 1. Cambiar a rama main
git checkout main

# 2. Merge desde BETA (o rama de desarrollo)
git merge BETA

# 3. Configurar variables de entorno para producción
cp .env.production .env

# 4. Build para producción
npm run build

# 5. Deploy a Firebase Hosting
firebase deploy --project maikostudios-a9162

# 6. Verificar deployment
# URL: https://maikostudios-a9162.web.app
```

### 🧪 Para Deploy a Desarrollo

```bash
# 1. Cambiar a rama develop
git checkout develop

# 2. Merge desde rama de feature
git merge BETA

# 3. Configurar variables de entorno para desarrollo
cp .env.development .env

# 4. Build para desarrollo
npm run build

# 5. Deploy a Firebase Hosting
firebase deploy --project maikostudios-dev

# 6. Verificar deployment
# URL: https://maikostudios-dev.web.app
```

## 📁 Estructura de Variables de Entorno

### `.env.production` (Para producción)
```env
# Firebase Configuration - Proyecto de Producción
VITE_FIREBASE_API_KEY=AIzaSyBqK3gpZUzjUYulGE6yu6GwGyRavUFOKAo
VITE_FIREBASE_AUTH_DOMAIN=maikostudios-a9162.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=maikostudios-a9162
VITE_FIREBASE_STORAGE_BUCKET=maikostudios-a9162.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=798896348759
VITE_FIREBASE_APP_ID=1:798896348759:web:a4c6bf6911bc107aa38d12
```

### `.env.development` (Para desarrollo)
```env
# Firebase Configuration - Proyecto de Desarrollo
VITE_FIREBASE_API_KEY=AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok
VITE_FIREBASE_AUTH_DOMAIN=maikostudios-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=maikostudios-dev
VITE_FIREBASE_STORAGE_BUCKET=maikostudios-dev.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1084750960472
VITE_FIREBASE_APP_ID=1:1084750960472:web:ec847ab51570bb7ec6372d
```

## 🗃️ Sincronización de Datos

### 📊 Colecciones a Sincronizar

1. **`proyectos`** - Portfolio de proyectos
2. **`mensajes_contacto`** - Mensajes del formulario de contacto
3. **`reclutadores_interesados`** - Solicitudes de CV
4. **`cv_solicitudes`** - Historial de generación de CVs
5. **`plantillas`** - Templates de CV
6. **`perfil_candidato`** - Datos del perfil profesional
7. **`conversaciones_chatbot`** - Historial del chatbot

### 🔧 Scripts de Sincronización

Se crearán scripts automatizados para:
- Exportar datos desde desarrollo
- Importar datos a producción
- Verificar integridad de datos
- Backup antes de sincronización

## 📋 Checklist Pre-Deploy

### ✅ Antes de cada Deploy a Producción

- [ ] Verificar que todas las funcionalidades funcionen en desarrollo
- [ ] Ejecutar tests (si existen)
- [ ] Sincronizar datos de desarrollo a producción
- [ ] Configurar variables de entorno correctas
- [ ] Verificar que no hay API keys de desarrollo en producción
- [ ] Hacer backup de datos de producción
- [ ] Verificar que el build se genera correctamente
- [ ] Probar en entorno local con configuración de producción

### ✅ Después del Deploy

- [ ] Verificar que el sitio carga correctamente
- [ ] Probar funcionalidades críticas (contacto, CV, chatbot)
- [ ] Verificar que los datos se muestran correctamente
- [ ] Comprobar que no hay errores en la consola
- [ ] Verificar métricas de rendimiento
- [ ] Notificar al equipo sobre el deploy exitoso

## 🚨 Rollback Plan

En caso de problemas en producción:

```bash
# 1. Revertir a versión anterior
git checkout main
git reset --hard HEAD~1

# 2. Re-deploy versión estable
npm run build
firebase deploy --project maikostudios-a9162

# 3. Verificar funcionamiento
# 4. Investigar y corregir problemas en rama de desarrollo
```

## 📞 Contactos y Referencias

- **Repositorio:** https://github.com/maikostudios/maikostudiosWEB
- **Firebase Console Prod:** https://console.firebase.google.com/project/maikostudios-a9162
- **Firebase Console Dev:** https://console.firebase.google.com/project/maikostudios-dev
- **Documentación Firebase:** https://firebase.google.com/docs/hosting

---

**Última actualización:** 2025-06-27  
**Versión:** 1.0  
**Autor:** MaikoStudios Development Team
