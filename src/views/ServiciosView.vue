<template>
    <BaseLayout>
        <section class="servicios-page">
            <v-container>
                <div class="page-header">
                    <h1 class="page-title">Servicios</h1>
                    <p class="page-subtitle">Soluciones tecnológicas integrales para impulsar tu negocio</p>
                </div>

                <!-- Servicios principales -->
                <div class="servicios-principales">
                    <div class="servicio-destacado">
                        <v-card class="servicio-card empresarial" elevation="4">
                            <v-card-title class="card-header">
                                <img src="/maiko_icons/svg/soluciones_empresariales.svg" alt="Para Empresas" class="service-header-svg" />
                                <div>
                                    <h2>Para Empresas</h2>
                                    <p>Soluciones escalables y robustas</p>
                                </div>
                            </v-card-title>

                            <v-card-text>
                                <div class="servicios-lista">
                                    <div v-for="servicio in serviciosEmpresariales" 
                                         :key="servicio.id" 
                                         class="servicio-item" 
                                         :class="{ destacado: servicio.tags.some(t => t.text === 'DESTACADO'), legal: servicio.isLegal }">
                                        <img :src="servicio.icon" :alt="servicio.title" class="servicio-item-svg" />
                                        <div>
                                            <h4>
                                                <img :src="servicio.icon" alt="" class="inline-service-svg" /> 
                                                {{ servicio.title }} 
                                                <v-chip 
                                                    v-for="(tag, index) in servicio.tags" 
                                                    :key="index" 
                                                    size="x-small" 
                                                    :color="tag.color" 
                                                    class="ml-2">
                                                    {{ tag.text }}
                                                </v-chip>
                                            </h4>
                                            <p>{{ servicio.longDescription }}</p>
                                            
                                            <div v-if="servicio.beneficios && servicio.beneficios.length > 0" class="beneficios">
                                                <p v-for="(beneficio, i) in servicio.beneficios" :key="i" class="beneficio">✓ {{ beneficio }}</p>
                                            </div>
                                            
                                            <div class="tecnologias">
                                                <template v-for="(tech, i) in servicio.tecnologias" :key="i">
                                                    <v-chip v-if="typeof tech === 'string'" size="small">{{ tech }}</v-chip>
                                                    <v-chip v-else size="small" :color="tech.color">{{ tech.text }}</v-chip>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="primary" size="large" block to="/contacto">
                                    <v-icon left>mdi-email</v-icon>
                                    Consultar Servicios Empresariales
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>

                    <div class="servicio-destacado">
                        <v-card class="servicio-card freelance" elevation="4">
                            <v-card-title class="card-header">
                                <img src="/maiko_icons/svg/mentoria_tecnologica.svg" alt="Para Particulares" class="service-header-svg" />
                                <div>
                                    <h2>Para Particulares</h2>
                                    <p>Soluciones accesibles y personalizadas</p>
                                </div>
                            </v-card-title>

                            <v-card-text>
                                <div class="servicios-lista">
                                    <div v-for="servicio in serviciosParticulares" 
                                         :key="servicio.id" 
                                         class="servicio-item" 
                                         :class="{ destacado: servicio.tags.some(t => t.text === 'DESTACADO'), legal: servicio.isLegal }">
                                        <img :src="servicio.icon" :alt="servicio.title" class="servicio-item-svg" />
                                        <div>
                                            <h4>
                                                <img :src="servicio.icon" alt="" class="inline-service-svg" /> 
                                                {{ servicio.title }} 
                                                <v-chip 
                                                    v-for="(tag, index) in servicio.tags" 
                                                    :key="index" 
                                                    size="x-small" 
                                                    :color="tag.color" 
                                                    class="ml-2">
                                                    {{ tag.text }}
                                                </v-chip>
                                            </h4>
                                            <p>{{ servicio.longDescription }}</p>
                                            
                                            <div v-if="servicio.beneficios && servicio.beneficios.length > 0" class="beneficios">
                                                <p v-for="(beneficio, i) in servicio.beneficios" :key="i" class="beneficio">✓ {{ beneficio }}</p>
                                            </div>
                                            
                                            <div class="tecnologias">
                                                <template v-for="(tech, i) in servicio.tecnologias" :key="i">
                                                    <v-chip v-if="typeof tech === 'string'" size="small">{{ tech }}</v-chip>
                                                    <v-chip v-else size="small" :color="tech.color">{{ tech.text }}</v-chip>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="secondary" size="large" block to="/contacto">
                                    <v-icon left>mdi-whatsapp</v-icon>
                                    Ver Servicios para Particulares
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>

                <!-- Proceso de trabajo -->
                <div class="proceso-trabajo">
                    <h2 class="section-title">¿Cómo Trabajamos?</h2>
                    <div class="proceso-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <h3>Análisis</h3>
                            <p>Entendemos tus necesidades y objetivos para diseñar la solución perfecta.</p>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <h3>Desarrollo</h3>
                            <p>Creamos tu solución usando las mejores tecnologías y prácticas del mercado.</p>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <h3>Entrega</h3>
                            <p>Implementamos y te capacitamos para que aproveches al máximo tu nueva herramienta.</p>
                        </div>
                        <div class="step">
                            <div class="step-number">4</div>
                            <h3>Soporte</h3>
                            <p>Te acompañamos con mantenimiento y mejoras continuas para tu tranquilidad.</p>
                        </div>
                    </div>
                </div>

                <!-- Call to action -->
                <div class="cta-section">
                    <v-card class="cta-card" elevation="8">
                        <v-card-text class="text-center">
                            <h2>¿Listo para digitalizar tu negocio?</h2>
                            <p>Conversemos sobre tu proyecto y descubre cómo podemos ayudarte a alcanzar tus objetivos.
                            </p>
                            <div class="cta-buttons">
                                <v-btn color="green" size="large" href="https://wa.me/56920648446" target="_blank">
                                    <v-icon left>mdi-whatsapp</v-icon>
                                    WhatsApp
                                </v-btn>
                                <v-btn color="primary" variant="outlined" size="large" to="/contacto">
                                    <v-icon left>mdi-email</v-icon>
                                    Solicitar Cotización
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-container>
        </section>
    </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue'
