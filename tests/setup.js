/**
 * Configuración global para pruebas con Vitest
 * Configura mocks, utilidades y entorno de testing
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'

// Mock de Firebase
vi.mock('@/firebase/config', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
  },
  db: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(),
        set: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      })),
      add: vi.fn(),
      get: vi.fn(),
      where: vi.fn(),
      orderBy: vi.fn(),
      limit: vi.fn(),
      onSnapshot: vi.fn()
    }))
  },
  isFirebaseConfigured: vi.fn(() => true)
}))

// Mock de servicios
vi.mock('@/services/authService', () => ({
  authService: {
    isAuthorizedEmail: vi.fn(),
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  }
}))

vi.mock('@/firebase/services', () => ({
  firebaseService: {
    obtenerMensajes: vi.fn(),
    obtenerSolicitudesCV: vi.fn(),
    obtenerProyectos: vi.fn(),
    obtenerEstadisticas: vi.fn(),
    marcarComoLeido: vi.fn(),
    eliminarMensaje: vi.fn(),
    actualizarEstadoCV: vi.fn(),
    crearProyecto: vi.fn(),
    actualizarProyecto: vi.fn(),
    eliminarProyecto: vi.fn(),
    contarMensajes: vi.fn()
  }
}))

vi.mock('@/services/pricingService', () => ({
  pricingService: {
    obtenerPacks: vi.fn(),
    obtenerPlanes: vi.fn(),
    crearPack: vi.fn(),
    actualizarPack: vi.fn(),
    eliminarPack: vi.fn(),
    crearPlan: vi.fn(),
    actualizarPlan: vi.fn(),
    eliminarPlan: vi.fn()
  }
}))

// Mock de router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/admin',
    name: 'Admin'
  })
}))

// Configuración global de Vue Test Utils
config.global.plugins = [
  createVuetify({
    theme: {
      defaultTheme: 'dark'
    }
  }),
  createPinia()
]

// Stubs globales para componentes que no necesitamos testear en detalle
config.global.stubs = {
  'router-link': true,
  'router-view': true,
  'v-app': true,
  'v-main': true,
  'v-container': true,
  'v-row': true,
  'v-col': true,
  'v-card': true,
  'v-card-title': true,
  'v-card-text': true,
  'v-btn': true,
  'v-icon': true,
  'v-tabs': true,
  'v-tab': true,
  'v-data-table': true,
  'v-form': true,
  'v-text-field': true,
  'v-textarea': true,
  'v-select': true,
  'v-badge': true,
  'v-dialog': true,
  'v-alert': true,
  'v-progress-circular': true,
  'v-snackbar': true
}

// Mock de APIs del navegador
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

// Mock de performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  }
})

// Mock de console para pruebas más limpias
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
}

// Utilidades de testing globales
global.testUtils = {
  createMockUser: (email = 'maikostudios@gmail.com') => ({
    uid: 'test-uid',
    email,
    isAnonymous: false,
    displayName: 'Test User'
  }),

  createMockMessage: (id = '1') => ({
    id,
    nombre: 'Test User',
    email: 'test@example.com',
    mensaje: 'Test message',
    fecha_creacion: new Date(),
    leido: false
  }),

  createMockProject: (id = '1') => ({
    id,
    titulo: 'Test Project',
    descripcion: 'Test description',
    tecnologias: ['Vue', 'Firebase'],
    activo: true,
    fecha_creacion: new Date()
  }),

  createMockPack: (id = '1') => ({
    id,
    nombre: 'Test Pack',
    precio: 299000,
    caracteristicas: ['Feature 1', 'Feature 2'],
    activo: true
  }),

  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))
}

// Configuración de timeouts para pruebas
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000
})
