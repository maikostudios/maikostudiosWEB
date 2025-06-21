# 🔥 **CONFIGURACIÓN FIREBASE - MAIKOSTUDIOS**

## 📋 **Proyectos Firebase Configurados**

### **🔧 Desarrollo: `maikostudios-dev`**

- **Propósito**: Testing, desarrollo y pruebas
- **URL**: https://maikostudios-dev.firebaseapp.com/
- **Estado**: ✅ Configurado y funcionando

### **🚀 Producción: `maikostudios`**

- **Propósito**: Sitio web principal en vivo
- **URL**: https://maikostudios.firebaseapp.com/
- **Estado**: ⏳ Pendiente de configuración

---

## ⚙️ **Configuración Actual (Desarrollo)**

### **Variables de Entorno (.env)**

```env
# Firebase Configuration - Proyecto de Desarrollo
VITE_FIREBASE_API_KEY=AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok
VITE_FIREBASE_AUTH_DOMAIN=maikostudios-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=maikostudios-dev
VITE_FIREBASE_STORAGE_BUCKET=maikostudios-dev.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1084750960472
VITE_FIREBASE_APP_ID=1:1084750960472:web:ec847ab51570bb7ec6372d
```

### **Servicios Habilitados**

- ✅ **Firestore Database**: Para mensajes de contacto, solicitudes CV, estadísticas
- ✅ **Authentication**: Para panel de administración
- ✅ **Hosting**: Para despliegue de la aplicación
- ✅ **Storage**: Para archivos y PDFs generados

---

## 🔄 **Cambio entre Entornos**

### **Para Desarrollo**

```bash
# Usar archivo .env (ya configurado)
npm run dev
```

### **Para Producción**

```bash
# Copiar configuración de producción
cp .env.production .env

# Construir y desplegar
npm run build
firebase deploy --project maikostudios
```

---

## 📊 **Estructura de Datos en Firestore**

### **Colección: `mensajes_contacto`**

```javascript
{
  id: "auto-generated",
  nombre: "string",
  email: "string",
  telefono: "string | null",
  empresa: "string | null",
  asunto: "string",
  origen: "string | null",
  mensaje: "string",
  fechaCreacion: "timestamp",
  leido: "boolean",
  respondido: "boolean"
}
```

### **Colección: `solicitudes_cv`**

```javascript
{
  id: "auto-generated",
  nombreReclutador: "string",
  empresa: "string",
  posicion: "string",
  tecnologias: "string",
  descripcionPuesto: "string",
  fechaCreacion: "timestamp",
  procesado: "boolean"
}
```

### **Colección: `visitas`**

```javascript
{
  id: "auto-generated",
  pagina: "string",
  timestamp: "timestamp",
  userAgent: "string",
  referrer: "string"
}
```

---

## 🔐 **Reglas de Seguridad Recomendadas**

### **Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Mensajes de contacto - solo escritura pública, lectura autenticada
    match /mensajes_contacto/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null &&
        request.auth.token.email in ['m.esteban.saez@gmail.com'];
    }

    // Solicitudes de CV - solo escritura pública, lectura autenticada
    match /solicitudes_cv/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null &&
        request.auth.token.email in ['m.esteban.saez@gmail.com'];
    }

    // Visitas - solo escritura
    match /visitas/{document} {
      allow create: if true;
      allow read: if request.auth != null &&
        request.auth.token.email in ['m.esteban.saez@gmail.com'];
    }
  }
}
```

---

## 🚀 **Comandos de Despliegue**

### **Desarrollo Local**

```bash
npm run dev
# Servidor: http://localhost:5173/
```

### **Despliegue a Firebase Hosting**

```bash
# Construir para producción
npm run build

# Desplegar a desarrollo
firebase deploy --project maikostudios-dev

# Desplegar a producción (cuando esté configurado)
firebase deploy --project maikostudios
```

---

## 🔐 **CONFIGURACIÓN DE AUTHENTICATION**

### **Usuario Administrador Configurado**

- **Email**: `maikostudios@gmail.com`
- **Contraseña**: `123456`
- **Propósito**: Testing y administración del panel

### **Emails Autorizados**

```javascript
const ADMIN_EMAILS = [
  "maikostudios@gmail.com", // Usuario principal de testing
  "m.esteban.saez@gmail.com", // Email personal de Michael
  "admin@maikostudios.com", // Email administrativo
];
```

### **Funcionalidades de Auth Implementadas**

- ✅ **Login con Firebase Auth**: Autenticación real
- ✅ **Modo Fallback**: Funciona sin Firebase configurado
- ✅ **Verificación de Permisos**: Solo emails autorizados
- ✅ **Manejo de Errores**: Mensajes amigables
- ✅ **Persistencia de Sesión**: LocalStorage + Firebase
- ✅ **Guard de Navegación**: Protección de rutas admin

---

## 📞 **Estado Actual**

1. **✅ Completado**: Configuración de proyecto de desarrollo
2. **✅ Completado**: Configurar Authentication en maikostudios-dev
3. **✅ Completado**: Crear usuario administrador (maikostudios@gmail.com)
4. **✅ Completado**: Configurar reglas de seguridad
5. **⏳ Pendiente**: Configurar Firestore Database en maikostudios-dev
6. **⏳ Pendiente**: Configurar proyecto de producción

---

## 🔧 **Comandos Útiles**

```bash
# Ver proyectos Firebase disponibles
firebase projects:list

# Cambiar proyecto activo
firebase use maikostudios-dev
firebase use maikostudios

# Ver configuración actual
firebase projects:list

# Desplegar solo reglas de Firestore
firebase deploy --only firestore:rules

# Ver logs en tiempo real
firebase functions:log --follow
```
