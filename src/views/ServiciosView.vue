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
                                    <!-- Agentes de IA -->
                                    <div class="servicio-item destacado">
                                        <v-icon color="primary" size="32">mdi-robot</v-icon>
                                        <div>
                                            <h4>🤖 Agentes de IA Personalizados <v-chip size="x-small" color="primary">DESTACADO</v-chip></h4>
                                            <p>Asistentes virtuales con ChatGPT y Gemini adaptados a tu modelo de negocio. Automatización de atención al cliente, ventas y soporte técnico con integración a tus sistemas existentes (CRM, bases de datos, APIs).</p>
                                            <div class="beneficios">
                                                <p class="beneficio">✓ Atención 24/7 automatizada</p>
                                                <p class="beneficio">✓ Calificación de leads inteligente</p>
                                                <p class="beneficio">✓ Reducción de costos operativos</p>
                                            </div>
                                            <div class="tecnologias">
                                                <v-chip size="small">ChatGPT API</v-chip>
                                                <v-chip size="small">Gemini</v-chip>
                                                <v-chip size="small">LangChain</v-chip>
                                                <v-chip size="small">Genkit</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Desarrollo Web -->
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-web</v-icon>
                                        <div>
                                            <h4>Desarrollo Web a Medida</h4>
                                            <p>Aplicaciones web personalizadas que optimizan tus procesos de negocio y mejoran la experiencia del usuario.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Vue.js</v-chip>
                                                <v-chip size="small">React</v-chip>
                                                <v-chip size="small">Node.js</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Consultoría + Analytics -->
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-chart-line</v-icon>
                                        <div>
                                            <h4>📊 Consultoría Tecnológica + Analytics</h4>
                                            <p>Asesoramiento experto para la transformación digital de tu empresa. Configuración de Google Analytics 4 para análisis de datos y toma de decisiones informadas.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Análisis</v-chip>
                                                <v-chip size="small">Estrategia</v-chip>
                                                <v-chip size="small">GA4</v-chip>
                                                <v-chip size="small">Implementación</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Integración de Sistemas -->
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-cog</v-icon>
                                        <div>
                                            <h4>Integración de Sistemas</h4>
                                            <p>Conectamos tus aplicaciones existentes con nuevas soluciones para un flujo de trabajo eficiente.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">APIs</v-chip>
                                                <v-chip size="small">Webhooks</v-chip>
                                                <v-chip size="small">Microservicios</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Automatización de Marketing -->
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-robot-outline</v-icon>
                                        <div>
                                            <h4>💬 Automatización de Marketing <v-chip size="x-small" color="primary">NUEVO</v-chip></h4>
                                            <p>Automatización de mensajes en WhatsApp y redes sociales para generación de leads y aumento de ventas. Respuestas automáticas y seguimiento de clientes potenciales.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">WhatsApp Business API</v-chip>
                                                <v-chip size="small">Meta Business Suite</v-chip>
                                                <v-chip size="small">n8n</v-chip>
                                                <v-chip size="small">Make</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Campañas en Redes Sociales -->
                                    <div class="servicio-item">
                                        <v-icon color="primary">mdi-bullhorn</v-icon>
                                        <div>
                                            <h4>📱 Campañas en Redes Sociales <v-chip size="x-small" color="primary">NUEVO</v-chip></h4>
                                            <p>Diseño y gestión de campañas publicitarias en redes sociales para aumentar tu visibilidad y captar clientes potenciales.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Facebook Ads</v-chip>
                                                <v-chip size="small">Instagram Ads</v-chip>
                                                <v-chip size="small">LinkedIn Ads</v-chip>
                                                <v-chip size="small">Google Ads</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Asesoría Legal Empresarial -->
                                    <div class="servicio-item legal">
                                        <v-icon color="secondary" size="32">mdi-scale-balance</v-icon>
                                        <div>
                                            <h4>⚖️ Asesoría Legal Empresarial <v-chip size="x-small" color="secondary">NUEVO</v-chip></h4>
                                            <p>Respaldo jurídico especializado en derecho comercial, contratos tecnológicos y propiedad intelectual. Protege tu negocio digital desde el inicio.</p>
                                            <div class="beneficios">
                                                <p class="beneficio">✓ Contratos tecnológicos a medida</p>
                                                <p class="beneficio">✓ Protección de propiedad intelectual</p>
                                                <p class="beneficio">✓ Cumplimiento normativo</p>
                                            </div>
                                            <div class="tecnologias">
                                                <v-chip size="small" color="secondary">Derecho Comercial</v-chip>
                                                <v-chip size="small" color="secondary">Propiedad Intelectual</v-chip>
                                                <v-chip size="small" color="secondary">Contratos</v-chip>
                                                <v-chip size="small" color="secondary">Compliance</v-chip>
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
                                    <!-- Diseño Web -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-palette</v-icon>
                                        <div>
                                            <h4>Diseño Web para Emprendedores</h4>
                                            <p>Sitios web profesionales y adaptables que reflejan la identidad de tu negocio y atraen clientes.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Responsive</v-chip>
                                                <v-chip size="small">SEO</v-chip>
                                                <v-chip size="small">Performance</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Asistente Virtual con IA -->
                                    <div class="servicio-item destacado">
                                        <v-icon color="secondary" size="32">mdi-robot</v-icon>
                                        <div>
                                            <h4>🤖 Asistente Virtual con IA <v-chip size="x-small" color="secondary">DESTACADO</v-chip></h4>
                                            <p>ChatGPT y Gemini Gems personalizados para tu negocio. Automatiza atención al cliente, reservas, consultas y más con inteligencia artificial.</p>
                                            <div class="beneficios">
                                                <p class="beneficio">✓ Configuración personalizada</p>
                                                <p class="beneficio">✓ Sin conocimientos técnicos</p>
                                                <p class="beneficio">✓ Soporte continuo</p>
                                            </div>
                                            <div class="tecnologias">
                                                <v-chip size="small">ChatGPT</v-chip>
                                                <v-chip size="small">Gemini Gems</v-chip>
                                                <v-chip size="small">Prompts personalizados</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Mentoría -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-school</v-icon>
                                        <div>
                                            <h4>Mentoría Tecnológica</h4>
                                            <p>Aprende desarrollo web con sesiones personalizadas y acelera tu carrera en tecnología.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">JavaScript</v-chip>
                                                <v-chip size="small">Vue.js</v-chip>
                                                <v-chip size="small">Python</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Configuración de Analytics -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-google-analytics</v-icon>
                                        <div>
                                            <h4>📈 Configuración de Analytics <v-chip size="x-small" color="secondary">NUEVO</v-chip></h4>
                                            <p>Instalación y configuración de Google Analytics 4 para entender a tus visitantes y mejorar tu estrategia digital.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">GA4</v-chip>
                                                <v-chip size="small">Tag Manager</v-chip>
                                                <v-chip size="small">Looker Studio</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Automatización de Contacto -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-message-processing</v-icon>
                                        <div>
                                            <h4>💬 Automatización de Contacto <v-chip size="x-small" color="secondary">NUEVO</v-chip></h4>
                                            <p>Respuestas automáticas en WhatsApp Business y captura de leads con chatbots y formularios inteligentes.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">WhatsApp Business</v-chip>
                                                <v-chip size="small">Chatbots</v-chip>
                                                <v-chip size="small">Formularios</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Asesoría Legal -->
                                    <div class="servicio-item legal">
                                        <v-icon color="primary" size="32">mdi-scale-balance</v-icon>
                                        <div>
                                            <h4>⚖️ Asesoría Legal para Emprendedores <v-chip size="x-small" color="primary">NUEVO</v-chip></h4>
                                            <p>Asesoría legal especializada para formalizar tu emprendimiento, proteger tu marca y crear contratos seguros.</p>
                                            <div class="beneficios">
                                                <p class="beneficio">✓ Constitución de empresas</p>
                                                <p class="beneficio">✓ Contratos estándar</p>
                                                <p class="beneficio">✓ Protección de marca</p>
                                            </div>
                                            <div class="tecnologias">
                                                <v-chip size="small" color="primary">Derecho Emprendedor</v-chip>
                                                <v-chip size="small" color="primary">Contratos</v-chip>
                                                <v-chip size="small" color="primary">Propiedad Intelectual</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Soporte Técnico -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-tools</v-icon>
                                        <div>
                                            <h4>Soporte Técnico</h4>
                                            <p>Asistencia dedicada para mantener tus proyectos digitales funcionando de manera óptima.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Mantenimiento</v-chip>
                                                <v-chip size="small">Actualizaciones</v-chip>
                                                <v-chip size="small">Monitoreo</v-chip>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Armado de PC Gamers -->
                                    <div class="servicio-item">
                                        <v-icon color="secondary">mdi-desktop-tower</v-icon>
                                        <div>
                                            <h4>🎮 Armado de PC Gamers</h4>
                                            <p>Configuraciones personalizadas para gaming, streaming y trabajo profesional con componentes de última generación.</p>
                                            <div class="tecnologias">
                                                <v-chip size="small">Gaming</v-chip>
                                                <v-chip size="small">Streaming</v-chip>
                                                <v-chip size="small">Workstation</v-chip>
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