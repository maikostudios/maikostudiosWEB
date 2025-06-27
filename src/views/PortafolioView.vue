<template>
    <BaseLayout>
        <section class="portafolio-page">
            <v-container>
                <div class="page-header">
                    <h1 class="page-title">Portafolio</h1>
                    <p class="page-subtitle">Proyectos que demuestran experiencia y calidad en desarrollo</p>
                </div>

                <!-- Estado de carga -->
                <div v-if="loading" class="loading-state">
                    <v-row justify="center">
                        <v-col cols="12" class="text-center">
                            <v-progress-circular indeterminate color="primary" size="64" />
                            <p class="mt-4">Cargando proyectos...</p>
                        </v-col>
                    </v-row>
                </div>

                <!-- Estado de error -->
                <div v-else-if="error" class="error-state">
                    <v-alert type="error" variant="outlined">
                        <v-icon>mdi-alert-circle</v-icon>
                        Error al cargar proyectos: {{ error }}
                    </v-alert>
                </div>

                <!-- Contenido principal -->
                <div v-else>

                    <!-- Proyecto estrella -->
                    <div v-if="proyectoEstrella" class="proyecto-estrella">
                        <v-card class="proyecto-card destacado" elevation="8">
                            <div class="proyecto-imagen">
                                <img :src="proyectoEstrella.imagen" :alt="proyectoEstrella.titulo" loading="lazy"
                                    decoding="async" />
                                <!-- Badge Proyecto Estrella (esquina superior izquierda) -->
                                <div class="proyecto-overlay">
                                    <v-chip color="accent"
                                            size="large"
                                            variant="elevated"
                                            class="proyecto-estrella-badge">
                                        <v-icon left>mdi-star</v-icon>
                                        Proyecto Estrella
                                    </v-chip>
                                </div>
                                <!-- Badge de Publicación (esquina superior derecha) -->
                                <div v-if="proyectoEstrella.estaPublicado && proyectoEstrella.mensajePublicacion"
                                     class="publicacion-overlay">
                                    <v-chip color="success"
                                            size="default"
                                            variant="elevated"
                                            class="publicacion-badge">
                                        {{ proyectoEstrella.mensajePublicacion }}
                                    </v-chip>
                                </div>
                            </div>
                            <div class="proyecto-contenido">
                                <div class="proyecto-info">
                                    <h2>{{ proyectoEstrella.titulo }}</h2>
                                    <p class="proyecto-descripcion">
                                        {{ proyectoEstrella.descripcion }}
                                    </p>

                                    <div class="proyecto-caracteristicas">
                                        <div v-for="caracteristica in obtenerCaracteristicas(proyectoEstrella)"
                                            :key="caracteristica.text" class="caracteristica">
                                            <v-icon color="primary">{{ caracteristica.icon }}</v-icon>
                                            <span>{{ caracteristica.text }}</span>
                                        </div>
                                    </div>

                                    <div class="tech-stack">
                                        <h4>Tecnologías utilizadas:</h4>
                                        <div class="tech-chips">
                                            <v-chip v-for="tech in proyectoEstrella.tecnologias" :key="tech"
                                                color="primary" variant="outlined">
                                                {{ tech }}
                                            </v-chip>
                                        </div>
                                    </div>

                                    <div class="proyecto-acciones">
                                        <v-btn v-if="proyectoEstrella.enlaceDemo" color="primary" size="large"
                                            :href="validarEnlace(proyectoEstrella.enlaceDemo)" target="_blank" rel="noopener noreferrer">
                                            <v-icon left>mdi-eye</v-icon>
                                            Ver Demo
                                        </v-btn>
                                        <v-btn v-if="proyectoEstrella.enlaceGithub" color="secondary" variant="outlined"
                                            size="large" :href="validarEnlace(proyectoEstrella.enlaceGithub)" target="_blank" rel="noopener noreferrer">
                                            <v-icon left>mdi-github</v-icon>
                                            Ver Código
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

                    <!-- Mensaje si no hay proyecto estrella -->
                    <div v-else-if="!loading && !error" class="no-proyecto-estrella">
                        <v-alert type="info" variant="outlined">
                            <v-icon>mdi-information</v-icon>
                            No hay proyecto estrella configurado actualmente.
                        </v-alert>
                    </div>

                    <!-- Otros proyectos -->
                    <div v-if="otrosProyectos.length > 0" class="otros-proyectos">
                        <h2 class="section-title">Otros Proyectos</h2>

                        <div class="proyectos-grid">
                            <v-card v-for="proyecto in otrosProyectos" :key="proyecto.id" class="proyecto-card"
                                elevation="4">
                                <div class="proyecto-imagen">
                                    <img :src="proyecto.imagen" :alt="proyecto.titulo" loading="lazy"
                                        decoding="async" />
                                    <!-- Badge de publicación para otros proyectos -->
                                    <v-chip v-if="proyecto.estaPublicado && proyecto.mensajePublicacion"
                                            color="success"
                                            size="small"
                                            variant="elevated"
                                            class="publicacion-badge-small">
                                        {{ proyecto.mensajePublicacion }}
                                    </v-chip>
                                </div>
                                <div class="proyecto-info">
                                    <h3>{{ proyecto.titulo }}</h3>
                                    <p>{{ proyecto.descripcion }}</p>
                                    <div class="tech-stack-small">
                                        <v-chip v-for="tech in proyecto.tecnologias.slice(0, 3)" :key="tech"
                                            size="small">
                                            {{ tech }}
                                        </v-chip>
                                        <v-chip v-if="proyecto.tecnologias.length > 3" size="small" variant="outlined">
                                            +{{ proyecto.tecnologias.length - 3 }}
                                        </v-chip>
                                    </div>
                                    <div class="proyecto-links">
                                        <v-btn v-if="proyecto.enlaceDemo" color="primary" variant="outlined"
                                            size="small" :href="validarEnlace(proyecto.enlaceDemo)" target="_blank" rel="noopener noreferrer">
                                            <v-icon left>mdi-eye</v-icon>
                                            Ver
                                        </v-btn>
                                        <v-btn v-if="proyecto.enlaceGithub" color="secondary" variant="text"
                                            size="small" :href="validarEnlace(proyecto.enlaceGithub)" target="_blank" rel="noopener noreferrer">
                                            <v-icon left>mdi-github</v-icon>
                                            Código
                                        </v-btn>
                                        <v-btn v-if="!proyecto.enlaceDemo && !proyecto.enlaceGithub" color="secondary"
                                            variant="text" size="small" to="/contacto">
                                            <v-icon left>mdi-email</v-icon>
                                            Contactar
                                        </v-btn>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </div>

                    <!-- Mensaje si no hay otros proyectos -->
                    <div v-else-if="!loading && !error && proyectoEstrella" class="no-otros-proyectos">
                        <v-alert type="info" variant="outlined">
                            <v-icon>mdi-information</v-icon>
                            Solo hay un proyecto estrella configurado actualmente.
                        </v-alert>
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

                </div> <!-- Cierre del contenido principal -->
            </v-container>
        </section>
    </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseLayout from '@/components/BaseLayout.vue'
