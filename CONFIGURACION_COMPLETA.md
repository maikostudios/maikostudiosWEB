# 🚀 Configuración Completa - MaikoStudios Web

## 📋 Resumen del Sistema

El proyecto MaikoStudios Web incluye un **sistema completo de generación de CVs con IA** que permite:

- ✅ Generación automática de CVs personalizados usando OpenAI GPT-4
- ✅ Vista previa en tiempo real del CV generado
- ✅ Descarga automática como PDF con formato profesional
- ✅ Registro y tracking de reclutadores en Firebase
- ✅ Sistema de fallback cuando las APIs no están disponibles
- ✅ Interfaz responsive y moderna con Vuetify

## 🔧 Configuración Paso a Paso

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
cp .env.example .env
```

### 2. Firebase (Obligatorio para tracking)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Firestore Database
4. Habilita Authentication (Email/Password)
5. Copia las credenciales a tu archivo `.env`:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 3. OpenAI (Obligatorio para generación con IA)

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una API Key
3. Agrega la clave a tu archivo `.env`:

```env
VITE_OPENAI_API_KEY=sk-tu_clave_openai_aqui
```

### 4. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🎯 Funcionalidades Principales

### Generador de CV Dinámico

**Ubicación:** `/cv`

- Formulario intuitivo para datos del reclutador
- Selector de habilidades técnicas
- Descripción del puesto
- Generación automática con IA
- Vista previa instantánea
- Descarga PDF profesional

### Componentes Principales

1. **`useCVGenerator.js`** - Composable unificado para generación
2. **`cvGeneratorService.js`** - Servicio de integración con OpenAI
3. **`GeneradorCVDinamico.vue`** - Interfaz principal del generador
4. **`initializeCollections.js`** - Configuración automática de Firebase

## 🔄 Flujo de Generación

1. **Usuario completa formulario** → Datos del reclutador y requisitos
2. **Sistema registra en Firebase** → Tracking para análisis
3. **Llamada a MaikoCV Agent** → Personalización con GPT-4
4. **Renderizado en tiempo real** → Vista previa del CV
5. **Conversión a PDF** → Descarga automática con html2pdf.js

## 🛡️ Modo Fallback

Si las APIs no están disponibles:
- ✅ Sistema genera CV básico pero profesional
- ✅ Mantiene toda la funcionalidad de descarga
- ✅ Registra la solicitud para seguimiento
- ✅ Notifica al usuario del modo fallback

## 📱 Responsive Design

- ✅ Mobile-first design
- ✅ Optimizado para tablets y desktop
- ✅ Componentes Vuetify configurados
- ✅ Tema personalizado azul/turquesa

## 🔐 Seguridad

- ✅ Variables de entorno para todas las claves
- ✅ Validación de configuración en tiempo real
- ✅ Manejo seguro de errores de API
- ✅ Sin claves hardcodeadas en el código

## 🚀 Despliegue

### Desarrollo
```bash
npm run deploy:dev
```

### Producción
```bash
npm run deploy:prod
```

## 📊 Tracking y Analytics

El sistema registra automáticamente:
- Solicitudes de CV por empresa
- Habilidades más demandadas
- Tasa de éxito de generación
- Métricas de uso por fecha

## 🆘 Solución de Problemas

### Error: "Failed to resolve component: v-icon"
- **Solución:** Vuetify está configurado correctamente, reinicia el servidor

### Error: "Firebase not configured"
- **Solución:** Verifica las variables de entorno de Firebase

### Error: "OpenAI API failed"
- **Solución:** Verifica tu API Key y créditos disponibles

### PDF no se genera
- **Solución:** html2pdf.js está incluido, verifica la consola del navegador

## 📞 Soporte

Para problemas técnicos:
- Email: maikostudios@gmail.com
- GitHub: @maikostudios

---

**¡El sistema está completamente funcional y listo para usar!** 🎉
