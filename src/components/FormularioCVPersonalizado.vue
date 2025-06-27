<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800" persistent>
    <v-card>
      <v-card-title class="dialog-title">
        <v-icon color="secondary" size="32">mdi-account-tie</v-icon>
        CV Personalizado para Reclutadores
      </v-card-title>
      
      <v-card-text>
        <p class="dialog-subtitle">
          Responde estas preguntas para generar un CV adaptado específicamente a tu oferta laboral
        </p>

        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.nombreReclutador"
                label="Tu nombre"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-account"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.empresa"
                label="Empresa"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-office-building"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formulario.email"
                label="Email de contacto"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                prepend-inner-icon="mdi-email"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="formulario.rubro"
                :items="rubros"
                label="Rubro de la empresa"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-domain"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formulario.posicion"
                label="Posición a cubrir"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-briefcase"
                placeholder="ej: Desarrollador Full Stack Senior"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="formulario.tecnologias"
                :items="tecnologiasDisponibles"
                label="Tecnologías requeridas"
                multiple
                chips
                closable-chips
                variant="outlined"
                prepend-inner-icon="mdi-code-tags"
                hint="Selecciona las tecnologías más importantes para el puesto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formulario.experienciaRequerida"
                :items="nivelesExperiencia"
                label="Nivel de experiencia"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-star"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="formulario.modalidad"
                :items="modalidades"
                label="Modalidad de trabajo"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-laptop"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="formulario.descripcionPuesto"
                label="Descripción del puesto (opcional)"
                variant="outlined"
                prepend-inner-icon="mdi-text"
                rows="3"
                hint="Describe brevemente las responsabilidades principales"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="formulario.requisitosEspeciales"
                label="Requisitos especiales (opcional)"
                variant="outlined"
                prepend-inner-icon="mdi-clipboard-list"
                rows="2"
                hint="Menciona cualquier requisito específico o habilidad blanda importante"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cerrarDialog">
          Cancelar
        </v-btn>
        <v-btn 
          color="secondary" 
          :loading="generando"
          :disabled="!valid"
          @click="generarCV"
        >
          <v-icon left>mdi-magic-staff</v-icon>
          Generar CV Personalizado
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMainStore } from '@/stores/main'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'cv-generado'])

const store = useMainStore()

// Estado del formulario
const form = ref(null)
const valid = ref(false)
const generando = ref(false)

// Datos del formulario
const formulario = reactive({
  nombreReclutador: '',
  empresa: '',
  email: '',
  rubro: '',
  posicion: '',
  tecnologias: [],
  experienciaRequerida: '',
  modalidad: '',
  descripcionPuesto: '',
  requisitosEspeciales: ''
})

// Opciones para los selects
const rubros = [
  'Tecnología',
  'Fintech',
  'E-commerce',
  'Salud',
  'Educación',
  'Retail',
  'Manufactura',
  'Consultoría',
  'Startup',
  'Gobierno',
  'Otro'
]

const tecnologiasDisponibles = [
  'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Angular', 'Node.js',
  'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
  'PHP', 'Laravel', 'C#', '.NET', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD'
]

const nivelesExperiencia = [
  'Junior (1-2 años)',
  'Semi-Senior (3-4 años)',
  'Senior (5+ años)',
  'Lead/Arquitecto (7+ años)'
]

const modalidades = [
  'Presencial',
  'Remoto',
  'Híbrido',
  'Flexible'
]

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es obligatorio',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Ingresa un email válido'
  }
}

// Función para cerrar el dialog
const cerrarDialog = () => {
  emit('update:modelValue', false)
  limpiarFormulario()
}

// Función para limpiar el formulario
const limpiarFormulario = () => {
  Object.keys(formulario).forEach(key => {
    if (Array.isArray(formulario[key])) {
      formulario[key] = []
    } else {
      formulario[key] = ''
    }
  })
  form.value?.resetValidation()
}

// Función para generar CV personalizado
const generarCV = async () => {
  if (!valid.value) return

  generando.value = true

  try {
    // Guardar la solicitud en Firestore
    const solicitud = {
      ...formulario,
      tipoSolicitud: 'cv_personalizado',
      fechaSolicitud: new Date().toISOString()
    }

    const resultado = await store.enviarSolicitudCV(solicitud)

    if (resultado.success) {
      // Simular generación de CV personalizado
      // En una implementación real, aquí se llamaría a GPT o se procesaría la información
      const cvPersonalizado = {
        id: resultado.id,
        datos: formulario,
        mensaje: `CV personalizado generado para ${formulario.posicion} en ${formulario.empresa}`
      }

      emit('cv-generado', cvPersonalizado)
      cerrarDialog()
    } else {
      console.error('Error al guardar solicitud:', resultado.error)
    }
  } catch (error) {
    console.error('Error al generar CV:', error)
  } finally {
    generando.value = false
  }
}
</script>

<style scoped>
.dialog-title {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dialog-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

:deep(.v-field) {
  background-color: rgba(0, 0, 0, 0.02);
}

:deep(.v-chip) {
  margin: 2px;
}
</style>
