<template>
    <BaseLayout>
        <section class="portafolio-page">
            <v-container>
                <div class="page-header">
                    <h1 class="page-title">Portafolio</h1>
                    <p class="page-subtitle">Proyectos que demuestran experiencia y calidad en desarrollo</p>
                </div>

                <!-- Proyecto estrella -->
                <div class="proyecto-estrella">
                    <v-card class="proyecto-card destacado" elevation="8">
                        <div class="proyecto-imagen">
                            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                                alt="De Una Transferencias" loading="lazy" decoding="async" />
                            <div class="proyecto-overlay">
                                <v-chip color="accent" size="large">
                                    <v-icon left>mdi-star</v-icon>
                                    Proyecto Estrella
                                </v-chip>
                            </div>
                        </div>
                        <div class="proyecto-contenido">
                            <div class="proyecto-info">
                                <h2>De Una Transferencias</h2>
                                <p class="proyecto-descripcion">
                                    Sistema SaaS completo para gestión de transferencias financieras y administración de
                                    cuentas.
                                    Incluye dashboard administrativo, API REST, autenticación segura y reportes en
                                    tiempo real.
                                </p>

                                <div class="proyecto-caracteristicas">
                                    <div class="caracteristica">
                                        <v-icon color="primary">mdi-shield-check</v-icon>
                                        <span>Seguridad bancaria</span>
                                    </div>
                                    <div class="caracteristica">
                                        <v-icon color="primary">mdi-chart-line</v-icon>
                                        <span>Reportes en tiempo real</span>
                                    </div>
                                    <div class="caracteristica">
                                        <v-icon color="primary">mdi-api</v-icon>
                                        <span>API REST completa</span>
                                    </div>
                                    <div class="caracteristica">
                                        <v-icon color="primary">mdi-responsive</v-icon>
                                        <span>Diseño responsive</span>
                                    </div>
                                </div>

                                <div class="tech-stack">
                                    <h4>Tecnologías utilizadas:</h4>
                                    <div class="tech-chips">
                                        <v-chip color="primary" variant="outlined">Vue.js 3</v-chip>
                                        <v-chip color="primary" variant="outlined">Node.js</v-chip>
                                        <v-chip color="primary" variant="outlined">Express</v-chip>
                                        <v-chip color="primary" variant="outlined">PostgreSQL</v-chip>
                                        <v-chip color="primary" variant="outlined">Firebase</v-chip>
                                        <v-chip color="primary" variant="outlined">JWT Auth</v-chip>
                                    </div>
                                </div>

                                <div class="proyecto-acciones">
                                    <v-btn color="primary" size="large">
                                        <v-icon left>mdi-eye</v-icon>
                                        Ver Demo
                                    </v-btn>
                                    <v-btn color="secondary" variant="outlined" size="large" to="/contacto">
                                        <v-icon left>mdi-email</v-icon>
                                        Solicitar Info
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </div>

                <!-- Otros proyectos -->
                <div class="otros-proyectos">
                    <h2 class="section-title">Otros Proyectos</h2>

                    <div class="proyectos-grid">
                        <v-card class="proyecto-card" elevation="4">
                            <div class="proyecto-imagen">
                                <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
                                    alt="E-commerce" loading="lazy" decoding="async" />
                            </div>
                            <div class="proyecto-info">
                                <h3>E-commerce Moderno</h3>
                                <p>Tienda online con carrito de compras, integración de pagos y panel administrativo
                                    completo.</p>
                                <div class="tech-stack-small">
                                    <v-chip size="small">React</v-chip>
                                    <v-chip size="small">Stripe</v-chip>
                                    <v-chip size="small">MongoDB</v-chip>
                                </div>
                                <div class="proyecto-links">
                                    <v-btn color="primary" variant="outlined" size="small">
                                        <v-icon left>mdi-eye</v-icon>
                                        Ver
                                    </v-btn>
                                    <v-btn color="secondary" variant="text" size="small">
                                        <v-icon left>mdi-github</v-icon>
                                        Código
                                    </v-btn>
                                </div>
                            </div>
                        </v-card>

                        <v-card class="proyecto-card" elevation="4">
                            <div class="proyecto-imagen">
                                <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                                    alt="Dashboard" loading="lazy" decoding="async" />
                            </div>
                            <div class="proyecto-info">
                                <h3>Dashboard Analítico</h3>
                                <p>Panel de control con métricas en tiempo real, gráficos interactivos y reportes
                                    automatizados.</p>
                                <div class="tech-stack-small">
                                    <v-chip size="small">Vue.js</v-chip>
                                    <v-chip size="small">Chart.js</v-chip>
                                    <v-chip size="small">Python</v-chip>
                                </div>
                                <div class="proyecto-links">
                                    <v-btn color="primary" variant="outlined" size="small">
                                        <v-icon left>mdi-eye</v-icon>
                                        Ver
                                    </v-btn>
                                    <v-btn color="secondary" variant="text" size="small">
                                        <v-icon left>mdi-github</v-icon>
                                        Código
                                    </v-btn>
                                </div>
                            </div>
                        </v-card>

                        <v-card class="proyecto-card" elevation="4">
                            <div class="proyecto-imagen">
                                <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                                    alt="App Móvil" loading="lazy" decoding="async" />
                            </div>
                            <div class="proyecto-info">
                                <h3>App de Gestión</h3>
                                <p>Aplicación móvil para gestión de tareas con sincronización en la nube y
                                    notificaciones push.</p>
                                <div class="tech-stack-small">
                                    <v-chip size="small">React Native</v-chip>
                                    <v-chip size="small">Firebase</v-chip>
                                    <v-chip size="small">Redux</v-chip>
                                </div>
                                <div class="proyecto-links">
                                    <v-btn color="primary" variant="outlined" size="small">
                                        <v-icon left>mdi-eye</v-icon>
                                        Ver
                                    </v-btn>
                                    <v-btn color="secondary" variant="text" size="small">
                                        <v-icon left>mdi-github</v-icon>
                                        Código
                                    </v-btn>
                                </div>
                            </div>
                        </v-card>

                        <v-card class="proyecto-card" elevation="4">
                            <div class="proyecto-imagen">
                                <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" alt="API"
                                    loading="lazy" decoding="async" />
                            </div>
                            <div class="proyecto-info">
                                <h3>API Microservicios</h3>
                                <p>Arquitectura de microservicios escalable con documentación automática y testing
                                    integrado.</p>
                                <div class="tech-stack-small">
                                    <v-chip size="small">Node.js</v-chip>
                                    <v-chip size="small">Docker</v-chip>
                                    <v-chip size="small">PostgreSQL</v-chip>
                                </div>
                                <div class="proyecto-links">
                                    <v-btn color="primary" variant="outlined" size="small">
                                        <v-icon left>mdi-eye</v-icon>
                                        Ver
                                    </v-btn>
                                    <v-btn color="secondary" variant="text" size="small">
                                        <v-icon left>mdi-github</v-icon>
                                        Código
                                    </v-btn>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </div>

                <!-- Habilidades técnicas -->
                <div class="habilidades-section">
                    <h2 class="section-title">Habilidades Técnicas</h2>
                    <div class="habilidades-grid">
                        <div class="habilidad-categoria">
                            <h3>Frontend</h3>
                            <div class="habilidades-lista">
                                <div class="habilidad">
                                    <span>Vue.js</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 95%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>React</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 85%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>JavaScript</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 90%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>CSS/SASS</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 88%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="habilidad-categoria">
                            <h3>Backend</h3>
                            <div class="habilidades-lista">
                                <div class="habilidad">
                                    <span>Node.js</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 90%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Python</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 85%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Java</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 80%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Express</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 88%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="habilidad-categoria">
                            <h3>Base de Datos</h3>
                            <div class="habilidades-lista">
                                <div class="habilidad">
                                    <span>PostgreSQL</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 85%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>MongoDB</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 80%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Firebase</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 90%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Redis</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 75%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="habilidad-categoria">
                            <h3>DevOps & Tools</h3>
                            <div class="habilidades-lista">
                                <div class="habilidad">
                                    <span>Git</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 92%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>Docker</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 78%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>AWS</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 70%"></div>
                                    </div>
                                </div>
                                <div class="habilidad">
                                    <span>CI/CD</span>
                                    <div class="nivel">
                                        <div class="barra" style="width: 75%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Call to action -->
                <div class="cta-section">
                    <v-card class="cta-card" elevation="8">
                        <v-card-text class="text-center">
                            <h2>¿Te interesa trabajar conmigo?</h2>
                            <p>Revisa mi CV completo o contacta directamente para discutir tu proyecto.</p>
                            <div class="cta-buttons">
                                <v-btn color="primary" size="large" to="/cv">
                                    <v-icon left>mdi-file-document</v-icon>
                                    Ver CV Completo
                                </v-btn>
                                <v-btn color="secondary" variant="outlined" size="large" to="/contacto">
                                    <v-icon left>mdi-email</v-icon>
                                    Contactar
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
.portafolio-page {
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

/* Proyecto estrella */
.proyecto-estrella {
    margin-bottom: 6rem;
}

.proyecto-card.destacado {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(0, 204, 204, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proyecto-card.destacado:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 204, 204, 0.2);
}

.proyecto-imagen {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
}

.proyecto-imagen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
}

