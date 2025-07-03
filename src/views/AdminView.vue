<template>
  <BaseLayout>
    <section class="admin-page">
      <v-container>
        <!-- Header del panel -->
        <div class="admin-header">
          <h1 class="page-title">Panel de Administración</h1>
          <p class="page-subtitle">Gestiona mensajes, leads y estadísticas de Maiko Studios</p>

          <div class="admin-actions">
            <v-btn color="error" variant="outlined" @click="cerrarSesion">
              <v-icon left>mdi-logout</v-icon>
              Cerrar Sesión
            </v-btn>
          </div>
        </div>

        <!-- Estadísticas generales -->
        <div class="stats-grid">
          <v-card class="stat-card">
            <v-card-text>
              <div class="stat-content">
                <v-icon color="primary" size="48">mdi-email</v-icon>
                <div class="stat-info">
                  <h3>{{ estadisticas.totalMensajes }}</h3>
                  <p>Mensajes Totales</p>
                  <small v-if="mensajesNoLeidos > 0" class="text-error">
                    {{ mensajesNoLeidos }} sin leer
                  </small>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="stat-card">
            <v-card-text>
              <div class="stat-content">
                <v-icon color="secondary" size="48">mdi-account-tie</v-icon>
                <div class="stat-info">
                  <h3>{{ estadisticas.totalSolicitudesCV }}</h3>
                  <p>Solicitudes CV</p>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="stat-card">
            <v-card-text>
              <div class="stat-content">
                <v-icon color="accent" size="48">mdi-eye</v-icon>
                <div class="stat-info">
                  <h3>{{ estadisticas.totalVisitas }}</h3>
                  <p>Visitas Totales</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Tabs para diferentes secciones -->
        <v-tabs v-model="tabActiva" class="admin-tabs">
          <v-tab value="mensajes">
            <v-icon left>mdi-email</v-icon>
            Mensajes
            <v-badge v-if="mensajesNoLeidos > 0" :content="mensajesNoLeidos" color="error" />
          </v-tab>
          <v-tab value="cv">
            <v-icon left>mdi-account-tie</v-icon>
            Solicitudes CV
          </v-tab>
          <v-tab value="portafolio">
            <v-icon left>mdi-folder-image</v-icon>
            Gestión de Portafolio
          </v-tab>
          <v-tab value="solicitudes">
            <v-icon left>mdi-clipboard-list</v-icon>
            Solicitudes
          </v-tab>
          <v-tab value="estadisticas">
            <v-icon left>mdi-chart-line</v-icon>
            Estadísticas
          </v-tab>
        </v-tabs>

        <v-window v-model="tabActiva">
          <!-- Tab de Mensajes -->
          <v-window-item value="mensajes">
            <div class="tab-content">
              <div class="section-header">
                <h2>Mensajes de Contacto</h2>
                <v-btn color="primary" @click="cargarMensajes">
                  <v-icon left>mdi-refresh</v-icon>
                  Actualizar
                </v-btn>
              </div>

              <v-data-table :headers="headersMensajes" :items="mensajes" :loading="loading" class="admin-table"
                item-value="id">
                <template #item.leido="{ item }">
                  <v-chip :color="item.leido ? 'success' : 'warning'" size="small">
                    {{ item.leido ? 'Leído' : 'No leído' }}
                  </v-chip>
                </template>

                <template #item.fechaCreacion="{ item }">
                  {{ formatearFecha(item.fechaCreacion) }}
                </template>

                <template #item.actions="{ item }">
                  <v-btn icon size="small" color="primary" @click="verMensaje(item)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn v-if="!item.leido" icon size="small" color="success" @click="marcarComoLeido(item.id)">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-window-item>

          <!-- Tab de Solicitudes CV -->
          <v-window-item value="cv">
            <div class="tab-content">
              <div class="section-header">
                <h2>Solicitudes de CV Personalizado</h2>
                <v-btn color="secondary" @click="cargarSolicitudesCV">
                  <v-icon left>mdi-refresh</v-icon>
                  Actualizar
                </v-btn>
              </div>

              <v-data-table :headers="headersCV" :items="solicitudesCV" :loading="loading" class="admin-table"
                item-value="id">
                <template #item.fechaCreacion="{ item }">
                  {{ formatearFecha(item.fechaCreacion) }}
                </template>

                <template #item.actions="{ item }">
                  <v-btn icon size="small" color="primary" @click="verSolicitudCV(item)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-window-item>

          <!-- Tab de Estadísticas -->
          <!-- Tab de Solicitudes (Leads) -->
          <v-window-item value="solicitudes">
            <div class="tab-content">
              <div class="section-header">
                <h2>Solicitudes de Servicios</h2>
                <div class="d-flex gap-4">
                  <v-select v-model="filtros.estado" :items="estadosDisponibles" label="Estado" class="mr-2" density="compact" clearable></v-select>
                  <v-select v-model="filtros.fuente" :items="fuentesDisponibles" label="Fuente" class="mr-2" density="compact" clearable></v-select>
                  <v-btn color="primary" @click="cargarSolicitudes">
                    <v-icon left>mdi-refresh</v-icon>
                    Buscar
                  </v-btn>
                </div>
              </div>

              <v-data-table :headers="headersSolicitudes" :items="solicitudes" :loading="loading" class="admin-table" item-value="id">
                <template #item.fecha="{ item }">
                  {{ formatearFecha(item.fecha?.toDate?.()) }}
                </template>

                <template #item.estado="{ item }">
                  <v-select v-model="item.estado" :items="estadosDisponibles" dense hide-details style="max-width:120px" @update:model-value="val => actualizarEstado(item, val)"></v-select>
                </template>

                <template #item.actions="{ item }">
                  <v-btn icon size="small" color="primary" @click="responderSolicitud(item)">
                    <v-icon>mdi-email</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-window-item>

          <v-window-item value="estadisticas">
            <div class="tab-content">
              <h2>Estadísticas Detalladas</h2>
              <p>Próximamente: Gráficos de visitas, conversiones y análisis de leads</p>
            </div>
          </v-window-item>
        </v-window>
      </v-container>
    </section>

    <!-- Dialog para ver mensaje completo -->
    <v-dialog v-model="dialogMensaje" max-width="600">
      <v-card v-if="mensajeSeleccionado">
        <v-card-title>Mensaje de {{ mensajeSeleccionado.nombre }}</v-card-title>
        <v-card-text>
          <div class="mensaje-detalle">
            <p><strong>Email:</strong> {{ mensajeSeleccionado.email }}</p>
            <p><strong>Asunto:</strong> {{ mensajeSeleccionado.asunto }}</p>
            <p v-if="mensajeSeleccionado.telefono"><strong>Teléfono:</strong> {{ mensajeSeleccionado.telefono }}</p>
            <p><strong>Fecha:</strong> {{ formatearFecha(mensajeSeleccionado.fechaCreacion) }}</p>
            <div class="mensaje-texto">
              <strong>Mensaje:</strong>
              <p>{{ mensajeSeleccionado.mensaje }}</p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogMensaje = false">Cerrar</v-btn>
          <v-btn color="primary" @click="responderMensaje">Responder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para ver solicitud CV -->
    <v-dialog v-model="dialogCV" max-width="700">
      <v-card v-if="solicitudSeleccionada">
        <v-card-title>Solicitud CV - {{ solicitudSeleccionada.posicion }}</v-card-title>
        <v-card-text>
          <div class="cv-detalle">
            <div class="cv-info-grid">
              <div><strong>Reclutador:</strong> {{ solicitudSeleccionada.nombreReclutador }}</div>
              <div><strong>Empresa:</strong> {{ solicitudSeleccionada.empresa }}</div>
              <div><strong>Email:</strong> {{ solicitudSeleccionada.email }}</div>
              <div><strong>Rubro:</strong> {{ solicitudSeleccionada.rubro }}</div>
              <div><strong>Experiencia:</strong> {{ solicitudSeleccionada.experienciaRequerida }}</div>
              <div><strong>Modalidad:</strong> {{ solicitudSeleccionada.modalidad }}</div>
            </div>

            <div v-if="solicitudSeleccionada.tecnologias?.length" class="tecnologias">
              <strong>Tecnologías:</strong>
              <v-chip v-for="tech in solicitudSeleccionada.tecnologias" :key="tech" size="small" class="ma-1">
                {{ tech }}
              </v-chip>
            </div>

            <div v-if="solicitudSeleccionada.descripcionPuesto" class="descripcion">
              <strong>Descripción del puesto:</strong>
              <p>{{ solicitudSeleccionada.descripcionPuesto }}</p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogCV = false">Cerrar</v-btn>
          <v-btn color="secondary" @click="generarCVPersonalizado">Generar CV</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import { useMainStore } from '@/stores/main'
