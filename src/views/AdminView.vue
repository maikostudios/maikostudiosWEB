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
                <v-btn color="primary" @click="abrirFormularioProyecto()">
                  <v-icon left>mdi-plus</v-icon>
                  Nuevo Proyecto
                </v-btn>
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
                    {{ item.esEstrella ? 'Estrella' : 'Normal' }}
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
              <v-col cols="12" md="8">
                <v-text-field v-model="formularioProyecto.titulo" label="Título del Proyecto" :rules="[rules.required]"
                  variant="outlined" />
              </v-col>
              <v-col cols="12" md="4">
                <v-switch v-model="formularioProyecto.esEstrella" label="Proyecto Estrella" color="accent" inset />
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
                <v-select v-model="formularioProyecto.imagen" :items="imagenesDisponibles" label="Imagen del Proyecto"
                  :rules="[rules.required]" variant="outlined" item-title="nombre" item-value="url">
                  <template #selection="{ item }">
                    <div class="imagen-seleccionada">
                      <img :src="item.raw.url" :alt="item.raw.nombre" />
                      <span>{{ item.raw.nombre }}</span>
                    </div>
                  </template>
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <img :src="item.raw.url" :alt="item.raw.nombre" class="imagen-opcion" />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
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
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/components/BaseLayout.vue'
import { useMainStore } from '@/stores/main'

const router = useRouter()
const store = useMainStore()

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
  caracteristicas: []
})

// Datos para proyectos
const proyectos = ref([])

// Imágenes disponibles del CDN
const imagenesDisponibles = ref([
  {
    nombre: 'Sistema de Gestión',
    url: 'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/sistema-gestion.jpg'
  },
  {
    nombre: 'E-commerce',
    url: 'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/ecommerce.jpg'
  },
  {
    nombre: 'Dashboard',
    url: 'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/dashboard.jpg'
  },
  {
    nombre: 'App Móvil',
    url: 'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/app-movil.jpg'
  },
  {
    nombre: 'API Microservicios',
    url: 'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/api-microservicios.jpg'
  }
])

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
  { title: 'Tipo', key: 'esEstrella', sortable: false },
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

// Funciones para gestión de proyectos
const cargarProyectos = async () => {
  // Por ahora usamos datos de ejemplo, luego se conectará con Firebase
  proyectos.value = [
    {
      id: '1',
      titulo: 'De Una Transferencias',
      descripcion: 'Sistema SaaS completo para gestión de transferencias financieras y administración de cuentas.',
      imagen: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
      tecnologias: ['Vue.js', 'Node.js', 'PostgreSQL', 'Firebase'],
      enlaceDemo: 'https://deuna.com',
      enlaceGithub: 'https://github.com/maikostudios/deuna',
      esEstrella: true,
      caracteristicas: ['Dashboard administrativo', 'API REST', 'Autenticación segura', 'Reportes en tiempo real']
    },
    {
      id: '2',
      titulo: 'E-commerce Moderno',
      descripcion: 'Tienda online con carrito de compras, integración de pagos y panel administrativo completo.',
      imagen: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      tecnologias: ['React', 'Stripe', 'MongoDB'],
      enlaceDemo: '',
      enlaceGithub: '',
      esEstrella: false,
      caracteristicas: []
    }
  ]
}

const abrirFormularioProyecto = (proyecto = null) => {
  if (proyecto) {
    // Editar proyecto existente
    proyectoEditando.value = proyecto
    Object.assign(formularioProyecto, proyecto)
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
    // Aquí se implementaría la eliminación en Firebase
    const index = proyectos.value.findIndex(p => p.id === proyectoAEliminar.value.id)
    if (index > -1) {
      proyectos.value.splice(index, 1)
    }

    dialogEliminar.value = false
    proyectoAEliminar.value = null

    // Mostrar notificación de éxito
    console.log('Proyecto eliminado exitosamente')
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
      caracteristicas: formularioProyecto.caracteristicas
    }

    if (proyectoEditando.value) {
      // Actualizar proyecto existente
      const index = proyectos.value.findIndex(p => p.id === proyectoEditando.value.id)
      if (index > -1) {
        proyectos.value[index] = { ...proyectoEditando.value, ...proyectoData }
      }
    } else {
      // Crear nuevo proyecto
      const nuevoProyecto = {
        id: Date.now().toString(),
        ...proyectoData
      }
      proyectos.value.push(nuevoProyecto)
    }

    cerrarFormularioProyecto()

    // Mostrar notificación de éxito
    console.log('Proyecto guardado exitosamente')

  } catch (error) {
    console.error('Error al guardar proyecto:', error)
  } finally {
    guardandoProyecto.value = false
  }
}

// Inicialización
onMounted(() => {
  cargarDatos()
  cargarProyectos()
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
</style>
