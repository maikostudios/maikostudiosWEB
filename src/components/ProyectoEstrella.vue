<template>
  <section id="proyectos" class="proyectos-section">
    <v-container>
      <h2 class="section-title">Proyectos Destacados</h2>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="loading-text">Cargando proyectos destacados...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <v-icon color="error" size="48">mdi-alert-circle</v-icon>
        <p class="error-text">{{ error }}</p>
        <v-btn color="primary" variant="outlined" @click="cargarProyectos">
          <v-icon left>mdi-refresh</v-icon>
          Reintentar
        </v-btn>
      </div>

      <!-- Empty state -->
      <div v-else-if="proyectosEstrella.length === 0" class="empty-container">
        <v-icon color="grey" size="64">mdi-home-outline</v-icon>
        <h3>No hay proyectos destacados</h3>
        <p>Los proyectos destacados aparecerán aquí cuando sean marcados como "Mostrar en Home" desde el panel de
          administración.</p>
      </div>

      <!-- Proyectos destacados dinámicos -->
      <div v-else class="proyectos-grid">
        <div v-for="proyecto in proyectosEstrella" :key="proyecto.id" class="proyecto-card">
          <div class="proyecto-imagen">
            <img :src="proyecto.imagen || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'"
              :alt="proyecto.titulo" loading="lazy" decoding="async" @error="onImageError" />
            <!-- Badge de publicación en Home -->
            <v-chip v-if="proyecto.estaPublicado && proyecto.mensajePublicacion"
                    color="success"
                    size="small"
                    class="publicacion-badge-home">
              {{ proyecto.mensajePublicacion }}
            </v-chip>
          </div>
          <div class="proyecto-info">
            <h3>{{ proyecto.titulo }}</h3>
            <p>{{ proyecto.descripcion }}</p>
            <div class="tech-stack">
              <span v-for="tech in proyecto.tecnologias.slice(0, 4)" :key="tech">
                {{ tech }}
              </span>
              <span v-if="proyecto.tecnologias.length > 4" class="tech-more">
                +{{ proyecto.tecnologias.length - 4 }}
              </span>
            </div>
            <div class="proyecto-links">
              <v-btn v-if="proyecto.enlaceDemo" color="primary" variant="outlined" :href="validarEnlace(proyecto.enlaceDemo)"
                target="_blank" rel="noopener noreferrer">
                <v-icon left>mdi-eye</v-icon>
                Ver Proyecto
              </v-btn>
              <v-btn v-if="proyecto.enlaceGithub" color="secondary" variant="text" :href="validarEnlace(proyecto.enlaceGithub)"
                target="_blank" rel="noopener noreferrer">
                <v-icon left>mdi-github</v-icon>
                Código
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="ver-mas">
        <v-btn color="primary" size="large" to="/portafolio">
          Ver Todos los Proyectos
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'

// Store
const store = useMainStore()

// Estado reactivo
const loading = ref(true)
const error = ref(null)
const proyectosEstrella = ref([])

// Función para cargar proyectos para el Home
const cargarProyectos = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('🏠 Cargando proyectos para Home...')

    const resultado = await store.obtenerProyectosHome()

    if (resultado.success) {
      proyectosEstrella.value = resultado.data
      console.log(`✅ ${resultado.data.length} proyectos para Home cargados`)
    } else {
      error.value = resultado.message || 'Error al cargar proyectos para Home'
      console.error('❌ Error al cargar proyectos:', resultado.error)
    }
  } catch (err) {
    error.value = 'Error inesperado al cargar proyectos'
    console.error('❌ Error inesperado:', err)
  } finally {
    loading.value = false
  }
}

// Función para manejar errores de imagen
const onImageError = (event) => {
  console.warn('⚠️ Error al cargar imagen:', event.target.src)
  // Fallback a imagen por defecto
  event.target.src = 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
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
onMounted(() => {
  cargarProyectos()
})
</script>

<style scoped>
.proyectos-section {
  padding: 6rem 0;
  background: transparent;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 4rem;
}

.proyectos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  justify-items: center;
}

/* Cuando hay exactamente 2 proyectos, usar grid específico */
.proyectos-grid:has(.proyecto-card:nth-child(2):last-child) {
  grid-template-columns: 1fr 1fr;
  max-width: 900px;
}

.proyecto-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  width: 100%;
  max-width: 420px;
}

.proyecto-card:hover {
  transform: translateY(-5px);
}

.proyecto-imagen {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.proyecto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Badge de publicación en Home */
.publicacion-badge-home {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: gentle-glow 3s ease-in-out infinite;
}

/* Animación suave para el badge en Home */
@keyframes gentle-glow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
  }
}

.proyecto-card:hover .proyecto-imagen img {
  transform: scale(1.05);
}

.proyecto-info {
  padding: 2rem;
}

.proyecto-info h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.proyecto-info p {
  color: #cccccc;
  margin-bottom: 1.5rem;
}

.tech-stack {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tech-stack span {
  background: rgba(0, 102, 255, 0.1);
  color: var(--color-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.tech-more {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ccc !important;
  font-style: italic;
}

.proyecto-links {
  display: flex;
  gap: 1rem;
}

.ver-mas {
  text-align: center;
  margin-top: 4rem;
}

/* Estados especiales */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-text,
.error-text {
  margin-top: 1rem;
  color: #ccc;
  font-size: 1.1rem;
}

.empty-container h3 {
  color: var(--color-text);
  margin: 1rem 0;
  font-size: 1.5rem;
}

.empty-container p {
  color: #ccc;
  max-width: 500px;
  line-height: 1.6;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .proyectos-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    max-width: 800px;
  }

  .proyectos-grid:has(.proyecto-card:nth-child(2):last-child) {
    grid-template-columns: 1fr 1fr;
    max-width: 750px;
  }

  .proyecto-card {
    max-width: 380px;
  }
}

@media (max-width: 768px) {
  .proyectos-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 100%;
  }

  .proyectos-grid:has(.proyecto-card:nth-child(2):last-child) {
    grid-template-columns: 1fr;
  }

  .proyecto-card {
    margin-bottom: 1rem;
    max-width: 100%;
  }

  .proyecto-imagen {
    height: 220px;
  }

  .proyecto-info {
    padding: 1.5rem;
  }

  .proyecto-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .proyectos-section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }

  .proyectos-grid {
    gap: 1.5rem;
  }

  .proyecto-info {
    padding: 1rem;
  }

  .proyecto-info h3 {
    font-size: 1.3rem;
  }

  .tech-stack {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .ver-mas {
    margin-top: 2rem;
  }

  /* Estados especiales en mobile */
  .loading-container,
  .error-container,
  .empty-container {
    padding: 2rem 1rem;
  }

  .loading-text,
  .error-text {
    font-size: 1rem;
  }

  .empty-container h3 {
    font-size: 1.3rem;
  }
}
</style>