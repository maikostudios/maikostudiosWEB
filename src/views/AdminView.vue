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
          <v-tab value="precios">
            <v-icon left>mdi-currency-usd</v-icon>
            Gestión de Precios
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

          <!-- Tab de Gestión de Precios -->
          <v-window-item value="precios">
            <div class="tab-content">
              <div class="section-header">
                <h2>Gestión de Precios</h2>
              </div>

              <!-- Sub-pestañas para Packs y Planes -->
              <v-tabs v-model="subTabPrecios" class="pricing-sub-tabs mb-4">
                <v-tab value="packs">
                  <v-icon left>mdi-package-variant</v-icon>
                  Packs (Pago Único)
                </v-tab>
                <v-tab value="planes">
                  <v-icon left>mdi-calendar-month</v-icon>
                  Planes (Suscripción)
                </v-tab>
              </v-tabs>

              <v-window v-model="subTabPrecios">
                <!-- Sub-tab de Packs -->
                <v-window-item value="packs">
                  <div class="section-header">
                    <h3>Packs de Pago Único</h3>
                    <v-btn color="primary" @click="abrirDialogPack()">
                      <v-icon left>mdi-plus</v-icon>
                      Nuevo Pack
                    </v-btn>
                  </div>

                  <v-data-table :headers="headersPacks" :items="pricingPacks" :loading="loadingPacks"
                    class="admin-table" item-value="id">
                    <template #item.price="{ item }">
                      ${{ formatPrice(item.price.monthly) }}/único
                    </template>

                    <template #item.active="{ item }">
                      <v-switch v-model="item.active" color="success" hide-details
                        @update:model-value="togglePackActive(item)"></v-switch>
                    </template>

                    <template #item.badge="{ item }">
                      <v-chip v-if="item.badge?.show" :color="item.badge.color" size="small">
                        {{ item.badge.text }}
                      </v-chip>
                    </template>

                    <template #item.actions="{ item }">
                      <v-btn icon size="small" color="primary" @click="editarPack(item)" class="mr-1">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon size="small" color="error" @click="eliminarPack(item)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-window-item>

                <!-- Sub-tab de Planes -->
                <v-window-item value="planes">
                  <div class="section-header">
                    <h3>Planes de Suscripción</h3>
                    <v-btn color="secondary" @click="abrirDialogPlan()">
                      <v-icon left>mdi-plus</v-icon>
                      Nuevo Plan
                    </v-btn>
                  </div>

                  <v-data-table :headers="headersPlanes" :items="pricingPlans" :loading="loadingPlans"
                    class="admin-table" item-value="id">
                    <template #item.monthlyPrice="{ item }">
                      ${{ formatPrice(item.monthlyPrice) }}/mes
                    </template>

                    <template #item.annualPrice="{ item }">
                      ${{ formatPrice(item.annualPrice) }}/año
                    </template>

                    <template #item.active="{ item }">
                      <v-switch v-model="item.active" color="success" hide-details
                        @update:model-value="togglePlanActive(item)"></v-switch>
                    </template>

                    <template #item.highlighted="{ item }">
                      <v-chip v-if="item.highlighted" color="success" size="small">
                        Destacado
                      </v-chip>
                    </template>

                    <template #item.actions="{ item }">
                      <v-btn icon size="small" color="primary" @click="editarPlan(item)" class="mr-1">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon size="small" color="error" @click="eliminarPlan(item)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-window-item>
              </v-window>
            </div>
          </v-window-item>

          <!-- Tab de Estadísticas -->
          <!-- Tab de Solicitudes (Leads) -->
          <v-window-item value="solicitudes">
            <div class="tab-content">
              <div class="section-header">
                <h2>Solicitudes de Servicios</h2>
                <div class="d-flex gap-4">
                  <v-select v-model="filtros.estado" :items="estadosDisponibles" label="Estado" class="mr-2"
                    density="compact" clearable></v-select>
                  <v-select v-model="filtros.fuente" :items="fuentesDisponibles" label="Fuente" class="mr-2"
                    density="compact" clearable></v-select>
                  <v-btn color="primary" @click="cargarSolicitudes">
                    <v-icon left>mdi-refresh</v-icon>
                    Buscar
                  </v-btn>
                </div>
              </div>

              <v-data-table :headers="headersSolicitudes" :items="solicitudes" :loading="loading" class="admin-table"
                item-value="id">
                <template #item.fecha="{ item }">
                  {{ formatearFecha(item.fecha?.toDate?.()) }}
                </template>

                <template #item.estado="{ item }">
                  <v-select v-model="item.estado" :items="estadosDisponibles" dense hide-details style="max-width:120px"
                    @update:model-value="val => actualizarEstado(item, val)"></v-select>
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

    <!-- Dialog para crear/editar pack de precios -->
    <v-dialog v-model="dialogPack" max-width="800" persistent>
      <v-card>
        <v-card-title>
          {{ packEditando ? 'Editar Pack' : 'Nuevo Pack' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formPack" v-model="formValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="packForm.name" label="Nombre del Pack"
                  :rules="[v => !!v || 'Nombre es requerido']" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="packForm.subtitle" label="Subtítulo"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="packForm.price.monthly" label="Precio Mensual" type="number" prefix="$"
                  :rules="[v => v >= 0 || 'Precio debe ser positivo']"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="packForm.price.annual" label="Precio Anual" type="number"
                  prefix="$"></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select v-model="packForm.price.currency" :items="['USD', 'CLP', 'EUR']" label="Moneda"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-switch v-model="packForm.badge.show" label="Mostrar Badge" color="primary"></v-switch>
              </v-col>
              <v-col cols="12" md="6" v-if="packForm.badge.show">
                <v-text-field v-model="packForm.badge.text" label="Texto del Badge"></v-text-field>
              </v-col>
            </v-row>

            <v-row v-if="packForm.badge.show">
              <v-col cols="12" md="6">
                <v-select v-model="packForm.badge.color" :items="badgeColors" label="Color del Badge"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="packForm.styling.borderColor" :items="borderColors"
                  label="Color del Borde"></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="4">
                <v-switch v-model="packForm.styling.highlighted" label="Pack Destacado" color="primary"></v-switch>
              </v-col>
              <v-col cols="12" md="4">
                <v-switch v-model="packForm.styling.gradient" label="Borde Gradiente" color="primary"></v-switch>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model.number="packForm.order" label="Orden" type="number"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="featuresText" label="Características (una por línea)" rows="6"
                  hint="Escribe cada característica en una línea separada"></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="packForm.cta.text" label="Texto del Botón"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="packForm.active" label="Pack Activo" color="success"></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cerrarDialogPack">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarPack" :loading="guardandoPack" :disabled="!formValido">
            {{ packEditando ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para crear/editar plan de suscripción -->
    <v-dialog v-model="dialogPlan" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ planEditando ? 'Editar Plan' : 'Nuevo Plan' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formPlan" v-model="formValido">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="planForm.name" label="Nombre del Plan"
                  :rules="[v => !!v || 'Nombre es requerido']" required></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="planForm.description" label="Descripción" rows="3"
                  :rules="[v => !!v || 'Descripción es requerida']" required></v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="planForm.monthlyPrice" label="Precio Mensual (CLP)" type="number"
                  :rules="[v => !!v && v > 0 || 'Precio mensual es requerido']" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="planForm.annualPrice" label="Precio Anual (CLP)" type="number"
                  :rules="[v => !!v && v > 0 || 'Precio anual es requerido']" required></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-switch v-model="planForm.highlighted" label="Plan Destacado" color="primary"></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="planForm.order" label="Orden" type="number"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="featuresTextPlan" label="Características (una por línea)" rows="6"
                  hint="Escribe cada característica en una línea separada"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cerrarDialogPlan">Cancelar</v-btn>
          <v-btn color="secondary" @click="guardarPlan" :loading="guardandoPlan" :disabled="!formValido">
            {{ planEditando ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { auth } from '@/firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import BaseLayout from '@/components/BaseLayout.vue'
import { useMainStore } from '@/stores/main'
import { listarSolicitudes, actualizarEstadoSolicitud } from '@/services/firestoreService'
import { pricingService } from '@/services/pricingService'
import { poblarPricingPacks, limpiarPricingPacks } from '@/scripts/poblarPricingPacks'
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
const subTabPrecios = ref('packs')
const loading = ref(false)
const dialogMensaje = ref(false)
const dialogCV = ref(false)
const dialogPack = ref(false)
const dialogPlan = ref(false)
const mensajeSeleccionado = ref(null)
const solicitudSeleccionada = ref(null)

// Variables para gestión de precios
const pricingPacks = ref([])
const pricingPlans = ref([])
const loadingPacks = ref(false)
const loadingPlans = ref(false)
const packEditando = ref(null)
const planEditando = ref(null)
const guardandoPack = ref(false)
const guardandoPlan = ref(false)
const formValido = ref(false)
const formPack = ref(null)
const formPlan = ref(null)
const featuresText = ref('')
const featuresTextPlan = ref('')

// Formulario para pack de precios
const packForm = reactive({
  name: '',
  subtitle: '',
  price: {
    monthly: 0,
    annual: 0,
    currency: 'CLP'
  },
  badge: {
    text: '',
    color: 'primary',
    show: false
  },
  features: [],
  cta: {
    text: 'Contactar',
    action: 'contact',
    whatsapp: true
  },
  styling: {
    borderColor: 'primary',
    highlighted: false,
    gradient: false
  },
  active: true,
  order: 0,
  category: 'web'
})

// Formulario para plan de suscripción
const planForm = reactive({
  name: '',
  description: '',
  monthlyPrice: 0,
  annualPrice: 0,
  currency: 'CLP',
  highlighted: false,
  features: [],
  active: true,
  order: 0
})

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

const headersPacks = [
  { title: 'Nombre', key: 'name' },
  { title: 'Precio', key: 'price' },
  { title: 'Badge', key: 'badge' },
  { title: 'Activo', key: 'active' },
  { title: 'Orden', key: 'order' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const headersPlanes = [
  { title: 'Nombre', key: 'name' },
  { title: 'Precio Mensual', key: 'monthlyPrice' },
  { title: 'Precio Anual', key: 'annualPrice' },
  { title: 'Destacado', key: 'highlighted' },
  { title: 'Activo', key: 'active' },
  { title: 'Orden', key: 'order' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const badgeColors = [
  { title: 'Primario', value: 'primary' },
  { title: 'Éxito', value: 'success' },
  { title: 'Advertencia', value: 'warning' },
  { title: 'Error', value: 'error' },
  { title: 'Secundario', value: 'secondary' }
]

const borderColors = [
  { title: 'Primario', value: 'primary' },
  { title: 'Secundario', value: 'secondary' },
  { title: 'Éxito', value: 'success' },
  { title: 'Advertencia', value: 'warning' },
  { title: 'Error', value: 'error' }
]

const estadosDisponibles = ['pendiente', 'en progreso', 'respondido']
const fuentesDisponibles = ['Home', 'Campañas']

const filtros = reactive({ estado: '', fuente: '' })

const solicitudes = ref([])

async function cargarSolicitudes() {
  loading.value = true
  solicitudes.value = await listarSolicitudes({ ...filtros })
  loading.value = false
}

async function actualizarEstado(item, nuevoEstado) {
  const ok = await actualizarEstadoSolicitud(item.id, nuevoEstado)
  if (ok) success('Estado actualizado')
  else error('No se pudo actualizar')
}

function responderSolicitud(item) {
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

// Funciones para gestión de precios
const cargarPricingPacks = async () => {
  try {
    loadingPacks.value = true
    pricingPacks.value = await pricingService.getAllPacksAdmin()
  } catch (error) {
    console.error('Error cargando packs:', error)
  } finally {
    loadingPacks.value = false
  }
}

const abrirDialogPack = (pack = null) => {
  if (pack) {
    packEditando.value = pack
    Object.assign(packForm, pack)
    featuresText.value = pack.features.join('\n')
  } else {
    packEditando.value = null
    Object.assign(packForm, pricingService.getEmptyPack())
    featuresText.value = ''
  }
  dialogPack.value = true
}

const cerrarDialogPack = () => {
  dialogPack.value = false
  packEditando.value = null
  formPack.value?.reset()
}

const editarPack = (pack) => {
  abrirDialogPack(pack)
}

const guardarPack = async () => {
  if (!formPack.value?.validate()) return

  try {
    guardandoPack.value = true

    // Validación adicional
    if (!packForm.name || !packForm.name.trim()) {
      error('El nombre del pack es requerido')
      return
    }

    if (!packForm.price.monthly || packForm.price.monthly <= 0) {
      error('El precio mensual debe ser mayor a 0')
      return
    }

    // Convertir features de texto a array
    packForm.features = featuresText.value
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    if (packEditando.value) {
      await pricingService.updatePack(packEditando.value.id, packForm)
      success('Pack actualizado correctamente')
    } else {
      await pricingService.createPack(packForm)
      success('Pack creado correctamente')
    }

    await cargarPricingPacks()
    cerrarDialogPack()
  } catch (err) {
    console.error('Error guardando pack:', err)
    error('Error al guardar el pack')
  } finally {
    guardandoPack.value = false
  }
}

const eliminarPack = async (pack) => {
  if (confirm(`¿Estás seguro de eliminar el pack "${pack.name}"?`)) {
    try {
      await pricingService.deletePack(pack.id)
      success('Pack eliminado correctamente')
      await cargarPricingPacks()
    } catch (error) {
      console.error('Error eliminando pack:', error)
      error('Error al eliminar el pack')
    }
  }
}

const togglePackActive = async (pack) => {
  try {
    await pricingService.updatePack(pack.id, { active: pack.active })
    success(`Pack ${pack.active ? 'activado' : 'desactivado'} correctamente`)
  } catch (error) {
    console.error('Error actualizando pack:', error)
    error('Error al actualizar el pack')
  }
}

// ========== FUNCIONES PARA PLANES ==========

const cargarPricingPlans = async () => {
  try {
    loadingPlans.value = true
    const planesData = await pricingService.getAllPlansAdmin()
    // Clonar profundamente los datos para evitar mutaciones no deseadas
    pricingPlans.value = planesData.map(plan => ({
      ...plan,
      features: [...(plan.features || [])] // Clonar arrays anidados
    }))
    console.log('✅ Planes cargados:', pricingPlans.value.length)
  } catch (error) {
    console.error('Error cargando planes:', error)
    error('Error al cargar los planes')
  } finally {
    loadingPlans.value = false
  }
}

const abrirDialogPlan = (plan = null) => {
  if (plan) {
    planEditando.value = { ...plan } // Clonar para evitar mutaciones
    // Clonación profunda del plan para evitar referencias mutables
    Object.assign(planForm, {
      name: plan.name || '',
      description: plan.description || '',
      monthlyPrice: plan.monthlyPrice || 0,
      annualPrice: plan.annualPrice || 0,
      currency: plan.currency || 'CLP',
      highlighted: plan.highlighted || false,
      features: [...(plan.features || [])], // Clonar array
      active: plan.active !== undefined ? plan.active : true,
      order: plan.order || 0
    })
    featuresTextPlan.value = plan.features?.join('\n') || ''
  } else {
    planEditando.value = null
    Object.assign(planForm, pricingService.getEmptyPlan())
    featuresTextPlan.value = ''
  }
  dialogPlan.value = true
}

const cerrarDialogPlan = () => {
  dialogPlan.value = false
  planEditando.value = null
  Object.assign(planForm, pricingService.getEmptyPlan())
  featuresTextPlan.value = ''
  formPlan.value?.resetValidation()
}

const editarPlan = (plan) => {
  abrirDialogPlan(plan)
}

const guardarPlan = async () => {
  if (!formPlan.value?.validate()) return

  try {
    guardandoPlan.value = true

    // Validación adicional
    if (!planForm.name || !planForm.name.trim()) {
      error('El nombre del plan es requerido')
      return
    }

    if (!planForm.monthlyPrice || planForm.monthlyPrice <= 0) {
      error('El precio mensual debe ser mayor a 0')
      return
    }

    // Convertir features de texto a array
    const featuresArray = featuresTextPlan.value
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    // Crear objeto de datos limpio sin referencias mutables
    const planData = {
      name: planForm.name,
      description: planForm.description,
      monthlyPrice: Number(planForm.monthlyPrice),
      annualPrice: Number(planForm.annualPrice),
      currency: planForm.currency,
      highlighted: Boolean(planForm.highlighted),
      features: [...featuresArray], // Nueva copia del array
      active: Boolean(planForm.active),
      order: Number(planForm.order)
    }

    if (planEditando.value) {
      await pricingService.updatePlan(planEditando.value.id, planData)
      success('Plan actualizado correctamente')
    } else {
      await pricingService.createPlan(planData)
      success('Plan creado correctamente')
    }

    // Recargar datos para mantener consistencia
    await cargarPricingPlans()
    cerrarDialogPlan()
  } catch (err) {
    console.error('Error guardando plan:', err)
    error('Error al guardar el plan: ' + (err.message || 'Error desconocido'))
  } finally {
    guardandoPlan.value = false
  }
}

const eliminarPlan = async (plan) => {
  if (confirm(`¿Estás seguro de eliminar el plan "${plan.name}"?`)) {
    try {
      await pricingService.deletePlan(plan.id)
      success('Plan eliminado correctamente')
      await cargarPricingPlans()
    } catch (error) {
      console.error('Error eliminando plan:', error)
      error('Error al eliminar el plan')
    }
  }
}

const togglePlanActive = async (plan) => {
  try {
    // Crear copia del estado anterior para revertir si es necesario
    const estadoAnterior = plan.active

    await pricingService.updatePlan(plan.id, { active: plan.active })
    success(`Plan ${plan.active ? 'activado' : 'desactivado'} correctamente`)

    // Recargar datos para mantener consistencia
    await cargarPricingPlans()
  } catch (error) {
    console.error('Error actualizando plan:', error)
    error('Error al actualizar el plan')

    // Revertir cambio en la UI
    plan.active = !plan.active
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES').format(price)
}

const cerrarSesion = async () => {
  try {
    console.log('🚪 Cerrando sesión...')

    // Cerrar sesión en Firebase Auth
    await signOut(auth)

    // Limpiar estado local
    store.limpiarEstado()
    localStorage.removeItem('admin_authenticated')

    console.log('✅ Sesión cerrada exitosamente')

    // Redirigir al home
    router.push('/')

  } catch (error) {
    console.error('❌ Error cerrando sesión:', error)
    // En caso de error, redirigir al login
    router.push('/login')
  }
}

// Función para crear datos de prueba
const crearDatosPrueba = async () => {
  console.log('🚀 Creando datos de prueba...')

  try {
    // Crear packs de prueba
    const packsData = [
      {
        name: "Pack Básico Web",
        subtitle: "Perfecto para emprendedores",
        price: { monthly: 150000, annual: 1500000, currency: "CLP" },
        badge: { text: "Más Popular", color: "success", show: true },
        features: [
          "Sitio web responsive",
          "Hasta 5 páginas",
          "Formulario de contacto",
          "Optimización SEO básica",
          "Hosting por 1 año",
          "Certificado SSL",
          "Soporte por 3 meses"
        ],
        cta: { text: "Contactar", action: "contact", whatsapp: true },
        styling: { borderColor: "success", highlighted: true, gradient: false },
        active: true,
        order: 1,
        category: "web"
      },
      {
        name: "Pack E-commerce",
        subtitle: "Tienda online completa",
        price: { monthly: 350000, annual: 3500000, currency: "CLP" },
        badge: { text: "", color: "primary", show: false },
        features: [
          "Tienda online completa",
          "Hasta 100 productos",
          "Pasarela de pagos",
          "Panel de administración",
          "Gestión de inventario",
          "Reportes de ventas",
          "Hosting por 1 año",
          "Soporte por 6 meses"
        ],
        cta: { text: "Contactar", action: "contact", whatsapp: true },
        styling: { borderColor: "primary", highlighted: false, gradient: false },
        active: true,
        order: 2,
        category: "ecommerce"
      }
    ]

    // Crear planes de prueba
    const planesData = [
      {
        name: "Plan Básico",
        description: "Ideal para emprendedores que inician",
        monthlyPrice: 50000,
        annualPrice: 500000,
        currency: "CLP",
        highlighted: false,
        features: [
          "Consultoría mensual (2 horas)",
          "Soporte por WhatsApp",
          "Actualizaciones básicas",
          "Reportes mensuales",
          "Backup automático"
        ],
        active: true,
        order: 1
      },
      {
        name: "Plan Profesional",
        description: "Para negocios en crecimiento",
        monthlyPrice: 120000,
        annualPrice: 1200000,
        currency: "CLP",
        highlighted: true,
        features: [
          "Consultoría mensual (4 horas)",
          "Soporte prioritario 24/7",
          "Actualizaciones avanzadas",
          "Reportes semanales",
          "Backup automático",
          "Optimización SEO",
          "Análisis de competencia"
        ],
        active: true,
        order: 2
      }
    ]

    // Crear packs
    for (const packData of packsData) {
      await pricingService.createPack(packData)
      console.log(`✅ Pack "${packData.name}" creado`)
    }

    // Crear planes
    for (const planData of planesData) {
      await pricingService.createPlan(planData)
      console.log(`✅ Plan "${planData.name}" creado`)
    }

    // Recargar datos
    await cargarPricingPacks()
    await cargarPricingPlans()

    success('Datos de prueba creados correctamente')
    console.log('✅ Datos de prueba creados exitosamente')

  } catch (err) {
    console.error('❌ Error creando datos de prueba:', err)
    error('Error al crear datos de prueba')
  }
}

// Inicialización
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user && !user.isAnonymous && authService.isAuthorizedEmail(user.email)) {
      // Usuario admin autenticado, cargar datos del panel
      console.log('✅ Usuario admin autenticado:', user.email);

      // Cargar datos de forma secuencial para evitar conflictos
      try {
        await cargarDatos();
        await cargarSolicitudes();
        await cargarProyectos();
        await cargarPricingPacks();
        await cargarPricingPlans();
        await cargarImagenesProyectos();

        console.log('✅ Todos los datos del admin cargados correctamente');
      } catch (error) {
        console.error('❌ Error cargando datos del admin:', error);
        error('Error al cargar los datos del panel de administración');
      }

      // Exponer funciones para testing en desarrollo
      if (import.meta.env.DEV) {
        window.store = store;
        window.poblarPricingPacks = poblarPricingPacks;
        window.limpiarPricingPacks = limpiarPricingPacks;
        window.crearDatosPrueba = crearDatosPrueba;

        // Importar funciones de debug
        import('../../scripts/debug-auth-firestore.js').then(module => {
          window.debugAuthAndFirestore = module.debugAuthAndFirestore;
          window.debugFirebaseConfig = module.debugFirebaseConfig;
          window.debugFirestoreRules = module.debugFirestoreRules;
        });

        // Importar funciones de prueba básica
        import('../../scripts/test-simple-pack.js').then(module => {
          window.testSimplePack = module.testSimplePack;
          window.testSimplePlan = module.testSimplePlan;
          window.testReadPacks = module.testReadPacks;
          window.testReadPlans = module.testReadPlans;
          window.runBasicTests = module.runBasicTests;
        });

        // Importar funciones de prueba de creación
        import('../../scripts/test-pack-creation.js').then(module => {
          window.testPackCreationStepByStep = module.testPackCreationStepByStep;
          window.testPricingService = module.testPricingService;
          window.runFullTest = module.runFullTest;
        });

        // Importar pruebas de integración del panel admin
        import('../../scripts/test-admin-integration.js').then(module => {
          window.runAdminIntegrationTests = module.runAdminIntegrationTests;
          window.FirebaseConnectivityTests = module.FirebaseConnectivityTests;
          window.CRUDTests = module.CRUDTests;
          window.UITests = module.UITests;
        });

        // Importar monitor de tiempo real y estabilidad
        import('../../scripts/monitor-realtime-stability.js').then(module => {
          window.startRealtimeMonitoring = module.startRealtimeMonitoring;
          window.stopRealtimeMonitoring = module.stopRealtimeMonitoring;
          window.getMonitorStatus = module.getMonitorStatus;
        });

        // Importar suite completa de pruebas
        import('../../scripts/run-all-tests.js').then(module => {
          window.runAllAdminTests = module.runAllAdminTests;
          window.testResults = module.testResults;
          window.TEST_SUITE_CONFIG = module.TEST_SUITE_CONFIG;
        });

        // Importar funciones de creación de datos de muestra
        import('../../scripts/create-pricing-from-browser.js').then(module => {
          window.createSamplePricingData = module.createSamplePricingData;
          window.testPricingPageLoad = module.testPricingPageLoad;
        });

        console.log('🔧 Funciones expuestas para testing:');
        console.log('   - window.store');
        console.log('   - window.poblarPricingPacks()');
        console.log('   - window.limpiarPricingPacks()');
        console.log('   - window.crearDatosPrueba()');
        console.log('   - window.debugAuthAndFirestore()');
        console.log('   - window.debugFirebaseConfig()');
        console.log('   - window.debugFirestoreRules()');
        console.log('   - window.testSimplePack()');
        console.log('   - window.testSimplePlan()');
        console.log('   - window.testReadPacks()');
        console.log('   - window.testReadPlans()');
        console.log('   - window.runBasicTests()');
        console.log('   - window.testPackCreationStepByStep()');
        console.log('   - window.testPricingService()');
        console.log('   - window.runFullTest()');
        console.log('   - window.createSamplePricingData()');
        console.log('   - window.testPricingPageLoad()');
        console.log('');
        console.log('🧪 NUEVAS FUNCIONES DE PRUEBAS AVANZADAS:');
        console.log('   - window.runAdminIntegrationTests() - Pruebas completas del panel admin');
        console.log('   - window.startRealtimeMonitoring() - Monitor de tiempo real y estabilidad');
        console.log('   - window.stopRealtimeMonitoring() - Detener monitor');
        console.log('   - window.getMonitorStatus() - Estado actual del monitor');
        console.log('   - window.runAllAdminTests() - Suite completa de pruebas (RECOMENDADO)');
        console.log('');
        console.log('💡 Ejecuta cualquiera de estas funciones en la consola para probar funcionalidades específicas.');
        console.log('🎯 Para suite completa de pruebas, ejecuta: window.runAllAdminTests()');
        console.log('🔧 Para pruebas de integración, ejecuta: window.runAdminIntegrationTests()');
        console.log('📊 Para monitoreo continuo, ejecuta: window.startRealtimeMonitoring()');
        console.log('🧹 Para limpiar datos, ejecuta: window.limpiarPricingPacks()');
        console.log('🔍 Para debug, ejecuta: window.debugAuthAndFirestore()');
        console.log('');
        console.log('🚀 Panel de administración cargado exitosamente!');
        console.log('⚡ RECOMENDACIÓN: Ejecuta window.runAllAdminTests() para verificar todo el sistema');
      }
    } else {
      // Usuario no autorizado o anónimo
      if (user && user.isAnonymous) {
        console.warn('🚫 Usuario anónimo detectado en AdminView. Cerrando sesión anónima...');
        try {
          await authService.signOut();
        } catch (error) {
          console.error('Error cerrando sesión anónima:', error);
        }
      } else {
        console.warn('🚫 Usuario no autorizado en AdminView.');
      }
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
