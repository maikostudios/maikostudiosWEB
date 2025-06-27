<template>
  <BaseLayout>
    <!-- Efecto de luz de fondo -->
    <SpotlightEffect />
    
    <!-- Contenido principal -->
    <div class="generador-cv-view">
      <GeneradorCVDinamico @cv-generado="manejarCVGenerado" />
    </div>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue'
import SpotlightEffect from '@/components/SpotlightEffect.vue'
import GeneradorCVDinamico from '@/components/GeneradorCVDinamico.vue'

// Manejar evento cuando se genera un CV
const manejarCVGenerado = (datosCV) => {
  console.log('CV generado:', datosCV)
  
  // Aquí podrías agregar lógica adicional como:
  // - Enviar notificación por email
  // - Registrar estadísticas
  // - Redirigir a una página de confirmación
  // - Integrar con servicios de terceros
}
</script>

<style scoped>
.generador-cv-view {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: 2rem;
}
</style>
