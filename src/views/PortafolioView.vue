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
                                alt="De Una Transferencias" />
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
                                    alt="E-commerce" />
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
                                    alt="Dashboard" />
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
                                    alt="App Móvil" />
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
                                <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
                                    alt="API" />
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