.proyecto-card:hover .proyecto-imagen img {
    transform: scale(1.05);
}

.proyecto-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
}

.proyecto-contenido {
    padding: 2rem;
}

.proyecto-descripcion {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: #cccccc;
}

.proyecto-caracteristicas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.caracteristica {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #cccccc;
}

.tech-stack h4 {
    color: var(--color-text);
    margin-bottom: 1rem;
}

.tech-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.proyecto-acciones {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Otros proyectos */
.otros-proyectos {
    margin-bottom: 6rem;
}

.section-title {
    font-size: 2.5rem;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 3rem;
}

.proyectos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.proyecto-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.proyecto-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.proyecto-card .proyecto-imagen {
    height: 200px;
    border-radius: 0;
}

.proyecto-info {
    padding: 1.5rem;
}

.proyecto-info h3 {
    color: var(--color-text);
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.proyecto-info p {
    color: #cccccc;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.tech-stack-small {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.proyecto-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* Habilidades técnicas */
.habilidades-section {
    margin-bottom: 6rem;
}

.habilidades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.habilidad-categoria {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.habilidad-categoria h3 {
    color: var(--color-primary);
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
}

.habilidades-lista {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.habilidad {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.habilidad span {
    color: var(--color-text);
    font-weight: 500;
}

.nivel {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.barra {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
}

/* Call to action */
.cta-section {
    text-align: center;
}

.cta-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .proyectos-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .habilidades-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .page-title {
        font-size: 2.5rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .proyectos-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .proyecto-imagen {
        height: 250px;
    }

    .proyecto-card .proyecto-imagen {
        height: 180px;
    }

    .proyecto-caracteristicas {
        grid-template-columns: 1fr;
    }

    .proyecto-acciones {
        flex-direction: column;
    }

    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }

    .habilidades-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .portafolio-page {
        padding: 2rem 0;
    }

    .page-title {
        font-size: 2rem;
    }

    .section-title {
        font-size: 1.8rem;
    }

    .proyecto-contenido {
        padding: 1.5rem;
    }

    .proyecto-info {
        padding: 1rem;
    }

    .habilidad-categoria {
        padding: 1.5rem;
    }
}
</style>