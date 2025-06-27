<template>
  <div class="formulario-integrado">
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
                  v-model="formData.nombreReclutador"
                  label="Nombre del Reclutador"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
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
                  v-model="formData.empresa"
                  label="Empresa"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.posicion"
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
              Selecciona o escribe las habilidades más relevantes para esta posición
            </p>

            <!-- Selector de habilidades simplificado -->
            <v-text-field
              v-model="nuevaHabilidad"
              label="Agregar habilidad (ej: Vue.js, Python, Figma)"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-plus"
              hint="Escribe una habilidad y presiona Enter para agregar"
              persistent-hint
              @keyup.enter="agregarHabilidadSimple"
            />

            <!-- Habilidades seleccionadas -->
            <div v-if="formData.habilidadesSeleccionadas.length > 0" class="selected-skills">
              <h4 class="selected-title">
                <v-icon left>mdi-check-circle</v-icon>
                Habilidades Seleccionadas ({{ formData.habilidadesSeleccionadas.length }})
              </h4>
              <div class="selected-chips">
                <v-chip
                  v-for="skill in formData.habilidadesSeleccionadas"
                  :key="skill"
                  color="primary"
                  variant="flat"
                  size="small"
                  closable
                  class="selected-chip"
                  @click:close="removeSkill(skill)"
                >
                  <v-icon left size="small">mdi-star</v-icon>
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
              v-model="formData.descripcionCargo"
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
          color="primary"
          size="large"
          :disabled="!isFormComplete"
          :loading="loading"
          @click="$emit('generate-cv', formData)"
          class="generate-btn"
        >
          <v-icon left>mdi-robot</v-icon>
          Generar CV Personalizado con IA
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
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['generate-cv'])

// Estado del formulario
const formRef = ref(null)
const valid = ref(false)
const nuevaHabilidad = ref('')

const formData = reactive({
  nombreReclutador: '',
  email: '',
  empresa: '',
  posicion: '',
  habilidadesSeleccionadas: [],
  descripcionCargo: ''
})

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es requerido',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email inválido'
  },
  minLength: value => (value && value.length >= 50) || 'Mínimo 50 caracteres'
}

// Computed
const isFormComplete = computed(() => {
  return valid.value && 
         formData.nombreReclutador && 
         formData.email && 
         formData.empresa && 
         formData.posicion && 
         formData.descripcionCargo && 
         formData.descripcionCargo.length >= 50
})

// Métodos
const agregarHabilidadSimple = () => {
  const habilidad = nuevaHabilidad.value.trim()
  if (habilidad && !formData.habilidadesSeleccionadas.includes(habilidad)) {
    formData.habilidadesSeleccionadas.push(habilidad)
    nuevaHabilidad.value = ''
  }
}

const removeSkill = (skill) => {
  const index = formData.habilidadesSeleccionadas.indexOf(skill)
  if (index > -1) {
    formData.habilidadesSeleccionadas.splice(index, 1)
  }
}

const limpiarFormulario = () => {
  Object.assign(formData, {
    nombreReclutador: '',
    email: '',
    empresa: '',
    posicion: '',
    habilidadesSeleccionadas: [],
    descripcionCargo: ''
  })
  nuevaHabilidad.value = ''
  if (formRef.value) {
    formRef.value.reset()
  }
}
</script>

<style scoped>
.formulario-integrado {
  margin: 3rem 0;
}

.form-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  background: linear-gradient(135deg, rgba(0, 204, 204, 0.1), rgba(0, 204, 204, 0.2));
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.section-title {
  color: var(--color-text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
}

.section-description {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.selected-skills {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 102, 255, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 102, 255, 0.1);
}

.selected-title {
  color: var(--color-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-chip {
  margin: 0.25rem;
}

.form-actions {
  padding: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.generate-btn {
  min-width: 280px;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }
  
  .generate-btn {
    width: 100% !important;
    font-size: 1rem !important;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
