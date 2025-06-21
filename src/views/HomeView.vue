<script setup>
import { onMounted } from 'vue'

import HeroSection from '@/components/HeroSection.vue'
import SobreMi from '@/components/SobreMi.vue'
import Servicios from '@/components/Servicios.vue'
import ProyectoEstrella from '@/components/ProyectoEstrella.vue'
import Contacto from '@/components/Contacto.vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import { useSEO } from '@/composables/useSEO'

const { setSEO } = useSEO()

onMounted(() => {
  setSEO()
})
</script>

<template>
  <div class="home-container">
    <Navbar />
    <HeroSection />
    <SobreMi />
    <Servicios />
    <ProyectoEstrella />
    <Contacto />
    <Footer />
  </div>
</template>

<style scoped>
.home-container {
  background: transparent;
  min-height: 100vh;
  position: relative;
  z-index: 2;
}
</style>