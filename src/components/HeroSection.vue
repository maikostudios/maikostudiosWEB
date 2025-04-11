<template>
    <section class="hero-section">
        <!-- Spotlight animado reutilizable -->
        <SpotlightEffect />

        <div class="hero-content">
            <img src="/logo/logo_maikostudio.png" alt="Logo Maiko Studios" class="hero-logo" />

            <h1 class="hero-title">¡Bienvenido a Maiko Studios!</h1>
            <p class="hero-subtitle">
                Aprende, crea y digitaliza tu mundo
            </p>

            <v-btn color="primary" class="mt-4" @click="scrollToContent">
                Conoce más
            </v-btn>
        </div>
    </section>
</template>

<script setup>
import { VBtn } from 'vuetify/components'
import SpotlightEffect from '@/components/SpotlightEffect.vue'

function scrollToContent() {
    const el = document.getElementById('servicios')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero-section {
    position: relative;
    background-color: #0a0a0a;
    color: #ffffff;
    padding: 6rem 1rem;
    text-align: center;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.hero-logo {
    width: 140px;
    margin-bottom: 1.5rem;
}

.hero-title {
    font-size: 2.8rem;
    font-weight: bold;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-top: 0.5rem;
    color: #ccc;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-logo {
        width: 120px;
    }
}
</style>