import { useMainStore } from '@/stores/main'

const store = useMainStore()

// Estado reactivo
const loading = ref(true)
const error = ref(null)

// Computed properties para proyectos desde Firebase
const proyectoEstrella = computed(() => {
    return store.proyectos.find(proyecto => proyecto.esEstrella && proyecto.activo !== false)
})

const otrosProyectos = computed(() => {
    return store.proyectos.filter(proyecto =>
        !proyecto.esEstrella &&
        proyecto.activo !== false &&
        proyecto.mostrarEnPortafolio !== false
    ).slice(0, 4) // Máximo 4 proyectos adicionales
})

// Funciones no utilizadas eliminadas para limpiar el código

// Función para formatear características del proyecto estrella
const obtenerCaracteristicas = (proyecto) => {
    if (!proyecto.caracteristicas || proyecto.caracteristicas.length === 0) {
        // Características por defecto basadas en tecnologías
        const caracteristicasDefault = []

        if (proyecto.tecnologias.some(tech => tech.toLowerCase().includes('firebase') || tech.toLowerCase().includes('auth'))) {
            caracteristicasDefault.push({ icon: 'mdi-shield-check', text: 'Autenticación segura' })
        }
        if (proyecto.tecnologias.some(tech => tech.toLowerCase().includes('api') || tech.toLowerCase().includes('rest'))) {
            caracteristicasDefault.push({ icon: 'mdi-api', text: 'API REST completa' })
        }
        if (proyecto.tecnologias.some(tech => tech.toLowerCase().includes('chart') || tech.toLowerCase().includes('analytics'))) {
            caracteristicasDefault.push({ icon: 'mdi-chart-line', text: 'Reportes en tiempo real' })
        }
        caracteristicasDefault.push({ icon: 'mdi-responsive', text: 'Diseño responsive' })

        return caracteristicasDefault
    }

    // Convertir características de texto a objetos con iconos
    return proyecto.caracteristicas.map(caracteristica => ({
        icon: obtenerIconoCaracteristica(caracteristica),
        text: caracteristica
    }))
}