import { listarSolicitudes, actualizarEstadoSolicitud } from '@/services/firestoreService'
// import { useGitHubAssets } from '@/composables/useGitHubAssets' // Archivo no encontrado.
// import { poblarFirebaseConProyectos } from '@/scripts/poblarFirebase.js' // Archivo no encontrado.
// import { globalNotifications } from '@/composables/useNotifications' // Archivo no encontrado.

// Stubs para notificaciones faltantes. Muestra los mensajes en la consola.
const globalNotifications = {
  success: (message) => console.log(`%c✅ SUCCESS: ${message}`, 'color: #28a745; font-weight: bold;'),
  error: (message) => console.error(`❌ ERROR: ${message}`),
  info: (message) => console.info(`ℹ️ INFO: ${message}`),
};
const { success, error, info } = globalNotifications;

const router = useRouter()
const store = useMainStore()

// Stubs para la funcionalidad desactivada de useGitHubAssets
const proyectos = ref([])
const cargarProyectos = () => console.warn('Funcionalidad de cargar proyectos desactivada (useGitHubAssets no encontrado).')
const cargarImagenesProyectos = async () => console.warn('Funcionalidad de cargar imágenes desactivada (useGitHubAssets no encontrado).')

// Estado del componente
const tabActiva = ref('mensajes')
const loading = ref(false)
const dialogMensaje = ref(false)
const dialogCV = ref(false)
const mensajeSeleccionado = ref(null)
const solicitudSeleccionada = ref(null)

