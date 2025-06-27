<template>
  <div class="base-layout">
    <!-- Navbar siempre presente -->
    <Navbar />
    
    <!-- Contenido principal -->
    <main class="main-content">
      <slot />
    </main>
    
    <!-- Footer siempre presente -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.base-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* Altura del navbar fijo */
  background: transparent; /* Permite que el efecto de luz se vea */
}

/* Asegurar que el contenido tenga el z-index correcto */
.main-content {
  position: relative;
  z-index: 2;
}
</style>
