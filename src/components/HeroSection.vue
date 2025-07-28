<template>
    <section class="hero-section">
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

function scrollToContent() {
    const el = document.getElementById('servicios')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero-section {
    position: relative;
    background: transparent;
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
    width: 220px;
    height: auto;
    margin-bottom: 2rem;
    transition: transform 0.3s ease;
}

.hero-logo:hover {
    transform: scale(1.05);
}

.hero-title {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.4rem;
    margin-top: 0.5rem;
    color: #ccc;
    font-weight: 300;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1.2rem;
    }

    .hero-logo {
        width: 180px;
    }
}

/* Para pantallas muy grandes */
@media (min-width: 1440px) {
    .hero-logo {
        width: 280px;
    }

    .hero-title {
        font-size: 4rem;
    }

    .hero-subtitle {
        font-size: 1.6rem;
    }
}
</style>