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
                <v-icon color="info" size="48">mdi-folder-image</v-icon>
                <div class="stat-info">
                  <h3>{{ estadisticas.totalProyectos }}</h3>
                  <p>Proyectos</p>
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

          <!-- Tab de Gestión de Portafolio -->
          <v-window-item value="portafolio">
            <div class="tab-content">
              <div class="section-header">
                <h2>Gestión de Portafolio</h2>
                <div class="header-actions">
                  <v-btn v-if="proyectos.length === 0" color="success" variant="outlined" @click="poblarBaseDatos"
                    :loading="poblando" class="mr-2">
                    <v-icon left>mdi-database-plus</v-icon>
                    Poblar con Ejemplos
                  </v-btn>
                  <v-btn color="primary" @click="abrirFormularioProyecto()">
                    <v-icon left>mdi-plus</v-icon>
                    Nuevo Proyecto
                  </v-btn>
                </div>
              </div>

              <v-data-table :headers="headersProyectos" :items="proyectos" :loading="loading" class="admin-table"
                item-value="id">
                <template #item.imagen="{ item }">
                  <div class="proyecto-imagen-mini">
                    <img :src="item.imagen" :alt="item.titulo" />
                  </div>
                </template>

                <template #item.esEstrella="{ item }">
                  <v-chip :color="item.esEstrella ? 'accent' : 'default'" size="small">
                    <v-icon v-if="item.esEstrella" left size="small">mdi-star</v-icon>
                    {{ item.esEstrella ? 'Sí' : 'No' }}
                  </v-chip>
                </template>

                <template #item.mostrarEnHome="{ item }">
                  <v-chip :color="item.mostrarEnHome ? 'primary' : 'default'" size="small">
                    <v-icon v-if="item.mostrarEnHome" left size="small">mdi-home</v-icon>
                    {{ item.mostrarEnHome ? 'Sí' : 'No' }}
                  </v-chip>
                </template>

                <template #item.mostrarEnPortafolio="{ item }">
                  <v-chip :color="item.mostrarEnPortafolio ? 'secondary' : 'default'" size="small">
                    <v-icon v-if="item.mostrarEnPortafolio" left size="small">mdi-briefcase</v-icon>
                    {{ item.mostrarEnPortafolio ? 'Sí' : 'No' }}
                  </v-chip>
                </template>

                <template #item.tecnologias="{ item }">
                  <div class="tecnologias-mini">
                    <v-chip v-for="tech in item.tecnologias.slice(0, 3)" :key="tech" size="x-small" class="ma-1">
                      {{ tech }}
                    </v-chip>
                    <span v-if="item.tecnologias.length > 3" class="text-caption">
                      +{{ item.tecnologias.length - 3 }}
                    </span>
                  </div>
                </template>

                <template #item.actions="{ item }">
                  <v-btn icon size="small" color="primary" @click="editarProyecto(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="eliminarProyecto(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </div>
          </v-window-item>

          <!-- Tab de Estadísticas -->
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
    <v-dialog v-model="dialogCV" max-width="800">
      <v-card v-if="solicitudSeleccionada">
        <v-card-title>Solicitud CV - {{ solicitudSeleccionada.posicion }}</v-card-title>
        <v-card-text>
          <div class="cv-detalle">
            <div class="cv-info-grid">
              <div><strong>Reclutador:</strong> {{ solicitudSeleccionada.nombreReclutador }}</div>
              <div><strong>Empresa:</strong> {{ solicitudSeleccionada.empresa }}</div>
              <div><strong>Email:</strong> {{ solicitudSeleccionada.email }}</div>
              <div><strong>Posición:</strong> {{ solicitudSeleccionada.posicion }}</div>
              <div v-if="solicitudSeleccionada.fechaSolicitud"><strong>Fecha:</strong> {{
                formatearFecha(solicitudSeleccionada.fechaSolicitud) }}</div>
              <div v-if="solicitudSeleccionada.tipoSolicitud"><strong>Tipo:</strong> {{
                solicitudSeleccionada.tipoSolicitud
              }}</div>
            </div>

            <!-- Habilidades seleccionadas -->
            <div v-if="solicitudSeleccionada.habilidadesSeleccionadas?.length" class="habilidades mt-4">
              <strong>Habilidades Requeridas:</strong>
              <div class="habilidades-chips mt-2">
                <v-chip v-for="habilidad in solicitudSeleccionada.habilidadesSeleccionadas" :key="habilidad"
                  size="small" color="primary" class="ma-1">
                  {{ habilidad }}
                </v-chip>
              </div>
            </div>

            <!-- Tecnologías (para compatibilidad con solicitudes antiguas) -->
            <div v-else-if="solicitudSeleccionada.tecnologias?.length" class="tecnologias mt-4">
              <strong>Tecnologías:</strong>
              <div class="tecnologias-chips mt-2">
                <v-chip v-for="tech in solicitudSeleccionada.tecnologias" :key="tech" size="small" color="secondary"
                  class="ma-1">
                  {{ tech }}
                </v-chip>
              </div>
            </div>

            <!-- Descripción del cargo -->
            <div v-if="solicitudSeleccionada.descripcionCargo || solicitudSeleccionada.descripcionPuesto"
              class="descripcion-cargo mt-4">
              <strong>Descripción del Cargo:</strong>
              <div class="descripcion-texto mt-2">
                <p class="descripcion-content">{{ solicitudSeleccionada.descripcionCargo ||
                  solicitudSeleccionada.descripcionPuesto }}</p>
              </div>
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

    <!-- Dialog para crear/editar proyecto -->
    <v-dialog v-model="dialogProyecto" max-width="900" persistent>
      <v-card>
        <v-card-title>
          {{ proyectoEditando ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formProyecto" v-model="formularioValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="formularioProyecto.titulo" label="Título del Proyecto" :rules="[rules.required]"
                  variant="outlined" />
              </v-col>
              <v-col cols="12" md="3">
                <v-switch v-model="formularioProyecto.esEstrella" label="Proyecto Estrella" color="accent" inset />
                <small class="text-caption text-grey">Para portafolio (solo 1)</small>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch v-model="formularioProyecto.mostrarEnHome" label="Mostrar en Home" color="primary" inset />
                <small class="text-caption text-grey">Página principal (máx 2)</small>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch v-model="formularioProyecto.mostrarEnPortafolio" label="Mostrar en Portafolio" color="secondary" inset />
                <small class="text-caption text-grey">Página de portafolio</small>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch v-model="formularioProyecto.estaPublicado" label="¿Proyecto Publicado?" color="success" inset />
                <small class="text-caption text-grey">Proyecto real en funcionamiento</small>
              </v-col>
            </v-row>

            <!-- Mensaje de publicación condicional -->
            <v-row v-if="formularioProyecto.estaPublicado">
              <v-col cols="12">
                <v-textarea
                  v-model="formularioProyecto.mensajePublicacion"
                  label="Mensaje de Estado de Publicación"
                  placeholder="Ej: 🍰 ¡Publicado y funcionando! 🧁"
                  rows="2"
                  counter="100"
                  maxlength="100"
                  variant="outlined"
                  color="success"
                  hint="Este mensaje aparecerá como badge en la tarjeta del proyecto"
                  persistent-hint
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="formularioProyecto.descripcion" label="Descripción" :rules="[rules.required]"
                  variant="outlined" rows="3" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="imagen-selector-header">
                  <v-select v-model="formularioProyecto.imagen" :items="imagenesDisponibles" label="Imagen del Proyecto"
                    :rules="[rules.required]" variant="outlined" item-title="title" item-value="value"
                    :loading="cargandoImagenes" :disabled="cargandoImagenes">
                    <template #selection="{ item }">
                      <div class="imagen-seleccionada">
                        <img :src="item.raw.imagen" :alt="item.raw.title" />
                        <div class="imagen-info">
                          <span class="imagen-nombre">{{ item.raw.title }}</span>
                          <span class="imagen-archivo">{{ item.raw.subtitle }}</span>
                        </div>
                      </div>
                    </template>
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <img :src="item.raw.imagen" :alt="item.raw.title" class="imagen-opcion" />
                        </template>
                        <template #subtitle>
                          <span class="text-caption">{{ item.raw.subtitle }}</span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>

                  <v-btn icon size="small" color="primary" @click="recargarImagenes" :loading="cargandoImagenes"
                    class="ml-2">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </div>

                <!-- Información de estado -->
                <div v-if="errorCarga" class="error-carga mt-2">
                  <v-alert type="warning" density="compact">
                    Error al cargar imágenes: {{ errorCarga }}
                    <br>Usando imágenes de respaldo.
                  </v-alert>
                </div>

                <div v-if="imagenesProyectos.length > 0" class="imagenes-info mt-2">
                  <v-chip size="small" color="success">
                    {{ imagenesProyectos.length }} imágenes disponibles desde GitHub
                  </v-chip>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="formularioProyecto.enlaceDemo" label="Enlace Demo (opcional)" variant="outlined"
                  prepend-inner-icon="mdi-eye" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formularioProyecto.enlaceGithub" label="Enlace GitHub (opcional)"
                  variant="outlined" prepend-inner-icon="mdi-github" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-combobox v-model="formularioProyecto.tecnologias" :items="tecnologiasDisponibles" label="Tecnologías"
                  :rules="[rules.required]" variant="outlined" multiple chips closable-chips />
              </v-col>
            </v-row>

            <!-- Características adicionales para proyecto estrella -->
            <v-row v-if="formularioProyecto.esEstrella">
              <v-col cols="12">
                <v-divider class="my-4" />
                <h3 class="mb-4">Características del Proyecto Estrella</h3>
                <v-combobox v-model="formularioProyecto.caracteristicas" label="Características especiales"
                  variant="outlined" multiple chips closable-chips
                  hint="Ej: Dashboard administrativo, API REST, Autenticación segura" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cerrarFormularioProyecto">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!formularioValido" :loading="guardandoProyecto" @click="guardarProyecto">
            {{ proyectoEditando ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmación para eliminar -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar el proyecto "{{ proyectoAEliminar?.titulo }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarEliminacion">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="4000" location="top">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import { useMainStore } from '@/stores/main'
import { useGitHubAssets } from '@/composables/useGitHubAssets'
import { poblarFirebaseConProyectos } from '@/scripts/poblarFirebase.js'
import { globalNotifications } from '@/composables/useNotifications'

const router = useRouter()
const store = useMainStore()

// Sistema de notificaciones
const { success, error, info } = globalNotifications

// Composable para gestión de imágenes desde GitHub
const {
  imagenesProyectos,
  cargandoImagenes,
  errorCarga,
  opcionesSelector: imagenesDisponibles,
  estadisticas: estadisticasImagenes,
  cargarImagenesProyectos,
  recargarImagenes
} = useGitHubAssets()

// Estado del componente
const tabActiva = ref('mensajes')
const loading = ref(false)
const dialogMensaje = ref(false)
const dialogCV = ref(false)
const dialogProyecto = ref(false)
const dialogEliminar = ref(false)
const mensajeSeleccionado = ref(null)
const solicitudSeleccionada = ref(null)
const proyectoEditando = ref(null)
const proyectoAEliminar = ref(null)
const formularioValido = ref(false)
const guardandoProyecto = ref(false)
const formProyecto = ref(null)
const poblando = ref(false)

// Variables para snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// Datos reactivos
const estadisticas = reactive({
  totalMensajes: 0,
  totalSolicitudesCV: 0,
  totalVisitas: 0
})

// Formulario de proyecto
const formularioProyecto = reactive({
  titulo: '',
  descripcion: '',
  imagen: '',
  tecnologias: [],
  enlaceDemo: '',
  enlaceGithub: '',
  esEstrella: false,
  mostrarEnHome: false,
  mostrarEnPortafolio: true, // Por defecto true para mostrar en portafolio
  estaPublicado: false,
  mensajePublicacion: '',
  caracteristicas: []
})

// Los proyectos ahora vienen del store

// Tecnologías disponibles
const tecnologiasDisponibles = [
  'Vue.js', 'React', 'Angular', 'Node.js', 'Express.js', 'Python', 'Java',
  'Spring Boot', 'PostgreSQL', 'MongoDB', 'Firebase', 'MySQL', 'Docker',
  'AWS', 'Google Cloud', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
  'Bootstrap', 'Tailwind CSS', 'Vuetify', 'Material UI', 'Redux', 'Vuex',
  'Pinia', 'Chart.js', 'D3.js', 'Stripe', 'PayPal', 'Socket.io', 'GraphQL',
  'REST API', 'Microservicios', 'Git', 'GitHub', 'GitLab', 'Figma', 'Adobe XD'
]

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es obligatorio'
}

// Computed properties
const mensajes = computed(() => store.mensajes)
const solicitudesCV = computed(() => store.solicitudesCV)
const proyectos = computed(() => store.proyectos)
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

const headersProyectos = [
  { title: 'Imagen', key: 'imagen', sortable: false },
  { title: 'Título', key: 'titulo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Estrella', key: 'esEstrella', sortable: false },
  { title: 'En Home', key: 'mostrarEnHome', sortable: false },
  { title: 'En Portafolio', key: 'mostrarEnPortafolio', sortable: false },
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

const generarCVPersonalizado = async () => {
  if (!solicitudSeleccionada.value) {
    console.error('❌ No hay solicitud seleccionada')
    return
  }

  try {
    console.log('🚀 Iniciando generación de CV personalizado para:', solicitudSeleccionada.value)

    // Mostrar loading
    loading.value = true

    // Preparar datos para el CV
    const datosSolicitud = {
      posicion: solicitudSeleccionada.value.posicion,
      habilidades: solicitudSeleccionada.value.habilidadesSeleccionadas || [],
      descripcionCargo: solicitudSeleccionada.value.descripcionCargo || solicitudSeleccionada.value.descripcionPuesto || '',
      empresa: solicitudSeleccionada.value.empresa || '',
      reclutador: solicitudSeleccionada.value.reclutador || ''
    }

    console.log('📋 Datos de la solicitud:', datosSolicitud)

    // Llamar al servicio de generación de CV
    const resultado = await store.generarCVPersonalizado(datosSolicitud)

    if (resultado.success) {
      console.log('✅ CV generado exitosamente')

      // Usar el servicio existente que ya funciona en /cv
      const { default: cvGeneratorService } = await import('@/services/cvGeneratorService')
      const nombreArchivo = `CV_${datosSolicitud.posicion.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`

      // Generar PDF usando el servicio probado
      const pdfBlob = await cvGeneratorService.convertirHTMLaPDF(resultado.html, nombreArchivo)
      cvGeneratorService.descargarPDF(pdfBlob, nombreArchivo)

      console.log('📄 PDF generado y descargado exitosamente usando cvGeneratorService')

      // Mostrar mensaje de éxito
      snackbar.value = true
      snackbarText.value = '✅ CV personalizado generado y descargado como PDF exitosamente'
      snackbarColor.value = 'success'

      // Cerrar el dialog
      dialogCV.value = false

    } else {
      console.error('❌ Error al generar CV:', resultado.error)
      snackbar.value = true
      snackbarText.value = `❌ Error al generar CV: ${resultado.error}`
      snackbarColor.value = 'error'
    }

  } catch (error) {
    console.error('❌ Error inesperado al generar CV:', error)
    snackbar.value = true
    snackbarText.value = `❌ Error inesperado: ${error.message}`
    snackbarColor.value = 'error'
  } finally {
    loading.value = false
  }
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

// Funciones para gestión de proyectos
const cargarProyectos = async () => {
  const resultado = await store.cargarProyectos()
  if (resultado.success) {
    estadisticas.totalProyectos = store.proyectos.length
  }
  return resultado
}

const abrirFormularioProyecto = (proyecto = null) => {
  if (proyecto) {
    // Editar proyecto existente - asegurar que todos los campos estén definidos
    proyectoEditando.value = proyecto
    Object.assign(formularioProyecto, {
      titulo: proyecto.titulo || '',
      descripcion: proyecto.descripcion || '',
      imagen: proyecto.imagen || '',
      tecnologias: proyecto.tecnologias || [],
      enlaceDemo: proyecto.enlaceDemo || '',
      enlaceGithub: proyecto.enlaceGithub || '',
      esEstrella: Boolean(proyecto.esEstrella),
      mostrarEnHome: Boolean(proyecto.mostrarEnHome),
      mostrarEnPortafolio: proyecto.mostrarEnPortafolio !== undefined ? Boolean(proyecto.mostrarEnPortafolio) : true,
      estaPublicado: Boolean(proyecto.estaPublicado),
      mensajePublicacion: proyecto.mensajePublicacion || '',
      caracteristicas: proyecto.caracteristicas || []
    })
  } else {
    // Nuevo proyecto
    proyectoEditando.value = null
    Object.assign(formularioProyecto, {
      titulo: '',
      descripcion: '',
      imagen: '',
      tecnologias: [],
      enlaceDemo: '',
      enlaceGithub: '',
      esEstrella: false,
      mostrarEnHome: false,
      mostrarEnPortafolio: true, // Por defecto true para nuevos proyectos
      estaPublicado: false,
      mensajePublicacion: '',
      caracteristicas: []
    })
  }
  dialogProyecto.value = true
}

const cerrarFormularioProyecto = () => {
  dialogProyecto.value = false
  proyectoEditando.value = null
  formProyecto.value?.resetValidation()
}

const editarProyecto = (proyecto) => {
  abrirFormularioProyecto(proyecto)
}

const eliminarProyecto = (proyecto) => {
  proyectoAEliminar.value = proyecto
  dialogEliminar.value = true
}

const confirmarEliminacion = async () => {
  if (proyectoAEliminar.value) {
    const tituloProyecto = proyectoAEliminar.value.titulo
    const resultado = await store.eliminarProyecto(proyectoAEliminar.value.id)

    if (resultado.success) {
      dialogEliminar.value = false
      proyectoAEliminar.value = null

      // Notificación de éxito
      success(`Proyecto "${tituloProyecto}" eliminado exitosamente`)
    } else {
      // Notificación de error
      error(`Error al eliminar proyecto: ${resultado.error}`)
    }
  }
}

const guardarProyecto = async () => {
  if (!formularioValido.value) return

  guardandoProyecto.value = true

  try {
    const proyectoData = {
      titulo: formularioProyecto.titulo,
      descripcion: formularioProyecto.descripcion,
      imagen: formularioProyecto.imagen,
      tecnologias: formularioProyecto.tecnologias,
      enlaceDemo: formularioProyecto.enlaceDemo,
      enlaceGithub: formularioProyecto.enlaceGithub,
      esEstrella: formularioProyecto.esEstrella,
      mostrarEnHome: formularioProyecto.mostrarEnHome,
      mostrarEnPortafolio: formularioProyecto.mostrarEnPortafolio,
      estaPublicado: formularioProyecto.estaPublicado,
      mensajePublicacion: formularioProyecto.mensajePublicacion,
      caracteristicas: formularioProyecto.caracteristicas
    }

    let resultado
    if (proyectoEditando.value) {
      // Actualizar proyecto existente
      resultado = await store.actualizarProyecto(proyectoEditando.value.id, proyectoData)
    } else {
      // Crear nuevo proyecto
      resultado = await store.crearProyecto(proyectoData)
    }

    if (resultado.success) {
      cerrarFormularioProyecto()

      // Notificación de éxito
      const accion = proyectoEditando.value ? 'actualizado' : 'creado'
      success(`Proyecto "${proyectoData.titulo}" ${accion} exitosamente`)
    } else {
      // Notificación de error
      const accion = proyectoEditando.value ? 'actualizar' : 'crear'
      error(`Error al ${accion} proyecto: ${resultado.error}`)
    }

  } catch (err) {
    // Notificación de error inesperado
    error(`Error inesperado: ${err.message}`)
  } finally {
    guardandoProyecto.value = false
  }
}

// Función para poblar base de datos con ejemplos
const poblarBaseDatos = async () => {
  poblando.value = true

  try {
    // Notificación de inicio
    info('Poblando base de datos con proyectos de ejemplo...')

    const resultado = await poblarFirebaseConProyectos()

    if (resultado.creados > 0) {
      // Recargar proyectos después de crear
      await cargarProyectos()

      // Notificación de éxito
      success(`${resultado.creados} proyectos creados exitosamente`)
    }

    if (resultado.errores > 0) {
      // Notificación de advertencia
      error(`${resultado.errores} errores durante la creación`)
    }

  } catch (err) {
    // Notificación de error
    error(`Error al poblar base de datos: ${err.message}`)
  } finally {
    poblando.value = false
  }
}

// Inicialización
onMounted(async () => {
  cargarDatos()
  cargarProyectos()

  // Cargar imágenes desde GitHub
  await cargarImagenesProyectos()

  // Exponer funciones para testing en desarrollo
  if (import.meta.env.DEV) {
    window.store = store
    window.poblarBaseDatos = poblarBaseDatos
    window.poblarFirebaseConProyectos = poblarFirebaseConProyectos
    console.log('🔧 Funciones expuestas para testing:')
    console.log('   - window.store')
    console.log('   - window.poblarBaseDatos()')
    console.log('   - window.poblarFirebaseConProyectos()')
  }
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

.habilidades,
.tecnologias {
  margin: 1rem 0;
}

.habilidades-chips,
.tecnologias-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.descripcion-cargo {
  margin-top: 1.5rem;
}

.descripcion-texto {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
}

.descripcion-content {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Mantener compatibilidad con descripción antigua */
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

  .proyecto-imagen-mini {
    width: 50px;
    height: 35px;
  }

  .tecnologias-mini {
    max-width: 150px;
  }

  .imagen-seleccionada {
    flex-direction: column;
    gap: 8px;
  }
}

/* Estilos específicos para gestión de portafolio */
.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.proyecto-imagen-mini {
  width: 60px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.proyecto-imagen-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tecnologias-mini {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 200px;
}

.imagen-seleccionada {
  display: flex;
  align-items: center;
  gap: 12px;
}

.imagen-seleccionada img {
  width: 40px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.imagen-opcion {
  width: 50px;
  height: 35px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para el formulario de proyecto */
.v-dialog .v-card {
  background: var(--color-background);
  color: var(--color-text);
}

.v-dialog .v-card-title {
  background: rgba(0, 204, 204, 0.1);
  color: var(--color-primary);
  font-weight: 600;
}

/* Estilos para el selector de imágenes mejorado */
.imagen-selector-header {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.imagen-seleccionada {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.imagen-seleccionada img {
  width: 50px;
  height: 35px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid rgba(0, 204, 204, 0.3);
}

.imagen-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.imagen-nombre {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.imagen-archivo {
  font-size: 0.75rem;
  color: var(--color-secondary);
  opacity: 0.8;
}

.imagen-opcion {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.2s ease;
}

.imagen-opcion:hover {
  border-color: var(--color-primary);
}

.error-carga {
  margin-top: 8px;
}

.imagenes-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

/* Animación para el botón de recarga */
.v-btn--loading .v-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