// Función para obtener icono basado en el texto de la característica
const obtenerIconoCaracteristica = (texto) => {
    const textoLower = texto.toLowerCase()

    if (textoLower.includes('dashboard') || textoLower.includes('admin')) return 'mdi-view-dashboard'
    if (textoLower.includes('api') || textoLower.includes('rest')) return 'mdi-api'
    if (textoLower.includes('auth') || textoLower.includes('segur')) return 'mdi-shield-check'
    if (textoLower.includes('report') || textoLower.includes('tiempo real')) return 'mdi-chart-line'
    if (textoLower.includes('notif') || textoLower.includes('push')) return 'mdi-bell'
    if (textoLower.includes('rol') || textoLower.includes('permis')) return 'mdi-account-group'
    if (textoLower.includes('responsive') || textoLower.includes('móvil')) return 'mdi-responsive'
    if (textoLower.includes('stripe') || textoLower.includes('pago')) return 'mdi-credit-card'

    return 'mdi-check-circle' // Icono por defecto
}

// Función para validar y corregir enlaces
const validarEnlace = (enlace) => {
    if (!enlace) return '#'

    // Si ya es una URL completa, devolverla tal como está
    if (enlace.startsWith('http://') || enlace.startsWith('https://')) {
        return enlace
    }

    // Si parece ser un dominio sin protocolo, agregar https://
    if (enlace.includes('.') && !enlace.includes('/')) {
        return `https://${enlace}`
    }

    // Para cualquier otro caso, agregar https://
    return enlace.startsWith('//') ? `https:${enlace}` : `https://${enlace}`
}

// Cargar proyectos al montar el componente
onMounted(async () => {
    try {
        loading.value = true
        console.log('📁 Cargando proyectos para portafolio...')

        // Cargar proyectos en el store
        const resultado = await store.cargarProyectos()

        if (!resultado.success) {
            error.value = resultado.error || 'Error al cargar proyectos'
            console.error('❌ Error al cargar proyectos:', resultado.error)
        } else {
            console.log(`✅ ${store.proyectos.length} proyectos cargados en portafolio`)
        }
    } catch (err) {
        error.value = 'Error inesperado al cargar proyectos'
        console.error('❌ Error inesperado:', err)
    } finally {
        loading.value = false
    }
})
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

/* Estados de carga y error */
.loading-state,
.error-state {
    margin: 4rem 0;
    text-align: center;
}

.loading-state p {
    color: var(--color-secondary);
    font-size: 1.1rem;
}

.no-proyecto-estrella,
.no-otros-proyectos {
    margin: 2rem 0;
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
    left: 1rem;
    z-index: 2;
}

/* Contenedor para badge de publicación */
.publicacion-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 3;
}

/* Badge Proyecto Estrella */
.proyecto-estrella-badge {
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    background: rgba(0, 204, 204, 0.95) !important;
    color: white !important;
}

/* Badge de publicación en proyecto estrella */
.publicacion-badge {
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    background: rgba(76, 175, 80, 0.95) !important;
    color: white !important;
    animation: pulse-success 2s infinite;
}

/* Badge de publicación en otros proyectos */
.publicacion-badge-small {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 3;
    font-weight: 700;
    font-size: 0.8rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    background: rgba(76, 175, 80, 0.95) !important;
    color: white !important;
}

/* Animación sutil para el badge */
@keyframes pulse-success {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.9;
    }
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