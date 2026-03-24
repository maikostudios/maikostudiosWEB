<template>
    <section class="hero-section">
        <div class="hero-content">
            <img src="/logo/logo_maikostudio.png" alt="MaikoStudios - Soluciones Digitales Inteligentes" class="hero-logo" />

            <h1 class="hero-title">Transformamos tu Negocio con Tecnología e Inteligencia Artificial</h1>
            <p class="hero-subtitle">
                Desarrollo web, agentes de IA personalizados, automatización de marketing y asesoría legal especializada para empresas y emprendedores
            </p>

            <div class="hero-stats">
                <div class="stat-item">
                    <div class="stat-icon">
                        <img src="/maiko_icons/svg/agentes_ia.svg" alt="Agentes de IA" class="stat-svg" />
                    </div>
                    <div class="stat-label">Agentes de IA</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">
                        <img src="/maiko_icons/svg/soluciones_empresariales.svg" alt="Soluciones Empresariales" class="stat-svg" />
                    </div>
                    <div class="stat-label">Soluciones Empresariales</div>
                </div>
                <div class="stat-item">
                    <div class="stat-icon">
                        <img src="/maiko_icons/svg/asesoria_legal.svg" alt="Asesoría Legal" class="stat-svg" />
                    </div>
                    <div class="stat-label">Asesoría Legal</div>
                </div>
            </div>

            <div class="hero-buttons">
                <v-btn color="primary" size="large" class="cta-button" @click="scrollToContent">
                    <v-icon left>mdi-rocket-launch</v-icon>
                    Conoce Nuestros Servicios
                </v-btn>
                <v-btn color="secondary" variant="outlined" size="large" class="cta-button" to="/quienes-somos">
                    <v-icon left>mdi-account-group</v-icon>
                    Nuestro Equipo
                </v-btn>
            </div>
        </div>
    </section>
</template>

<script setup>
import { VBtn, VIcon } from 'vuetify/components'

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
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    background: linear-gradient(135deg, #ffffff 0%, var(--color-primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    color: #e0e0e0;
    font-weight: 300;
    line-height: 1.6;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin: 3rem 0;
    flex-wrap: wrap;
}

.stat-item {
    text-align: center;
    transition: transform 0.3s ease;
}

.stat-item:hover {
    transform: translateY(-5px);
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.stat-svg {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 0 8px rgba(0, 204, 204, 0.3));
    transition: transform 0.3s ease, filter 0.3s ease;
}

.stat-item:hover .stat-svg {
    transform: scale(1.15);
    filter: drop-shadow(0 0 16px rgba(0, 204, 204, 0.5));
}

.stat-label {
    font-size: 1rem;
    color: var(--color-primary);
    font-weight: 500;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
}

.cta-button {
    min-width: 200px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.5px;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1.1rem;
    }

    .hero-logo {
        width: 180px;
    }

    .hero-stats {
        gap: 2rem;
    }

    .stat-svg {
        width: 52px;
        height: 52px;
    }

    .stat-label {
        font-size: 0.9rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .cta-button {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .hero-section {
        padding: 4rem 1rem;
    }

    .hero-title {
        font-size: 1.8rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-stats {
        gap: 1.5rem;
    }

    .stat-svg {
        width: 44px;
        height: 44px;
    }

    .stat-label {
        font-size: 0.85rem;
    }
}

/* Para pantallas muy grandes */
@media (min-width: 1440px) {
    .hero-logo {
        width: 280px;
    }

    .hero-title {
        font-size: 3.5rem;
    }

    .hero-subtitle {
        font-size: 1.5rem;
    }

    .stat-svg {
        width: 72px;
        height: 72px;
    }

    .stat-label {
        font-size: 1.1rem;
    }
}
</style>