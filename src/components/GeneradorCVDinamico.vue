<template>
  <div class="generador-cv-container">
    <!-- Header del componente -->
    <div class="header-section">
      <div class="header-content">
        <v-icon color="secondary" size="48">mdi-account-tie-hat</v-icon>
        <div class="header-text">
          <h1>Generador de CV Dinámico</h1>
          <p>Crea un curriculum personalizado adaptado a tu oferta laboral usando IA</p>
        </div>
      </div>
    </div>

    <v-form ref="formRef" v-model="valid" @submit.prevent="generarCV">
      <!-- Sección 1: Información del Reclutador -->
      <v-card class="form-section" elevation="2">
        <v-card-title class="section-title">
          <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
          Información del Reclutador
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="formulario.nombreReclutador" label="Tu nombre" :rules="[rules.required]"
                variant="outlined" color="primary" prepend-inner-icon="mdi-account" placeholder="Ej: María González" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="formulario.empresa" label="Empresa" :rules="[rules.required]" variant="outlined"
                color="primary" prepend-inner-icon="mdi-office-building" placeholder="Ej: TechCorp S.A." />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="formulario.email" label="Email de contacto" :rules="[rules.required, rules.email]"
                variant="outlined" color="primary" prepend-inner-icon="mdi-email" placeholder="maria@techcorp.com" />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="formulario.posicion" label="Posición a cubrir" :rules="[rules.required]"
                variant="outlined" color="primary" prepend-inner-icon="mdi-briefcase"
                placeholder="Ej: Desarrollador Full Stack Senior" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Sección 2: Selector de Habilidades -->
      <v-card class="form-section" elevation="2">
        <v-card-title class="section-title">
          <v-icon color="secondary" class="mr-2">mdi-star-circle</v-icon>
          Habilidades Requeridas
        </v-card-title>

        <v-card-text>
          <p class="section-description">
            Selecciona las habilidades que buscas en el candidato. Puedes elegir de las opciones predefinidas o agregar
            personalizadas.
          </p>

          <!-- Categorías de habilidades -->
          <div class="skills-categories">
            <!-- Tecnologías -->
            <div class="skill-category">
              <h4 class="category-title">
                <v-icon color="primary" size="20">mdi-code-tags</v-icon>
                Tecnologías
              </h4>
              <div class="skills-grid">
                <v-chip v-for="skill in habilidadesPredefinidas.tecnologias" :key="skill"
                  :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'primary' : 'default'"
                  :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                  class="skill-chip" @click="toggleSkill(skill)">
                  {{ skill }}
                </v-chip>
              </div>
            </div>

            <!-- Frameworks de IA -->
            <div class="skill-category">
              <h4 class="category-title">
                <v-icon color="secondary" size="20">mdi-robot</v-icon>
                Frameworks de IA
              </h4>
              <div class="skills-grid">
                <v-chip v-for="skill in habilidadesPredefinidas.ia" :key="skill"
                  :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'secondary' : 'default'"
                  :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                  class="skill-chip" @click="toggleSkill(skill)">
                  {{ skill }}
                </v-chip>
              </div>
            </div>

            <!-- Diseño -->
            <div class="skill-category">
              <h4 class="category-title">
                <v-icon color="accent" size="20">mdi-palette</v-icon>
                Diseño
              </h4>
              <div class="skills-grid">
                <v-chip v-for="skill in habilidadesPredefinidas.diseno" :key="skill"
                  :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'accent' : 'default'"
                  :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                  class="skill-chip" @click="toggleSkill(skill)">
                  {{ skill }}
                </v-chip>
              </div>
            </div>

            <!-- Metodologías -->
            <div class="skill-category">
              <h4 class="category-title">
                <v-icon color="warning" size="20">mdi-cog</v-icon>
                Metodologías
              </h4>
              <div class="skills-grid">
                <v-chip v-for="skill in habilidadesPredefinidas.metodologias" :key="skill"
                  :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'warning' : 'default'"
                  :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                  class="skill-chip" @click="toggleSkill(skill)">
                  {{ skill }}
                </v-chip>
              </div>
            </div>

            <!-- Servicios Maiko Studios -->
            <div class="skill-category">
              <h4 class="category-title">
                <v-icon color="success" size="20">mdi-briefcase</v-icon>
                Servicios Especializados
              </h4>
              <div class="skills-grid">
                <v-chip v-for="skill in habilidadesPredefinidas.servicios" :key="skill"
                  :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'success' : 'default'"
                  :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                  class="skill-chip" @click="toggleSkill(skill)">
                  {{ skill }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Campo para habilidades personalizadas -->
          <div class="custom-skills-section">
            <v-text-field v-model="nuevaHabilidad" label="Agregar habilidad personalizada" variant="outlined"
              color="primary" prepend-inner-icon="mdi-plus-circle" placeholder="Ej: Docker, Kubernetes, etc."
              @keyup.enter="agregarHabilidadPersonalizada">
              <template #append-inner>
                <v-btn icon="mdi-plus" size="small" color="primary" variant="text"
                  @click="agregarHabilidadPersonalizada" />
              </template>
            </v-text-field>
          </div>

          <!-- Habilidades seleccionadas -->
          <div v-if="formulario.habilidadesSeleccionadas.length > 0" class="selected-skills">
            <h4 class="selected-title">Habilidades Seleccionadas ({{ formulario.habilidadesSeleccionadas.length }})</h4>
            <div class="selected-chips">
              <v-chip v-for="skill in formulario.habilidadesSeleccionadas" :key="skill" color="primary" variant="flat"
                closable class="selected-chip" @click:close="removeSkill(skill)">
                {{ skill }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Sección 3: Descripción del Cargo -->
      <v-card class="form-section" elevation="2">
        <v-card-title class="section-title">
          <v-icon color="info" class="mr-2">mdi-text-box</v-icon>
          Descripción del Cargo
        </v-card-title>

        <v-card-text>
          <p class="section-description">
            Pega o redacta la descripción completa de la oferta laboral. Mientras más detallada sea, mejor será la
            personalización del CV.
          </p>

          <v-textarea v-model="formulario.descripcionCargo" label="Descripción de la oferta laboral"
            :rules="[rules.required, rules.minLength]" variant="outlined" color="primary" rows="6" counter="2000"
            maxlength="2000" prepend-inner-icon="mdi-file-document-edit"
            placeholder="Ejemplo: Buscamos desarrollador frontend experto en Vue y Firebase. Ideal experiencia en IA generativa, APIs de OpenAI y herramientas de prototipado como Figma..." />
        </v-card-text>
      </v-card>

      <!-- Botón de generación -->
      <div class="action-section">
        <v-btn type="submit" color="secondary" size="x-large" :loading="generando"
          :disabled="!valid || formulario.habilidadesSeleccionadas.length === 0" class="generate-btn">
          <v-icon left size="24">mdi-magic-staff</v-icon>
          Generar CV Personalizado
        </v-btn>

        <p class="action-description">
          El proceso toma aproximadamente 30-60 segundos
        </p>
      </div>
    </v-form>

    <!-- Vista previa del CV generado -->
    <div v-if="mostrandoPreview" class="cv-preview-section">
      <v-card class="cv-preview-card" elevation="8">
        <v-card-title class="preview-title">
          <v-icon color="success" size="32">mdi-file-document-check</v-icon>
          Vista Previa del CV Personalizado
        </v-card-title>

        <v-card-text>
          <div id="cv-container" class="cv-container"></div>

          <div class="preview-actions">
            <v-btn color="primary" size="large" @click="descargarCV" class="download-btn">
              <v-icon left>mdi-download</v-icon>
              Descargar CV como PDF
            </v-btn>
            <v-btn color="secondary" variant="outlined" @click="generarOtroCV">
              <v-icon left>mdi-refresh</v-icon>
              Generar Otro CV
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Estado de generación -->
    <v-dialog v-model="mostrarEstadoGeneracion" persistent max-width="500">
      <v-card class="generation-dialog">
        <v-card-text class="text-center pa-6">
          <v-progress-circular indeterminate color="secondary" size="64" width="6" class="mb-4" />
          <h3 class="mb-2">Generando CV Personalizado</h3>
          <p class="mb-0">{{ estadoActual }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Resultado exitoso -->
    <v-dialog v-model="mostrarResultado" max-width="600">
      <v-card class="result-dialog">
        <v-card-title class="success-title">
          <v-icon color="success" size="32" class="mr-2">mdi-check-circle</v-icon>
          ¡CV Generado Correctamente!
        </v-card-title>

        <v-card-text class="text-center">
          <p class="mb-4">Tu CV personalizado ha sido generado exitosamente.</p>

          <v-btn color="success" size="large" :href="urlDescarga" target="_blank" class="download-btn">
            <v-icon left>mdi-download</v-icon>
            Descargar CV en PDF
          </v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cerrarResultado">
            Cerrar
          </v-btn>
          <v-btn color="primary" @click="generarOtroCV">
            Generar Otro CV
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCVGenerator } from '@/composables/useCVGenerator'

const {
  generando,
  mostrandoPreview,
  estadoActual,
  progreso,
  generarCVPersonalizado,
  descargarCVPDF,
  limpiarEstado,
  ocultarPreview
} = useCVGenerator()

// Estado del formulario
const formRef = ref(null)
const valid = ref(false)
const mostrarEstadoGeneracion = ref(false)
const mostrarResultado = ref(false)
const nuevaHabilidad = ref('')

// Datos del formulario
const formulario = reactive({
  nombreReclutador: '',
  empresa: '',
  email: '',
  posicion: '',
  habilidadesSeleccionadas: [],
  descripcionCargo: ''
})

// Habilidades predefinidas organizadas por categorías
const habilidadesPredefinidas = {
  tecnologias: [
    'HTML', 'CSS', 'JavaScript', 'Vue.js', 'React', 'Angular',
    'Node.js', 'Python', 'Java', 'Spring Boot', 'Express.js',
    'TypeScript', 'PHP', 'Laravel', 'Django', 'Flask',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'
  ],
  ia: [
    'LangChain', 'Genkit', 'Prompt Engineering', 'OpenAI API',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Hugging Face',
    'Computer Vision', 'NLP', 'GPT Integration', 'AI Automation'
  ],
  diseno: [
    'Figma', 'Adobe XD', 'Canva', 'Photoshop', 'Illustrator',
    'Sketch', 'InVision', 'Principle', 'Framer', 'UI/UX Design'
  ],
  metodologias: [
    'Scrum', 'Kanban', 'Agile', 'DevOps', 'CI/CD', 'Git',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud'
  ],
  servicios: [
    'Formateo de equipos', 'Cursos de Computación', 'Asesoría Pymes',
    'Desarrollo Web', 'Automatizaciones IA', 'Creación de empresas',
    'Ventas de equipos y seguridad', 'Consultoría tecnológica',
    'Mentorías técnicas', 'Transformación digital'
  ]
}

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es obligatorio',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Ingresa un email válido'
  },
  minLength: value => value.length >= 50 || 'La descripción debe tener al menos 50 caracteres'
}

