<template>
  <div class="text-center py-12">
    <h2>✨ ¡Gracias por tu solicitud!</h2>
    <p class="my-4">Tu código de seguimiento es: <strong>{{ store.formData.codigo }}</strong></p>
    <v-btn color="primary" :to="{ name: 'Seguimiento' }">Ir a seguimiento</v-btn>
  </div>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore'
const store = useFormStore()
</script>
