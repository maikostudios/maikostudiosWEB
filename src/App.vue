<template>
  <div class="app-container">
    <!-- Banner de modo demo -->
    <div v-if="!isFirebaseConfigured" class="demo-banner">
      <v-icon color="warning">mdi-information</v-icon>
      <span>Modo Demo: Configurar Firebase para funcionalidad completa</span>
    </div>

    <!-- Efecto de luz global como capa de fondo -->
    <SpotlightEffect />

    <!-- Contenido principal que se renderiza por encima -->
    <div class="app-content">
      <router-view />
    </div>

    <!-- Chatbot GPT disponible en toda la aplicación -->
    <ChatbotGPT />

    <!-- Sistema de notificaciones global -->
    <NotificationContainer position="top-right" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SpotlightEffect from '@/components/SpotlightEffect.vue'
import ChatbotGPT from '@/components/ChatbotGPT.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import { isFirebaseConfigured as checkFirebaseConfigured } from '@/firebase/config'

// Computed para verificar si Firebase está configurado
const isFirebaseConfigured = computed(() => {
  return checkFirebaseConfigured()
})
</script>

<style>
.app-container {
  position: relative;
  min-height: 100vh;
  background-color: var(--color-background);
}

.demo-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 9999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  margin-top: var(--demo-banner-height, 0);
}

/* Ajustar margen cuando hay banner de demo */
.demo-banner+* .app-content {
  margin-top: 40px;
}
</style>
