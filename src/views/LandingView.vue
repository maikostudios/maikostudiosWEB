<template>
  <div class="landing-view">
    <v-container class="pt-10 pb-16">
      <div class="hero text-center mb-6">
        <v-chip color="secondary" variant="elevated" class="mb-3">MaikoStudios</v-chip>
        <h2 class="hero-title">Todo lo que necesitas para digitalizar tu negocio</h2>
        <p class="hero-sub">Web + Marketing + IA — rápido, claro y sin fricción</p>
      </div>

      <LandingMenu />
    </v-container>
  </div>
</template>

<script setup>
import LandingMenu from '@/components/LandingMenu.vue'
</script>

<style scoped>
.landing-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #0a0a0a 100%);
}
.hero-title { font-weight: 800; font-size: clamp(1.4rem, 2.5vw, 2rem); }
.hero-sub { color: #a8b3c1; }
</style>

