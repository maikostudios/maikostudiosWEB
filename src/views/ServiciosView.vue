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
                                <v-icon size="48" color="primary">mdi-office-building</v-icon>
                                <div>
                                    <h2>Para Empresas</h2>
                                    <p>Soluciones escalables y robustas</p>
                                </div>
                            </v-card-title>

                            <v-card-text>
                                <div class="servicios-lista">
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-web</v-icon>
                                        <div>
                                            <h4>Desarrollo Web a Medida</h4>
                                            <p>Aplicaciones web personalizadas que optimizan tus procesos de negocio y
                                                mejoran la experiencia del usuario.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Vue.js</v-chip>
                                                <v-chip size="small">React</v-chip>
                                                <v-chip size="small">Node.js</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-chart-line</v-icon>
                                        <div>
                                            <h4>Consultoría Tecnológica</h4>
                                            <p>Asesoramiento experto para la transformación digital de tu empresa y
                                                optimización de procesos.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Análisis</v-chip>
                                                <v-chip size="small">Estrategia</v-chip>
                                                <v-chip size="small">Implementación</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-cog</v-icon>
                                        <div>
                                            <h4>Integración de Sistemas</h4>
                                            <p>Conectamos tus aplicaciones existentes con nuevas soluciones para un
                                                flujo de trabajo eficiente.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">APIs</v-chip>
                                                <v-chip size="small">Webhooks</v-chip>
                                                <v-chip size="small">Microservicios</v-chip>
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
                                <v-icon size="48" color="secondary">mdi-account-group</v-icon>
                                <div>
                                    <h2>Para Particulares</h2>
                                    <p>Soluciones accesibles y personalizadas</p>
                                </div>
                            </v-card-title>

                            <v-card-text>
                                <div class="servicios-lista">
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-palette</v-icon>
                                        <div>
                                            <h4>Diseño Web para Emprendedores</h4>
                                            <p>Sitios web profesionales y adaptables que reflejan la identidad de tu
                                                negocio y atraen clientes.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Responsive</v-chip>
                                                <v-chip size="small">SEO</v-chip>
                                                <v-chip size="small">Performance</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-school</v-icon>
                                        <div>
                                            <h4>Mentoría Tecnológica</h4>
                                            <p>Aprende desarrollo web con sesiones personalizadas y acelera tu carrera
                                                en tecnología.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">JavaScript</v-chip>
                                                <v-chip size="small">Vue.js</v-chip>
                                                <v-chip size="small">Python</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-tools</v-icon>
                                        <div>
                                            <h4>Soporte Técnico</h4>
                                            <p>Asistencia dedicada para mantener tus proyectos digitales funcionando de
                                                manera óptima.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Mantenimiento</v-chip>
                                                <v-chip size="small">Actualizaciones</v-chip>
                                                <v-chip size="small">Monitoreo</v-chip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="secondary" size="large" block to="/contacto">
                                    <v-icon left>mdi-whatsapp</v-icon>
                                    Ver Servicios Freelance
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
                                <v-btn color="primary" size="large" to="/contacto">
                                    <v-icon left>mdi-email</v-icon>
                                    Solicitar Cotización
                                </v-btn>
                                <v-btn color="secondary" variant="outlined" size="large"
                                    href="https://wa.me/56949475207" target="_blank">
                                    <v-icon left>mdi-whatsapp</v-icon>
                                    WhatsApp
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
}

.servicio-item h4 {
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
}

.servicio-item p {
    color: #cccccc;
    margin: 0 0 1rem 0;
    line-height: 1.6;
}

.tecnologias {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
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