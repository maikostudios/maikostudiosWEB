// Store principal de la aplicación
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contactService, cvService, statsService } from '@/firebase/services'

export const useMainStore = defineStore('main', () => {
  // Estado
  const loading = ref(false)
  const user = ref(null)
  const mensajes = ref([])
  const solicitudesCV = ref([])
  const estadisticas = ref({
    totalVisitas: 0,
    totalMensajes: 0,
    totalSolicitudesCV: 0
  })

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const mensajesNoLeidos = computed(() => 
    mensajes.value.filter(m => !m.leido).length
  )

  // Actions para contacto
  const enviarMensajeContacto = async (datos) => {
    loading.value = true
    try {
      const resultado = await contactService.enviarMensaje(datos)
      if (resultado.success) {
        // Registrar la interacción para estadísticas
        await statsService.registrarVisita('contacto-enviado')
      }
      return resultado
    } finally {
      loading.value = false
    }
  }

  const cargarMensajes = async () => {
    loading.value = true
    try {
      const resultado = await contactService.obtenerMensajes()
      if (resultado.success) {
        mensajes.value = resultado.data
      }
      return resultado
    } finally {
      loading.value = false
    }
  }

  const marcarMensajeLeido = async (mensajeId) => {
    try {
      const resultado = await contactService.marcarComoLeido(mensajeId)
      if (resultado.success) {
        // Actualizar el estado local
        const mensaje = mensajes.value.find(m => m.id === mensajeId)
        if (mensaje) {
          mensaje.leido = true
          mensaje.fechaLectura = new Date()
        }
      }
      return resultado
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error)
      return { success: false, error: error.message }
    }
  }

  // Actions para CV
  const enviarSolicitudCV = async (datos) => {
    loading.value = true
    try {
      const resultado = await cvService.guardarSolicitudCV(datos)
      if (resultado.success) {
        await statsService.registrarVisita('cv-solicitado')
      }
      return resultado
    } finally {
      loading.value = false
    }
  }

  const cargarSolicitudesCV = async () => {
    loading.value = true
    try {
      const resultado = await cvService.obtenerSolicitudesCV()
      if (resultado.success) {
        solicitudesCV.value = resultado.data
      }
      return resultado
    } finally {
      loading.value = false
    }
  }

  // Actions para estadísticas
  const registrarVisita = async (pagina) => {
    try {
      await statsService.registrarVisita(pagina)
    } catch (error) {
      console.error('Error al registrar visita:', error)
    }
  }

  const cargarEstadisticas = async () => {
    loading.value = true
    try {
      const resultado = await statsService.obtenerEstadisticas()
      if (resultado.success) {
        estadisticas.value = resultado.data
      }
      return resultado
    } finally {
      loading.value = false
    }
  }

  // Función para limpiar el estado (logout)
  const limpiarEstado = () => {
    user.value = null
    mensajes.value = []
    solicitudesCV.value = []
    estadisticas.value = {
      totalVisitas: 0,
      totalMensajes: 0,
      totalSolicitudesCV: 0
    }
  }

  return {
    // Estado
    loading,
    user,
    mensajes,
    solicitudesCV,
    estadisticas,
    
    // Getters
    isAuthenticated,
    mensajesNoLeidos,
    
    // Actions
    enviarMensajeContacto,
    cargarMensajes,
    marcarMensajeLeido,
    enviarSolicitudCV,
    cargarSolicitudesCV,
    registrarVisita,
    cargarEstadisticas,
    limpiarEstado
  }
})