import { serviciosEmpresariales, serviciosParticulares } from '@/data/servicios.js'
</script>

<style scoped>
.servicios-page {
    padding: 4rem 0;
    color: var(--color-text);
}

.page-header {
    text-align: center;
    margin-bottom: 4rem;
}

.page-title {
    font-size: 3rem;
    color: var(--color-text);
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: var(--color-secondary);
}

.servicios-principales {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 3rem;
    margin-bottom: 6rem;
}

.servicio-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
}

.servicio-card:hover {
    transform: translateY(-5px);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
}

.card-header div h2 {
    color: var(--color-text);
    margin: 0;
    font-size: 1.5rem;
}

.card-header div p {
    color: #cccccc;
    margin: 0.5rem 0 0 0;
}

.servicios-lista {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.servicio-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.servicio-item:hover {
    background: rgba(255, 255, 255, 0.03);
}

.servicio-item.destacado {
    background: linear-gradient(135deg, rgba(0, 102, 255, 0.08), rgba(0, 204, 204, 0.08));
    border: 1px solid rgba(0, 204, 204, 0.2);
}

.servicio-item.legal {
    background: linear-gradient(135deg, rgba(0, 204, 204, 0.08), rgba(0, 102, 255, 0.08));
    border: 1px solid rgba(0, 102, 255, 0.2);
}

.servicio-item h4 {
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.servicio-item p {
    color: #cccccc;
    margin: 0 0 1rem 0;
    line-height: 1.6;
}

.beneficios {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    border-left: 3px solid var(--color-primary);
}

.beneficio {
    color: #e0e0e0;
    margin: 0.5rem 0;
    font-size: 0.95rem;
}

.tecnologias {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.service-header-svg {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(0, 204, 204, 0.3));
}

.servicio-item-svg {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    margin-top: 0.2rem;
    filter: drop-shadow(0 0 4px rgba(0, 204, 204, 0.2));
}

.inline-service-svg {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 0.15rem;
    filter: drop-shadow(0 0 3px rgba(0, 204, 204, 0.2));
}

.proceso-trabajo {
    margin: 6rem 0;
    text-align: center;
}

.section-title {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: 3rem;
}

.proceso-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.step {
    text-align: center;
    padding: 2rem;
}

.step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 auto 1rem auto;
}

.step h3 {
    color: var(--color-text);
    margin: 1rem 0;
    font-size: 1.3rem;
}

.step p {
    color: #cccccc;
    line-height: 1.6;
}

.cta-section {
    margin-top: 6rem;
}

.cta-card {
    background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(0, 204, 204, 0.1)) !important;
    border: 1px solid rgba(0, 102, 255, 0.3);
    padding: 2rem;
}

.cta-card h2 {
    color: var(--color-text);
    margin-bottom: 1rem;
    font-size: 2rem;
}

.cta-card p {
    color: #cccccc;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

:deep(.v-card-title) {
    color: var(--color-text);
}

:deep(.v-card-text) {
    color: #cccccc;
}

@media (max-width: 768px) {
    .servicios-principales {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .proceso-steps {
        grid-template-columns: repeat(2, 1fr);
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }

    .page-title {
        font-size: 2rem;
    }

    .section-title {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .proceso-steps {
        grid-template-columns: 1fr;
    }

    .servicio-item {
        flex-direction: column;
        text-align: center;
    }
}
</style>