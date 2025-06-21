<template>
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
          <v-btn color="primary" block @click="$emit('download-generic')">
            <v-icon left>mdi-file-pdf-box</v-icon>
            Descargar CV
          </v-btn>
          <v-btn variant="outlined" block @click="$emit('print-cv')" class="mt-2">
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
          <v-btn color="secondary" block @click="$emit('toggle-form')">
            <v-icon left>mdi-form-select</v-icon>
            {{ showForm ? 'Ocultar Formulario' : 'Personalizar CV' }}
          </v-btn>
          <v-btn 
            variant="outlined" 
            block 
            @click="$emit('generate-custom')" 
            :disabled="!formComplete" 
            class="mt-2"
          >
            <v-icon left>mdi-magic-staff</v-icon>
            Generar CV Personalizado
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="option-card" elevation="2">
        <v-card-title>
          <v-icon color="blue" size="32">mdi-google</v-icon>
          CV con Gemini AI
          <v-chip color="blue" size="small" class="ml-2">NUEVO</v-chip>
        </v-card-title>
        <v-card-text>
          Genera tu CV usando Gemini 1.5 Flash de Google. Rápido, preciso y económico.
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" block @click="$emit('toggle-gemini')">
            <v-icon left>mdi-brain</v-icon>
            {{ showGemini ? 'Ocultar Gemini' : 'Usar Gemini AI' }}
          </v-btn>
          <v-btn variant="outlined" block @click="$emit('test-gemini')" class="mt-2">
            <v-icon left>mdi-connection</v-icon>
            Probar Conexión
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showForm: {
    type: Boolean,
    default: false
  },
  showGemini: {
    type: Boolean,
    default: false
  },
  formComplete: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'download-generic',
  'print-cv',
  'toggle-form',
  'generate-custom',
  'toggle-gemini',
  'test-gemini'
])
</script>

<style scoped>
.cv-options {
  margin-bottom: 4rem;
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

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>
