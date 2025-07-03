<template>
  <div class="form-interactivo-container">
    <!-- Fondo Spotlight reutilizado -->
    <SpotlightEffect />

    <!-- Logo sticky con enlace al home -->
    <router-link
      to="/"
      class="logo-link"
      @click.prevent="confirmExit"
    >
      <img v-lazy src="/logo/logo_maikostudio.png" alt="Maiko Studios" class="logo-img" />
    </router-link>

    <v-dialog v-model="showExit" persistent width="400">
      <v-card>
        <v-card-title class="text-h6">Salir del formulario</v-card-title>
        <v-card-text>
          Perderás los datos ingresados. ¿Estás seguro que deseas salir?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="showExit = false">Cancelar</v-btn>
          <v-btn color="primary" @click="exitForm">Salir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Wizard -->
    <v-container class="py-12" fluid>
      <FormStepper />
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SpotlightEffect from '@/components/SpotlightEffect.vue'
import FormStepper from '@/components/forms/FormStepper.vue'
import { useFormStore } from '@/stores/formStore'

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const showExit = ref(false)

onMounted(() => {
  // Capturar UTM y canal de entrada
  const utm = {
    utm_source: route.query.utm_source,
    utm_medium: route.query.utm_medium,
    utm_campaign: route.query.utm_campaign
  }
  formStore.updateFormData({
    utm,
    fuente: route.query.utm_source ? 'Campañas' : 'Home'
  })
})

function confirmExit () {
  showExit.value = true
}

function exitForm () {
  formStore.resetForm()
  router.push('/')
}
</script>

<style scoped>
.form-interactivo-container {
  position: relative;
  min-height: 100vh;
  background-color: var(--color-background);
}
.logo-link {
  position: fixed;
  z-index: 50;
  top: 1rem;
  left: 1rem;
}
@media (max-width: 600px) {
  .logo-link {
    left: 50%;
    transform: translateX(-50%);
  }
}
.logo-img {
  height: 48px;
  width: auto;
}
</style>