// Computed para verificar si el formulario está completo
const formularioCompleto = computed(() => {
  return valid.value &&
    formulario.habilidadesSeleccionadas.length > 0 &&
    formulario.descripcionCargo.length >= 50
})

// Funciones para manejar habilidades
const toggleSkill = (skill) => {
  const index = formulario.habilidadesSeleccionadas.indexOf(skill)
  if (index > -1) {
    formulario.habilidadesSeleccionadas.splice(index, 1)
  } else {
    formulario.habilidadesSeleccionadas.push(skill)
  }
}

const removeSkill = (skill) => {
  const index = formulario.habilidadesSeleccionadas.indexOf(skill)
  if (index > -1) {
    formulario.habilidadesSeleccionadas.splice(index, 1)
  }
}

const agregarHabilidadPersonalizada = () => {
  if (nuevaHabilidad.value.trim() && !formulario.habilidadesSeleccionadas.includes(nuevaHabilidad.value.trim())) {
    formulario.habilidadesSeleccionadas.push(nuevaHabilidad.value.trim())
    nuevaHabilidad.value = ''
  }
}

// Función principal para generar CV
const generarCV = async () => {
  if (!formularioCompleto.value) return

  mostrarEstadoGeneracion.value = true

  try {
    // Usar el composable unificado para generar CV
    const resultado = await generarCVPersonalizado(formulario, 'dinamico')

    if (resultado.success) {
      mostrarEstadoGeneracion.value = false
      mostrarResultado.value = true

      // Emitir evento para componentes padre
      emit('cv-generado', {
        id: resultado.id,
        html: resultado.html,
        nombreArchivo: resultado.nombreArchivo,
        fallback: resultado.fallback
      })
    } else {
      throw new Error(resultado.error || 'Error al generar CV')
    }

  } catch (error) {
    console.error('Error al generar CV:', error)
    mostrarEstadoGeneracion.value = false
    alert('Error al generar el CV. Inténtalo de nuevo.')
  }
}

