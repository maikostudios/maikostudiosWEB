# 🎯 Configuración del Generador de CVs con MaikoCV Agent

## 📋 Resumen del Sistema

El sistema de generación de CVs está completamente integrado y funcional con las siguientes características:

### ✅ Funcionalidades Implementadas

1. **🔄 Sistema Unificado**: Ambas interfaces (formulario completo y modal) usan la misma lógica de generación
2. **🤖 Integración MaikoCV Agent**: Conectado con GPT-4 para generar CVs personalizados
3. **📄 Generación PDF**: Conversión automática de HTML a PDF con `html2pdf.js`
4. **👁️ Vista Previa**: Renderizado en tiempo real del CV generado
5. **💾 Registro Completo**: Toda información del reclutador se guarda en Firebase
6. **📊 Seguimiento**: Sistema de tracking para análisis y follow-up

---

## 🛠️ Configuración Paso a Paso

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
# MaikoCV Agent Configuration
VITE_MAIKO_CV_AGENT_URL=https://api.openai.com/v1/chat/completions
VITE_OPENAI_API_KEY=tu_openai_api_key_aqui

# Firebase ya está configurado para desarrollo
VITE_FIREBASE_PROJECT_ID=maikostudios-dev
```

### 2. Obtener Clave de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una nueva API Key
3. Asegúrate de tener créditos disponibles
4. Agrega la clave a tu archivo `.env`

### 3. Configuración de Firebase

Las colecciones se crean automáticamente:

- `solicitudes_cv`: Solicitudes de CV generales
- `reclutadores_interesados`: Información detallada de reclutadores
- `visitas`: Estadísticas de uso

---

## 🎨 Personalización del Agente MaikoCV

### Prompt del Sistema

El agente está configurado con información específica de Michael Sáez:

```javascript
// En src/services/cvGeneratorService.js
const systemPrompt = `
Eres MaikoCV, especializado en generar CVs para Michael Esteban Sáez Contreras.

INFORMACIÓN DEL CANDIDATO:
- Desarrollador Full Stack con 5+ años de experiencia
- Especialista en Vue.js, React, Node.js, Python, Java
- Experiencia en Firebase, PostgreSQL, MongoDB
- Mentor tecnológico y facilitador
- Ubicación: Chile
`;
```

### Personalizar para Otro Candidato

Para adaptar el sistema a otro candidato:

1. Edita `src/services/cvGeneratorService.js`
2. Modifica la información del candidato en el prompt del sistema
3. Actualiza el CV fallback con los datos correctos
4. Cambia las imágenes y datos de contacto

---

## 🔧 Uso del Sistema

### Formulario Completo (`/cv-generator`)

```javascript
// Datos que se envían al agente
{
  nombreReclutador: "María González",
  empresa: "TechCorp",
  email: "maria@techcorp.com",
  posicion: "Desarrollador Senior",
  habilidadesSeleccionadas: ["Vue.js", "Node.js", "PostgreSQL"],
  descripcionCargo: "Descripción detallada del puesto..."
}
```

### Modal Compacto (`/cv`)

```javascript
// Datos del formulario modal
{
  nombreReclutador: "Juan Pérez",
  empresa: "StartupXYZ",
  tecnologias: ["React", "Python", "MongoDB"],
  experienciaRequerida: "3-5 años",
  modalidad: "Remoto"
}
```

### Flujo de Generación

1. **Registro del Reclutador** → Firebase `reclutadores_interesados`
2. **Llamada a MaikoCV Agent** → OpenAI GPT-4
3. **Generación HTML** → CV personalizado
4. **Vista Previa** → Renderizado en `#cv-container`
5. **Descarga PDF** → Conversión con `html2pdf.js`
6. **Actualización Estado** → Tracking en Firebase

---

## 📊 Monitoreo y Analytics

### Datos Registrados por Reclutador

```javascript
{
  nombre: "María González",
  empresa: "TechCorp",
  email: "maria@techcorp.com",
  posicion: "Desarrollador Senior",
  fechaRegistro: "2024-01-15T10:30:00Z",
  cvGenerado: true,
  nombreArchivoCV: "cv-techcorp-1705312200000.pdf",
  habilidadesSeleccionadas: ["Vue.js", "Node.js"],
  seguimientoRealizado: false
}
```

### Acceso a Datos (Admin)

```javascript
// En el panel de administración
const reclutadores = await store.cargarSolicitudesCV();
// Filtrar por empresa, fecha, tecnologías, etc.
```

---

## 🚀 Funcionalidades Avanzadas

### 1. CV Fallback

Si falla la API de OpenAI, se genera un CV básico automáticamente.

### 2. Configuración PDF

```javascript
const pdfOptions = {
  margin: 0.5,
  format: "letter",
  scale: 2,
  quality: 0.98,
};
```

### 3. Validaciones

- Email válido
- Descripción mínima de 50 caracteres
- Al menos una habilidad seleccionada
- Campos obligatorios completados

---

## 🔍 Troubleshooting

### Error: "API Key no válida"

- Verifica que `VITE_OPENAI_API_KEY` esté configurada
- Confirma que la clave tenga créditos disponibles

### Error: "Firebase no configurado"

- El sistema funciona en modo demo sin Firebase
- Para funcionalidad completa, configura las variables de Firebase

### Error: "No se genera PDF"

- Verifica que `html2pdf.js` esté instalado
- Revisa la consola del navegador para errores

### CV no se personaliza

- Confirma que el prompt del sistema sea correcto
- Verifica que los datos del formulario lleguen al agente

---

## 📈 Próximos Pasos

1. **Integración n8n**: Automatización de follow-up con reclutadores
2. **Templates Múltiples**: Diferentes diseños de CV según el puesto
3. **Analytics Avanzados**: Dashboard con métricas de conversión
4. **Email Automation**: Envío automático de CVs por email
5. **A/B Testing**: Diferentes versiones del formulario

---

## 🎯 Resultado Final

✅ **Sistema Completamente Funcional**

- Ambas interfaces conectadas al mismo flujo
- Generación real de CVs con IA
- Vista previa y descarga PDF
- Registro completo de reclutadores
- Tracking para seguimiento

El sistema está listo para producción y puede manejar múltiples solicitudes simultáneas de generación de CVs personalizados.
