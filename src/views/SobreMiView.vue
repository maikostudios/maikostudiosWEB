<template>
    <BaseLayout>
        <section class="sobre-mi-page">
            <v-container>
                <!-- Reutilizar el componente SobreMi existente (ya incluye título) -->
                <SobreMi />

                <!-- Sección adicional de valores y filosofía -->
                <div class="valores-section">
                    <h2 class="section-title">Mis Valores</h2>
                    <div class="valores-grid">
                        <div class="valor-card">
                            <v-icon size="48" color="primary">mdi-lightbulb</v-icon>
                            <h3>Innovación</h3>
                            <p>Siempre buscando nuevas formas de resolver problemas y crear soluciones eficientes.</p>
                        </div>
                        <div class="valor-card">
                            <v-icon size="48" color="secondary">mdi-account-group</v-icon>
                            <h3>Colaboración</h3>
                            <p>Creo en el poder del trabajo en equipo y la comunicación efectiva.</p>
                        </div>
                        <div class="valor-card">
                            <v-icon size="48" color="accent">mdi-school</v-icon>
                            <h3>Aprendizaje</h3>
                            <p>La tecnología evoluciona constantemente, y yo evoluciono con ella.</p>
                        </div>
                    </div>
                </div>
            </v-container>
        </section>
    </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue'
import SobreMi from '@/components/SobreMi.vue'
</script>

<style scoped>
.sobre-mi-page {
    color: var(--color-text);
}

.valores-section {
    margin-top: 6rem;
    padding: 4rem 0;
}

.section-title {
    font-size: 2.5rem;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 3rem;
}

.valores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.valor-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    transition: transform 0.3s ease;
}

.valor-card:hover {
    transform: translateY(-5px);
}

.valor-card h3 {
    font-size: 1.5rem;
    color: var(--color-text);
    margin: 1rem 0;
}

.valor-card p {
    color: #cccccc;
    line-height: 1.6;
}
</style>