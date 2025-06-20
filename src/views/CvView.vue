<template>
    <BaseLayout>
        <section class="cv-page">
            <v-container>
                <!-- Opciones de descarga -->
                <div class="cv-options">
                    <h1 class="page-title">Currículum Vitae</h1>
                    <p class="page-subtitle">Elige la opción que mejor se adapte a tus necesidades</p>

                    <div class="download-options">
                        <v-card class="option-card" elevation="2">
                            <v-card-title>
                                <v-icon color="primary" size="32">mdi-download</v-icon>
                                CV Genérico
                            </v-card-title>
                            <v-card-text>
                                Descarga mi CV estándar con toda mi experiencia y habilidades.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" block @click="descargarCVGenerico">
                                    <v-icon left>mdi-file-pdf-box</v-icon>
                                    Descargar CV
                                </v-btn>
                                <v-btn variant="outlined" block @click="imprimirCV" class="mt-2">
                                    <v-icon left>mdi-printer</v-icon>
                                    Imprimir CV
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                        <v-card class="option-card" elevation="2">
                            <v-card-title>
                                <v-icon color="secondary" size="32">mdi-account-tie</v-icon>
                                CV Personalizado
                            </v-card-title>
                            <v-card-text>
                                Obtén un CV adaptado específicamente a tu oferta laboral usando IA.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="secondary" block @click="toggleFormularioIntegrado">
                                    <v-icon left>mdi-form-select</v-icon>
                                    {{ mostrarFormularioIntegrado ? 'Ocultar Formulario' : 'Personalizar CV' }}
                                </v-btn>
                                <v-btn variant="outlined" block @click="generarCVDinamico" :disabled="!formularioCompleto" class="mt-2">
                                    <v-icon left>mdi-magic-staff</v-icon>
                                    Generar CV Personalizado
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                        <v-card class="option-card" elevation="2">
                            <v-card-title>
                                <v-icon color="purple" size="32">mdi-robot-excited</v-icon>
                                CV con DeepSeek AI
                                <v-chip color="purple" size="small" class="ml-2">NUEVO</v-chip>
                            </v-card-title>
                            <v-card-text>
                                Genera tu CV usando DeepSeek, la IA más avanzada. Solo describe lo que necesitas.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="purple" block @click="toggleFormularioDeepSeek">
                                    <v-icon left>mdi-brain</v-icon>
                                    {{ mostrarFormularioDeepSeek ? 'Ocultar DeepSeek' : 'Usar DeepSeek AI' }}
                                </v-btn>
                                <v-btn variant="outlined" block @click="probarConexionDeepSeek" class="mt-2">
                                    <v-icon left>mdi-connection</v-icon>
                                    Probar Conexión
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>

            <!-- Formulario integrado para personalizar CV -->
            <div v-if="mostrarFormularioIntegrado" id="formulario-integrado" class="formulario-integrado">
                <v-card class="form-card">
                    <v-card-title class="form-title">
                        <v-icon left color="secondary">mdi-account-edit</v-icon>
                        Personalizar CV para Oferta Específica
                    </v-card-title>

                    <v-card-text>
                        <v-form ref="formRef" v-model="valid">
                            <!-- Información del reclutador -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <v-icon left>mdi-account-tie</v-icon>
                                    Información del Reclutador
                                </h3>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="formulario.nombreReclutador"
                                            label="Nombre del Reclutador"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                            density="comfortable"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="formulario.email"
                                            label="Email del Reclutador"
                                            :rules="[rules.required, rules.email]"
                                            variant="outlined"
                                            density="comfortable"
                                        />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="formulario.empresa"
                                            label="Empresa"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                            density="comfortable"
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="formulario.posicion"
                                            label="Posición/Cargo"
                                            :rules="[rules.required]"
                                            variant="outlined"
                                            density="comfortable"
                                        />
                                    </v-col>
                                </v-row>
                            </div>

                            <!-- Habilidades -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <v-icon left>mdi-brain</v-icon>
                                    Habilidades Requeridas
                                </h3>
                                <p class="section-description">
                                    Selecciona las habilidades más relevantes para esta posición
                                </p>

                                <!-- Categorías de habilidades -->
                                <div class="skills-categories">
                                    <div v-for="(skills, categoria) in habilidadesPredefinidas" :key="categoria" class="skill-category">
                                        <h4 class="category-title">
                                            <v-icon left size="small">mdi-tag</v-icon>
                                            {{ categoria.charAt(0).toUpperCase() + categoria.slice(1) }}
                                        </h4>
                                        <div class="skills-grid">
                                            <v-chip
                                                v-for="skill in skills"
                                                :key="skill"
                                                :color="formulario.habilidadesSeleccionadas.includes(skill) ? 'secondary' : 'default'"
                                                :variant="formulario.habilidadesSeleccionadas.includes(skill) ? 'flat' : 'outlined'"
                                                class="skill-chip"
                                                @click="toggleSkill(skill)"
                                            >
                                                {{ skill }}
                                            </v-chip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Habilidad personalizada -->
                                <div class="custom-skills-section">
                                    <v-text-field
                                        v-model="nuevaHabilidad"
                                        label="Agregar habilidad personalizada"
                                        variant="outlined"
                                        density="comfortable"
                                        append-inner-icon="mdi-plus"
                                        @click:append-inner="agregarHabilidadPersonalizada"
                                        @keyup.enter="agregarHabilidadPersonalizada"
                                    />
                                </div>

                                <!-- Habilidades seleccionadas -->
                                <div v-if="formulario.habilidadesSeleccionadas.length > 0" class="selected-skills">
                                    <h4 class="selected-title">
                                        <v-icon left>mdi-check-circle</v-icon>
                                        Habilidades Seleccionadas ({{ formulario.habilidadesSeleccionadas.length }})
                                    </h4>
                                    <div class="selected-chips">
                                        <v-chip
                                            v-for="skill in formulario.habilidadesSeleccionadas"
                                            :key="skill"
                                            color="secondary"
                                            closable
                                            class="selected-chip"
                                            @click:close="removeSkill(skill)"
                                        >
                                            {{ skill }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>

                            <!-- Descripción del cargo -->
                            <div class="form-section">
                                <h3 class="section-title">
                                    <v-icon left>mdi-text-box</v-icon>
                                    Descripción del Cargo
                                </h3>
                                <v-textarea
                                    v-model="formulario.descripcionCargo"
                                    label="Pega aquí la descripción completa del trabajo"
                                    :rules="[rules.required, rules.minLength]"
                                    variant="outlined"
                                    rows="6"
                                    counter="500"
                                    hint="Incluye responsabilidades, requisitos y cualquier información relevante (mínimo 50 caracteres)"
                                />
                            </div>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="form-actions">
                        <v-btn
                            color="secondary"
                            size="large"
                            :disabled="!formularioCompleto"
                            :loading="mostrarEstadoGeneracion"
                            @click="generarCVDinamico"
                            class="generate-btn"
                        >
                            <v-icon left>mdi-magic-staff</v-icon>
                            Generar CV Personalizado
                        </v-btn>

                        <v-btn
                            variant="outlined"
                            @click="limpiarFormulario"
                            class="ml-2"
                        >
                            <v-icon left>mdi-refresh</v-icon>
                            Limpiar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <!-- Formulario DeepSeek AI -->
            <div v-if="mostrarFormularioDeepSeek" id="formulario-deepseek" class="formulario-integrado">
                <v-card class="form-card" style="border: 2px solid #9c27b0;">
                    <v-card-title class="form-title" style="background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.2));">
                        <v-icon left color="purple">mdi-robot-excited</v-icon>
                        Generar CV con DeepSeek AI
                        <v-chip color="purple" size="small" class="ml-2">BETA</v-chip>
                    </v-card-title>

                    <v-card-text>
                        <!-- Estado de conexión -->
                        <v-alert
                            v-if="conexionDeepSeek"
                            :type="conexionDeepSeek.success ? 'success' : 'error'"
                            class="mb-4"
                        >
                            <template v-if="conexionDeepSeek.testing">
                                <v-progress-circular indeterminate size="16" class="mr-2"></v-progress-circular>
                                Probando conexión con DeepSeek...
                            </template>
                            <template v-else-if="conexionDeepSeek.success">
                                ✅ Conexión exitosa con DeepSeek: {{ conexionDeepSeek.response }}
                            </template>
                            <template v-else>
                                ❌ Error de conexión: {{ conexionDeepSeek.error }}
                            </template>
                        </v-alert>

                        <!-- Prompts rápidos -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <v-icon left>mdi-lightning-bolt</v-icon>
                                Prompts Rápidos
                            </h3>
                            <p class="section-description">
                                Selecciona un tipo de CV o escribe tu propio prompt personalizado
                            </p>

                            <div class="skills-grid mb-4">
                                <v-chip
                                    color="purple"
                                    variant="outlined"
                                    class="skill-chip"
                                    @click="generarPromptOptimizado('frontend')"
                                >
                                    Frontend Developer
                                </v-chip>
                                <v-chip
                                    color="purple"
                                    variant="outlined"
                                    class="skill-chip"
                                    @click="generarPromptOptimizado('backend')"
                                >
                                    Backend Developer
                                </v-chip>
                                <v-chip
                                    color="purple"
                                    variant="outlined"
                                    class="skill-chip"
                                    @click="generarPromptOptimizado('fullstack')"
                                >
                                    Full Stack
                                </v-chip>
                                <v-chip
                                    color="purple"
                                    variant="outlined"
                                    class="skill-chip"
                                    @click="generarPromptOptimizado('lider')"
                                >
                                    Tech Lead
                                </v-chip>
                                <v-chip
                                    color="purple"
                                    variant="outlined"
                                    class="skill-chip"
                                    @click="generarPromptOptimizado('docente')"
                                >
                                    Facilitador/Docente
                                </v-chip>
                            </div>
                        </div>

                        <!-- Prompt personalizado -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <v-icon left>mdi-message-text</v-icon>
                                Describe tu CV ideal
                            </h3>
                            <v-textarea
                                v-model="promptDeepSeek"
                                label="Describe cómo quieres que sea tu CV"
                                placeholder="Ejemplo: 'CV para desarrollador frontend en startup, destacar Vue.js y experiencia en UX, para empresa tecnológica innovadora'"
                                variant="outlined"
                                rows="4"
                                counter="500"
                                hint="Sé específico: menciona el tipo de empresa, posición, tecnologías a destacar, etc."
                            />
                        </div>
                    </v-card-text>

                    <v-card-actions class="form-actions">
                        <v-btn
                            color="purple"
                            size="large"
                            :disabled="!promptDeepSeek.trim()"
                            :loading="generandoConDeepSeek"
                            @click="generarCVConDeepSeek"
                            class="generate-btn"
                        >
                            <v-icon left>mdi-robot-excited</v-icon>
                            Generar con DeepSeek AI
                        </v-btn>

                        <v-btn
                            variant="outlined"
                            @click="limpiarResultadoDeepSeek"
                            class="ml-2"
                        >
                            <v-icon left>mdi-refresh</v-icon>
                            Limpiar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <!-- Resultado DeepSeek -->
            <div v-if="resultadoDeepSeek" class="formulario-integrado">
                <v-card class="form-card">
                    <v-card-title v-if="resultadoDeepSeek.success" class="success-title">
                        <v-icon left>mdi-robot-excited</v-icon>
                        <div>
                            ¡CV Generado con DeepSeek AI!
                            <div class="subtitle">{{ resultadoDeepSeek.metadata?.candidato }} - {{ resultadoDeepSeek.metadata?.modelo }}</div>
                        </div>
                    </v-card-title>

                    <v-card-title v-else style="background: #f44336; color: white;">
                        <v-icon left>mdi-alert-circle</v-icon>
                        Error en DeepSeek AI
                    </v-card-title>

                    <v-card-text v-if="resultadoDeepSeek.success" class="text-center py-6">
                        <div class="success-content">
                            <p class="success-description mb-4">
                                DeepSeek ha generado tu CV personalizado usando IA avanzada.
                            </p>

                            <div class="action-buttons">
                                <v-btn
                                    color="purple"
                                    size="large"
                                    @click="descargarCVDeepSeek"
                                    class="download-btn-main"
                                >
                                    <v-icon left>mdi-download</v-icon>
                                    Descargar CV DeepSeek (PDF)
                                </v-btn>
                            </div>
                        </div>
                    </v-card-text>

                    <v-card-text v-else class="text-center py-6">
                        <p class="error-description">{{ resultadoDeepSeek.error }}</p>
                        <v-btn color="purple" @click="generarCVConDeepSeek" class="mt-4">
                            <v-icon left>mdi-refresh</v-icon>
                            Intentar de nuevo
                        </v-btn>
                    </v-card-text>

                    <v-card-actions class="justify-center pb-4">
                        <v-btn variant="text" @click="limpiarResultadoDeepSeek">
                            <v-icon left>mdi-close</v-icon>
                            Cerrar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>

            <!-- Vista previa del CV -->
                <div class="cv-preview" v-if="mostrarVistaPrevia">
                    <h2>Vista Previa</h2>
                    <div class="cv-container">
                        <aside class="cv-sidebar">
                            <img src="https://avatars.githubusercontent.com/u/68249859?v=4" alt="Foto Michael">
                            <h1>Michael Esteban<br>Sáez Contreras</h1>
                            <p class="tagline">
                                Desarrollador Full Stack<br>Javascript | Nodejs | Express | Vue | React | Java |
                                Python<br>Facilitador y
                                Mentor Tecnológico
                            </p>
                        </aside>

                        <main class="cv-main">
                            <section>
                                <DatosContactoCv />
                            </section>
                            <section>
                                <PresentacionCv />
                            </section>
                        </main>

                        <ExperienciaLaboralCv />
                        <EducacionCv />
                        <HabilidadesCv />
                        <CertificacionesCv />
                    </div>

                    <div class="cv-actions">
                        <v-btn color="primary" @click="imprimirCV">
                            <v-icon left>mdi-printer</v-icon>
                            Imprimir / Guardar PDF
                        </v-btn>
                        <v-btn variant="outlined" @click="mostrarVistaPrevia = false">
                            Ocultar Vista Previa
                        </v-btn>
                    </div>
                </div>
            </v-container>
        </section>

        <!-- Contenedor oculto para conversión a PDF -->
        <div id="cv-container-hidden-static"
            style="position: absolute; left: -9999px; top: -9999px; visibility: hidden;"></div>

        <!-- Dialog de estado de generación -->
        <v-dialog v-model="mostrarEstadoGeneracion" persistent max-width="400" class="generation-dialog">
            <v-card>
                <v-card-title class="text-center">
                    <v-icon left color="secondary">mdi-magic-staff</v-icon>
                    Generando CV Personalizado
                </v-card-title>
                <v-card-text class="text-center py-6">
                    <v-progress-circular indeterminate color="secondary" size="64" class="mb-4"></v-progress-circular>
                    <p>{{ estadoActual || 'Procesando información...' }}</p>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Dialog de resultado exitoso -->
        <v-dialog v-model="mostrarResultado" max-width="600" class="result-dialog">
            <v-card>
                <v-card-title class="success-title">
                    <v-icon left>mdi-check-circle</v-icon>
                    <div>
                        ¡CV Personalizado Generado!
                        <div class="subtitle">Tu CV está listo para descargar</div>
                    </div>
                </v-card-title>

                <v-card-text class="text-center py-6">
                    <div class="success-content">
                        <p class="success-description mb-4">
                            Hemos creado un CV personalizado específicamente para la posición de
                            <strong>{{ formulario.posicion }}</strong> en <strong>{{ formulario.empresa }}</strong>.
                        </p>

                        <div class="action-buttons">
                            <v-btn
                                color="primary"
                                size="large"
                                @click="descargarCVDirecto"
                                class="download-btn-main"
                            >
                                <v-icon left>mdi-download</v-icon>
                                Descargar CV (PDF)
                            </v-btn>

                            <v-btn
                                variant="outlined"
                                @click="imprimirCVDinamico"
                                class="print-btn"
                            >
                                <v-icon left>mdi-printer</v-icon>
                                Imprimir CV
                            </v-btn>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions class="justify-center pb-4">
                    <v-btn variant="text" @click="generarOtroCV">
                        <v-icon left>mdi-plus</v-icon>
                        Generar Otro CV
                    </v-btn>
                    <v-btn variant="text" @click="cerrarResultado">
                        <v-icon left>mdi-close</v-icon>
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog para CV personalizado (modal legacy) -->
        <FormularioCVPersonalizado v-model="mostrarFormularioPersonalizado" @cv-generado="manejarCVGenerado" />
    </BaseLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue'
import FormularioCVPersonalizado from '@/components/FormularioCVPersonalizado.vue'
import CertificacionesCv from '../components/cv_components/CertificacionesCv.vue'
import EducacionCv from '../components/cv_components/EducacionCv.vue'
import HabilidadesCv from '../components/cv_components/HabilidadesCv.vue'
import DatosContactoCv from '../components/cv_components/DatosContactoCv.vue'
import PresentacionCv from '../components/cv_components/PresentacionCv.vue'
import ExperienciaLaboralCv from '../components/cv_components/ExperienciaLaboralCv.vue'
import cvGeneratorService from '@/services/cvGeneratorService'
import { useCVGenerator } from '@/composables/useCVGenerator'
import deepSeekService from '@/services/deepSeekService'

// Composable para generación de CV
const {
  generando,
  estadoActual,
  generarCVPersonalizado,
  limpiarEstado,
  cvHTML
} = useCVGenerator()

// Estado del componente
const mostrarFormularioPersonalizado = ref(false)
const mostrarVistaPrevia = ref(false)
const cvGeneradoData = ref(null)
const probandoAPI = ref(false)

// Estado para el formulario integrado
const mostrarFormularioIntegrado = ref(false)
const formRef = ref(null)
const valid = ref(false)
const mostrarEstadoGeneracion = ref(false)
const mostrarResultado = ref(false)
const nuevaHabilidad = ref('')

// Estados para DeepSeek
const mostrarFormularioDeepSeek = ref(false)
const promptDeepSeek = ref('')
const generandoConDeepSeek = ref(false)
const resultadoDeepSeek = ref(null)
const conexionDeepSeek = ref(null)

// Datos del formulario dinámico
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

// Función para descargar CV genérico usando el nuevo servicio
const descargarCVGenerico = async () => {
    try {
        // Usar el nuevo servicio especializado
        const { default: cvPDFService } = await import('@/services/cvPDFService')
        const nombreArchivo = `cv-michael-saez-${Date.now()}.pdf`

        const resultado = await cvPDFService.generarYDescargarCV(nombreArchivo)

        if (resultado.success) {
            console.log(`CV descargado exitosamente: ${resultado.filename} (${resultado.size} bytes)`)
        } else {
            throw new Error(resultado.error)
        }

    } catch (error) {
        console.error('Error al descargar CV:', error)
        alert('Error al descargar el CV. Inténtalo de nuevo.')
    }
}

// Función para imprimir CV usando el nuevo servicio
const imprimirCV = async () => {
    try {
        // Usar el nuevo servicio especializado
        const { default: cvPDFService } = await import('@/services/cvPDFService')

        // Obtener datos del perfil desde Firebase
        const { perfilService } = await import('@/firebase/services')
        const perfilResult = await perfilService.obtenerPerfilCandidato()
        const perfilCandidato = perfilResult.success ? perfilResult.data : null

        // Generar HTML completo
        const htmlCompleto = cvPDFService.generarHTMLCompleto(perfilCandidato)

        // Crear un blob con el HTML del CV
        const blob = new Blob([htmlCompleto], { type: 'text/html' })
        const url = URL.createObjectURL(blob)

        // Abrir en nueva ventana para imprimir
        const printWindow = window.open(url, '_blank', 'width=800,height=600')

        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print()
                setTimeout(() => {
                    printWindow.close()
                    URL.revokeObjectURL(url)
                }, 1000)
            }
        }
    } catch (error) {
        console.error('Error al imprimir CV:', error)
        alert('Error al imprimir el CV. Inténtalo de nuevo.')
    }
}

