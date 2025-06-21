import { ref, reactive } from 'vue'

// Estado global de notificaciones
const notifications = ref([])
let notificationId = 0

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Configuración por defecto
const DEFAULT_CONFIG = {
  duration: 5000,
  position: 'top-right',
  closable: true,
  persistent: false
}

export function useNotifications() {
  
  // Función para agregar notificación
  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, config = {}) => {
    const notification = {
      id: ++notificationId,
      message,
      type,
      timestamp: Date.now(),
      ...DEFAULT_CONFIG,
      ...config
    }
    
    notifications.value.push(notification)
    
    // Auto-remover si no es persistente
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, notification.duration)
    }
    
    return notification.id
  }
  
  // Función para remover notificación
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  // Función para limpiar todas las notificaciones
  const clearNotifications = () => {
    notifications.value = []
  }
  
  // Funciones de conveniencia
  const success = (message, config = {}) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, {
      duration: 4000,
      ...config
    })
  }
  
  const error = (message, config = {}) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, {
      duration: 8000,
      persistent: false,
      ...config
    })
  }
  
  const warning = (message, config = {}) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, {
      duration: 6000,
      ...config
    })
  }
  
  const info = (message, config = {}) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, {
      duration: 5000,
      ...config
    })
  }
  
  // Función para notificaciones de carga
  const loading = (message, config = {}) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, {
      persistent: true,
      closable: false,
      showProgress: true,
      ...config
    })
  }
  
  // Función para actualizar notificación existente
  const updateNotification = (id, updates) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      Object.assign(notification, updates)
    }
  }
  
  return {
    notifications: notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
    loading,
    updateNotification,
    NOTIFICATION_TYPES
  }
}

// Instancia global para usar en toda la app
export const globalNotifications = useNotifications()