// Datos reactivos
const estadisticas = reactive({
  totalMensajes: 0,
  totalSolicitudesCV: 0,
  totalVisitas: 0
})

// Computed properties
const mensajes = computed(() => store.mensajes)
const solicitudesCV = computed(() => store.solicitudesCV)
const mensajesNoLeidos = computed(() => store.mensajesNoLeidos)

// Headers para las tablas
const headersMensajes = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Email', key: 'email' },
  { title: 'Asunto', key: 'asunto' },
  { title: 'Estado', key: 'leido' },
  { title: 'Fecha', key: 'fechaCreacion' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const headersCV = [
  { title: 'Reclutador', key: 'nombreReclutador' },
  { title: 'Empresa', key: 'empresa' },
  { title: 'Posición', key: 'posicion' },
  { title: 'Fecha', key: 'fechaCreacion' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const estadosDisponibles = ['pendiente', 'en progreso', 'respondido']
const fuentesDisponibles = ['Home', 'Campañas']

const filtros = reactive({ estado: '', fuente: '' })

const solicitudes = ref([])

async function cargarSolicitudes () {
  loading.value = true
  solicitudes.value = await listarSolicitudes({ ...filtros })
  loading.value = false
}

async function actualizarEstado (item, nuevoEstado) {
  const ok = await actualizarEstadoSolicitud(item.id, nuevoEstado)
  if (ok) success('Estado actualizado')
  else error('No se pudo actualizar')
}

function responderSolicitud (item) {
  info(`Se enviará correo a ${item.email} (lógica pendiente)`) 
}

const headersSolicitudes = [
  { title: 'Código', key: 'codigoSeguimiento' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Servicio', key: 'servicio' },
  { title: 'Estado', key: 'estado' },
  { title: 'Fuente', key: 'fuente' },
  { title: 'Fecha', key: 'fecha' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const headersProyectos = [
  { title: 'Imagen', key: 'imagen', sortable: false },
  { title: 'Título', key: 'titulo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Estrella', key: 'esEstrella', sortable: false },
  { title: 'En Home', key: 'mostrarEnHome', sortable: false },
  { title: 'En Portafolio', key: 'mostrarEnPortafolio', sortable: false },
  { title: 'Publicado', key: 'estaPublicado', sortable: false },
  { title: 'Tecnologías', key: 'tecnologias', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false }
]
// Funciones
const cargarDatos = async () => {
  loading.value = true
  try {
    await Promise.all([
      cargarMensajes(),
      cargarSolicitudesCV(),
      cargarEstadisticas()
    ])
  } finally {
    loading.value = false
  }
}

const cargarMensajes = async () => {
  const resultado = await store.cargarMensajes()
  if (resultado.success) {
    estadisticas.totalMensajes = store.mensajes.length
  }
}

const cargarSolicitudesCV = async () => {
  const resultado = await store.cargarSolicitudesCV()
  if (resultado.success) {
    estadisticas.totalSolicitudesCV = store.solicitudesCV.length
  }
}

const cargarEstadisticas = async () => {
  const resultado = await store.cargarEstadisticas()
  if (resultado.success) {
    Object.assign(estadisticas, store.estadisticas)
  }
}

const verMensaje = (mensaje) => {
  mensajeSeleccionado.value = mensaje
  dialogMensaje.value = true
}

const verSolicitudCV = (solicitud) => {
  solicitudSeleccionada.value = solicitud
  dialogCV.value = true
}

const marcarComoLeido = async (mensajeId) => {
  await store.marcarMensajeLeido(mensajeId)
}

const responderMensaje = () => {
  if (mensajeSeleccionado.value) {
    const email = mensajeSeleccionado.value.email
    const asunto = `Re: ${mensajeSeleccionado.value.asunto}`
    window.open(`mailto:${email}?subject=${encodeURIComponent(asunto)}`)
  }
}

const generarCVPersonalizado = () => {
  // Aquí se implementaría la lógica para generar el CV personalizado
  console.log('Generando CV personalizado para:', solicitudSeleccionada.value)
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  const date = fecha.toDate ? fecha.toDate() : new Date(fecha)
  return date.toLocaleDateString('es-CL') + ' ' + date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cerrarSesion = () => {
  store.limpiarEstado()
  localStorage.removeItem('admin_authenticated')
  router.push('/admin/login')
}

// Inicialización
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Usuario autenticado, ahora podemos cargar los datos de forma segura.
      console.log('Usuario autenticado detectado en AdminView, cargando datos del panel...');
      cargarDatos();
      cargarSolicitudes();
      cargarProyectos();
      await cargarImagenesProyectos();

      // Exponer funciones para testing en desarrollo
      if (import.meta.env.DEV) {
        window.store = store;
        console.log('🔧 Funciones expuestas para testing:');
        console.log('   - window.store');
      }
    } else {
      // El router guard ya debería haber manejado esto, pero como doble chequeo.
      console.warn('AdminView: No se encontró usuario autenticado. Redirigiendo a /login.');
      router.replace('/login');
    }
  });
})
</script>

<style scoped>
.admin-page {
  padding: 2rem 0;
  color: var(--color-text);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-secondary);
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-info h3 {
  font-size: 2rem;
  color: var(--color-text);
  margin: 0;
}

.stat-info p {
  color: #cccccc;
  margin: 0;
}

.admin-tabs {
  margin-bottom: 2rem;
}

.tab-content {
  padding: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: var(--color-text);
  margin: 0;
}

.admin-table {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.mensaje-detalle {
  color: #333;
}

.mensaje-texto {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.cv-detalle {
  color: #333;
}

.cv-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.tecnologias {
  margin: 1rem 0;
}

.descripcion {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .cv-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