// Función para mostrar/ocultar formulario integrado
const toggleFormularioIntegrado = () => {
    mostrarFormularioIntegrado.value = !mostrarFormularioIntegrado.value
    if (mostrarFormularioIntegrado.value) {
        // Scroll suave hacia el formulario
        setTimeout(() => {
            const formularioElement = document.getElementById('formulario-integrado')
            if (formularioElement) {
                formularioElement.scrollIntoView({ behavior: 'smooth' })
            }
        }, 100)
    }
}

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

// Función principal para generar CV dinámico
const generarCVDinamico = async () => {
    if (!formularioCompleto.value) return

    mostrarEstadoGeneracion.value = true

    try {
        // Usar el composable unificado para generar CV dinámico
        const resultado = await generarCVPersonalizado(formulario, 'dinamico')

        if (resultado.success) {
            mostrarEstadoGeneracion.value = false
            mostrarResultado.value = true

            // Ocultar el formulario integrado
            mostrarFormularioIntegrado.value = false
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
}

const generarOtroCV = () => {
    mostrarResultado.value = false
    limpiarFormulario()
    limpiarEstado()
    mostrarFormularioIntegrado.value = true
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

// Función para descargar CV directamente
const descargarCVDirecto = async () => {
    if (!cvHTML.value) {
        alert('No hay CV disponible para descargar.')
        return
    }

    try {
        const contenedorOculto = document.getElementById('cv-container-hidden-static')
        if (contenedorOculto) {
            contenedorOculto.innerHTML = cvHTML.value
        }

        const nombreArchivo = `cv-${formulario.empresa.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`

        const { default: cvGeneratorService } = await import('@/services/cvGeneratorService')
        const pdfBlob = await cvGeneratorService.convertirHTMLaPDF(cvHTML.value, nombreArchivo)
        cvGeneratorService.descargarPDF(pdfBlob, nombreArchivo)

        if (contenedorOculto) {
            contenedorOculto.innerHTML = ''
        }

    } catch (error) {
        console.error('Error al descargar CV:', error)
        alert('Error al descargar el CV. Inténtalo de nuevo.')
    }
}

// Función para imprimir CV dinámico
const imprimirCVDinamico = async () => {
    if (cvHTML.value) {
        try {
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>CV - ${formulario.empresa}</title>
                  <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    @media print {
                      body { margin: 0; padding: 0; }
                      .no-print { display: none; }
                    }
                  </style>
                </head>
                <body>
                  ${cvHTML.value}
                </body>
                </html>
            `

            const blob = new Blob([htmlContent], { type: 'text/html' })
            const url = URL.createObjectURL(blob)

            const printWindow = window.open(url, '_blank', 'width=800,height=600')

            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print()
                    setTimeout(() => {
                        printWindow.close()
                        URL.revokeObjectURL(url)
                    }, 1000)
                }
            }
        } catch (error) {
            console.error('Error al imprimir CV:', error)
            alert('Error al imprimir el CV. Inténtalo de nuevo.')
        }
    } else {
        alert('No hay CV disponible para imprimir.')
    }
}

// Función para manejar CV generado
const manejarCVGenerado = (datosCV) => {
    cvGeneradoData.value = datosCV
    mostrarVistaPrevia.value = true
}

// ===== FUNCIONES DEEPSEEK =====

// Función para mostrar/ocultar formulario DeepSeek
const toggleFormularioDeepSeek = () => {
    mostrarFormularioDeepSeek.value = !mostrarFormularioDeepSeek.value
    if (mostrarFormularioDeepSeek.value) {
        // Scroll suave hacia el formulario
        setTimeout(() => {
            const formularioElement = document.getElementById('formulario-deepseek')
            if (formularioElement) {
                formularioElement.scrollIntoView({ behavior: 'smooth' })
            }
        }, 100)
    }
}

// Función para probar conexión con DeepSeek
const probarConexionDeepSeek = async () => {
    try {
        conexionDeepSeek.value = { testing: true }
        const resultado = await deepSeekService.probarConexion()
        conexionDeepSeek.value = resultado

        if (resultado.success) {
            console.log('✅ Conexión DeepSeek exitosa:', resultado.response)
        } else {
            console.error('❌ Error conexión DeepSeek:', resultado.error)
        }
    } catch (error) {
        console.error('❌ Error probando DeepSeek:', error)
        conexionDeepSeek.value = { success: false, error: error.message }
    }
}

// Función para generar CV con DeepSeek
const generarCVConDeepSeek = async () => {
    if (!promptDeepSeek.value.trim()) {
        alert('Por favor, describe cómo quieres personalizar tu CV')
        return
    }

    generandoConDeepSeek.value = true
    resultadoDeepSeek.value = null

    try {
        console.log('🤖 Generando CV con DeepSeek...', { prompt: promptDeepSeek.value })

        const resultado = await deepSeekService.generarCVPersonalizado(promptDeepSeek.value)

        if (resultado.success) {
            resultadoDeepSeek.value = {
                success: true,
                html: resultado.html,
                metadata: resultado.metadata,
                provider: 'deepseek'
            }

            // Ocultar formulario y mostrar resultado
            mostrarFormularioDeepSeek.value = false

            console.log('✅ CV generado con DeepSeek:', resultado.metadata)
        } else {
            throw new Error(resultado.error || 'Error desconocido en DeepSeek')
        }

    } catch (error) {
        console.error('❌ Error generando CV con DeepSeek:', error)
        resultadoDeepSeek.value = {
            success: false,
            error: error.message,
            provider: 'deepseek'
        }
        alert(`Error al generar CV con DeepSeek: ${error.message}`)
    } finally {
        generandoConDeepSeek.value = false
    }
}

// Función para descargar CV de DeepSeek
const descargarCVDeepSeek = async () => {
    if (!resultadoDeepSeek.value?.html) {
        alert('No hay CV de DeepSeek disponible para descargar.')
        return
    }

    try {
        const { default: cvGeneratorService } = await import('@/services/cvGeneratorService')
        const nombreArchivo = `cv-deepseek-${Date.now()}.pdf`
        const pdfBlob = await cvGeneratorService.convertirHTMLaPDF(resultadoDeepSeek.value.html, nombreArchivo)
        cvGeneratorService.descargarPDF(pdfBlob, nombreArchivo)

        console.log('✅ CV DeepSeek descargado:', nombreArchivo)
    } catch (error) {
        console.error('❌ Error descargando CV DeepSeek:', error)
        alert('Error al descargar el CV. Inténtalo de nuevo.')
    }
}

// Función para limpiar resultado DeepSeek
const limpiarResultadoDeepSeek = () => {
    resultadoDeepSeek.value = null
    promptDeepSeek.value = ''
    conexionDeepSeek.value = null
}

// Función para generar prompt optimizado
const generarPromptOptimizado = (tipo) => {
    const habilidadesSeleccionadas = formulario.habilidadesSeleccionadas || []
    const empresa = formulario.empresa || ''
    const posicion = formulario.posicion || ''

    promptDeepSeek.value = deepSeekService.generarPromptOptimizado(
        tipo,
        habilidadesSeleccionadas,
        empresa,
        posicion
    )
}
</script>

<style scoped>
.cv-page {
    padding: 4rem 0;
    color: var(--color-text);
}

.page-title {
    font-size: 3rem;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: var(--color-secondary);
    text-align: center;
    margin-bottom: 3rem;
}

.cv-options {
    margin-bottom: 4rem;
}

.download-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.option-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.option-card:hover {
    transform: translateY(-5px);
}

:deep(.v-card-title) {
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 1rem;
}

:deep(.v-card-text) {
    color: #cccccc;
}

.cv-preview {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cv-preview h2 {
    color: var(--color-text);
    text-align: center;
    margin-bottom: 2rem;
}

.cv-container {
    background: white;
    color: #333;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 30% 70%;
    max-width: 1100px;
    margin: 0 auto 2rem auto;
}

.cv-sidebar {
    background-color: #2a60c4;
    color: white;
    padding: 2rem 1rem;
}

.cv-sidebar img {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.cv-sidebar h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: white;
}

.cv-sidebar .tagline {
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: 1rem;
    line-height: 1.4;
}

.cv-main {
    padding: 2rem;
}

.cv-actions {
    text-align: center;
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Formulario integrado */
.formulario-integrado {
    margin: 4rem 0;
    animation: slideDown 0.5s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
}

.form-title {
    color: var(--color-text) !important;
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(0, 204, 204, 0.1));
    border-radius: 16px 16px 0 0 !important;
}

.form-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
    font-size: 1.2rem !important;
    font-weight: 600 !important;
    color: var(--color-text) !important;
    margin-bottom: 1rem !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    font-size: 1rem;
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

/* Form Actions */
.form-actions {
    justify-content: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0 0 16px 16px;
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
    border-radius: 16px !important;
    overflow: hidden;
}

.success-title {
    background: linear-gradient(135deg, #4caf50, #66bb6a);
    color: white !important;
    font-weight: 600 !important;
    display: flex;
    align-items: center;
    padding: 24px;
    border-radius: 0 !important;
}

.success-title .subtitle {
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 14px;
    margin: 0;
    font-weight: 400;
}

.success-content {
    max-width: 500px;
    margin: 0 auto;
}

.success-description {
    font-size: 16px;
    color: #ccc !important;
    line-height: 1.6;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
}

.download-btn-main {
    background: linear-gradient(135deg, #2196f3, #42a5f5) !important;
    color: white !important;
    border-radius: 12px !important;
    padding: 16px 32px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3) !important;
    transition: all 0.3s ease !important;
    min-width: 250px;
}

.download-btn-main:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 24px rgba(33, 150, 243, 0.4) !important;
}

.print-btn {
    min-width: 250px;
    border-radius: 12px !important;
    padding: 12px 32px !important;
    font-weight: 500 !important;
    text-transform: none !important;
    border-color: #00cccc !important;
    color: #00cccc !important;
}

/* Responsive Design */
@media (max-width: 768px) {
    .formulario-integrado {
        margin: 2rem 0;
    }

    .form-section {
        padding: 1rem;
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

    .cv-container {
        grid-template-columns: 1fr;
    }

    .cv-sidebar {
        text-align: center;
    }

    .cv-actions {
        flex-direction: column;
        align-items: center;
    }

    .page-title {
        font-size: 2rem;
    }
}

@media print {
    .cv-page {
        padding: 0;
    }

    .cv-options,
    .cv-actions,
    .formulario-integrado {
        display: none;
    }

    .cv-container {
        box-shadow: none;
        max-width: 100%;
        margin: 0;
    }
}
</style>