// Funciones para manejar dialogs
const cerrarResultado = () => {
  mostrarResultado.value = false
  ocultarPreview()
}

const generarOtroCV = () => {
  mostrarResultado.value = false
  limpiarFormulario()
  limpiarEstado()
}

const limpiarFormulario = () => {
  Object.keys(formulario).forEach(key => {
    if (Array.isArray(formulario[key])) {
      formulario[key] = []
    } else {
      formulario[key] = ''
    }
  })
  formRef.value?.resetValidation()
}

// Función para descargar CV como PDF
const descargarCV = async () => {
  const nombreArchivo = `CV_${formulario.posicion.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  const resultado = await descargarCVPDF(nombreArchivo)

  if (!resultado.success) {
    alert('Error al descargar el CV. Inténtalo de nuevo.')
  }
}

// Emits para comunicación con componente padre
const emit = defineEmits(['cv-generado'])
</script>

<style scoped>
.generador-cv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-background);
  min-height: 100vh;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(0, 204, 204, 0.1));
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-text p {
  font-size: 1.1rem;
  color: #cccccc;
  margin: 0;
}

/* Form Sections */
.form-section {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
}

.section-title {
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: var(--color-text) !important;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
  display: flex;
  align-items: center;
}

.section-description {
  color: #cccccc;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Skills Categories */
.skills-categories {
  margin-bottom: 2rem;
}

.skill-category {
  margin-bottom: 2rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-chip {
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.skill-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

/* Custom Skills */
.custom-skills-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 102, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(0, 102, 255, 0.2);
}

/* Selected Skills */
.selected-skills {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(0, 204, 204, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(0, 204, 204, 0.2);
}

.selected-title {
  color: var(--color-secondary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-chip {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* CV Preview Section */
.cv-preview-section {
  margin: 3rem 0;
}

.cv-preview-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(0, 204, 204, 0.3) !important;
  border-radius: 16px !important;
}

.preview-title {
  color: var(--color-text) !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem !important;
}

.cv-container {
  background: white;
  border-radius: 8px;
  margin: 1rem 0;
  min-height: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

/* Action Section */
.action-section {
  text-align: center;
  margin: 3rem 0;
  padding: 2rem;
}

.generate-btn {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 1rem 3rem !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 25px rgba(0, 204, 204, 0.3) !important;
  transition: all 0.3s ease !important;
}

.generate-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 12px 35px rgba(0, 204, 204, 0.4) !important;
}

.action-description {
  color: #cccccc;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-style: italic;
}

/* Dialogs */
.generation-dialog {
  background: rgba(26, 26, 26, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.result-dialog {
  background: rgba(26, 26, 26, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.success-title {
  color: var(--color-text) !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.download-btn {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 1rem 2rem !important;
  border-radius: 50px !important;
  margin: 1rem 0 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .generador-cv-container {
    padding: 1rem;
  }

  .header-text h1 {
    font-size: 2rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .skills-grid {
    gap: 0.5rem;
  }

  .skill-chip {
    font-size: 0.85rem;
  }

  .generate-btn {
    width: 100% !important;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .header-text h1 {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.1rem !important;
  }

  .category-title {
    font-size: 1rem;
  }
}

/* Vuetify Overrides */
:deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(.v-field--focused) {
  border-color: var(--color-primary) !important;
}

:deep(.v-label) {
  color: #cccccc !important;
}

:deep(.v-field__input) {
  color: var(--color-text) !important;
}

:deep(.v-card) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.v-card-title) {
  color: var(--color-text) !important;
}

:deep(.v-card-text) {
  color: #cccccc !important;
}

:deep(.v-chip) {
  font-weight: 500 !important;
}

:deep(.v-progress-circular) {
  margin: 1rem auto !important;
}
</style>
