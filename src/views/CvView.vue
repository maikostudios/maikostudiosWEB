<template>
    <BaseLayout>
        <section class="cv-page">
            <v-container>
                <!-- Opciones de descarga -->
                <div class="cv-options">
                    <h1 class="page-title">Currículum Vitae</h1>
                    <p class="page-subtitle">Elige la opción que mejor se adapte a tus necesidades</p>

                    <div class="download-options">
                        <v-card class="option-card" elevation="2">
                            <v-card-title>
                                <v-icon color="primary" size="32">mdi-download</v-icon>
                                CV Genérico
                            </v-card-title>
                            <v-card-text>
                                Descarga mi CV estándar con toda mi experiencia y habilidades.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" block @click="descargarCVGenerico">
                                    <v-icon left>mdi-file-pdf-box</v-icon>
                                    Descargar PDF
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                        <v-card class="option-card" elevation="2">
                            <v-card-title>
                                <v-icon color="secondary" size="32">mdi-account-tie</v-icon>
                                CV Personalizado
                            </v-card-title>
                            <v-card-text>
                                Obtén un CV adaptado específicamente a tu oferta laboral.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="secondary" block @click="mostrarFormularioPersonalizado = true">
                                    <v-icon left>mdi-form-select</v-icon>
                                    Personalizar CV
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>

                <!-- Vista previa del CV -->
                <div class="cv-preview" v-if="mostrarVistaPrevia">
                    <h2>Vista Previa</h2>
                    <div class="cv-container">
                        <aside class="cv-sidebar">
                            <img src="https://avatars.githubusercontent.com/u/68249859?v=4" alt="Foto Michael">
                            <h1>Michael Esteban<br>Sáez Contreras</h1>
                            <p class="tagline">
                                Desarrollador Full Stack<br>Javascript | Nodejs | Express | Vue | React | Java |
                                Python<br>Facilitador y
                                Mentor Tecnológico
                            </p>
                        </aside>

                        <main class="cv-main">
                            <section>
                                <DatosContactoCv />
                            </section>
                            <section>
                                <PresentacionCv />
                            </section>
                        </main>

                        <ExperienciaLaboralCv />
                        <EducacionCv />
                        <HabilidadesCv />
                        <CertificacionesCv />
                    </div>

                    <div class="cv-actions">
                        <v-btn color="primary" @click="imprimirCV">
                            <v-icon left>mdi-printer</v-icon>
                            Imprimir / Guardar PDF
                        </v-btn>
                        <v-btn variant="outlined" @click="mostrarVistaPrevia = false">
                            Ocultar Vista Previa
                        </v-btn>
                    </div>
                </div>
            </v-container>
        </section>

        <!-- Dialog para CV personalizado -->
        <FormularioCVPersonalizado v-model="mostrarFormularioPersonalizado" @cv-generado="manejarCVGenerado" />
    </BaseLayout>
</template>

<script setup>
import { ref } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue'
import FormularioCVPersonalizado from '@/components/FormularioCVPersonalizado.vue'
import CertificacionesCv from '../components/cv_components/CertificacionesCv.vue'
import EducacionCv from '../components/cv_components/EducacionCv.vue'
import HabilidadesCv from '../components/cv_components/HabilidadesCv.vue'
import DatosContactoCv from '../components/cv_components/DatosContactoCv.vue'
import PresentacionCv from '../components/cv_components/PresentacionCv.vue'
import ExperienciaLaboralCv from '../components/cv_components/ExperienciaLaboralCv.vue'

// Estado del componente
const mostrarFormularioPersonalizado = ref(false)
const mostrarVistaPrevia = ref(false)

// Función para descargar CV genérico
const descargarCVGenerico = () => {
    mostrarVistaPrevia.value = true
    // Simular descarga directa del PDF genérico
    setTimeout(() => {
        window.print()
    }, 500)
}

// Función para imprimir CV
const imprimirCV = () => {
    window.print()
}

// Manejar CV generado personalizado
const manejarCVGenerado = (datosCV) => {
    console.log('CV personalizado generado:', datosCV)
    mostrarVistaPrevia.value = true
    mostrarFormularioPersonalizado.value = false
}
</script>

<style scoped>
.cv-page {
    padding: 4rem 0;
    color: var(--color-text);
}

.page-title {
    font-size: 3rem;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: var(--color-secondary);
    text-align: center;
    margin-bottom: 3rem;
}

.cv-options {
    margin-bottom: 4rem;
}

.download-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.option-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.option-card:hover {
    transform: translateY(-5px);
}

:deep(.v-card-title) {
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 1rem;
}

:deep(.v-card-text) {
    color: #cccccc;
}

.cv-preview {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cv-preview h2 {
    color: var(--color-text);
    text-align: center;
    margin-bottom: 2rem;
}

.cv-container {
    background: white;
    color: #333;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 30% 70%;
    max-width: 1100px;
    margin: 0 auto 2rem auto;
}

.cv-sidebar {
    background-color: #2a60c4;
    color: white;
    padding: 2rem 1rem;
}

.cv-sidebar img {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.cv-sidebar h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: white;
}

.cv-sidebar .tagline {
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: 1rem;
    line-height: 1.4;
}

.cv-main {
    padding: 2rem;
}

.cv-actions {
    text-align: center;
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .cv-container {
        grid-template-columns: 1fr;
    }

    .cv-sidebar {
        text-align: center;
    }

    .cv-actions {
        flex-direction: column;
        align-items: center;
    }

    .page-title {
        font-size: 2rem;
    }
}

@media print {
    .cv-page {
        padding: 0;
    }

    .cv-options,
    .cv-actions {
        display: none;
    }

    .cv-container {
        box-shadow: none;
        max-width: 100%;
        margin: 0;
    }
}
</style>