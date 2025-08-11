<template>
  <div class="landing-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="hero-container">
        <div class="hero-content">
          <img
            src="/logo/logo_maikostudio.png"
            alt="MaikoStudios"
            class="hero-logo"
          />
          <h1 class="hero-title">Impulsa tu negocio digital</h1>
          <p class="hero-subtitle">Desarrollo web, marketing digital y automatización con IA</p>
        </div>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <v-container>
        <LandingMenu />
      </v-container>
    </section>
  </div>
</template>

<script setup>
import LandingMenu from '@/components/LandingMenu.vue'
</script>

<style scoped>
.landing-view {
  min-height: 100vh;
  background: transparent;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  padding: 2rem 0 1rem;
  background: transparent;
}

.hero-container {
  max-width: 100% !important;
  padding: 0 1rem;
}

.hero-content {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.hero-logo {
  width: 80px;
  height: auto;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 12px rgba(0, 204, 204, 0.3));
}

.hero-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: #a8b3c1;
  margin-bottom: 0;
  line-height: 1.4;
}

/* CTA Section */
.cta-section {
  background: transparent;
  padding: 1rem 0 2rem;
}

/* Responsive */
@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem 0 0.5rem;
  }

  .hero-logo {
    width: 70px;
  }

  .cta-section {
    padding: 0.5rem 0 2rem;
  }
}
</style>

