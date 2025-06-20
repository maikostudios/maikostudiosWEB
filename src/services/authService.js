// Servicio de autenticación para Maiko Studios
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/firebase/config'

// Lista de emails autorizados para acceder al panel de administración
const ADMIN_EMAILS = [
  'maikostudios@gmail.com',
  'm.esteban.saez@gmail.com',
  'admin@maikostudios.com'
]

// Credenciales de desarrollo/testing
const DEV_CREDENTIALS = {
  email: 'maikostudios@gmail.com',
  password: '123456'
}

export const authService = {
  // Iniciar sesión
  async signIn(email, password) {
    try {
      // Verificar si Firebase Auth está configurado
      if (!auth || !isFirebaseConfigured()) {
        // Modo fallback - verificación local
        if (email === DEV_CREDENTIALS.email && password === DEV_CREDENTIALS.password) {
          const user = {
            uid: 'local-admin',
            email: DEV_CREDENTIALS.email,
            displayName: 'Michael Sáez (Local)',
            isLocal: true
          }
          
          localStorage.setItem('admin_authenticated', 'true')
          localStorage.setItem('admin_user', JSON.stringify(user))
          
          return { success: true, user }
        } else {
          throw new Error('Credenciales incorrectas')
        }
      }

      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Verificar que el usuario está autorizado
      if (!ADMIN_EMAILS.includes(user.email)) {
        await signOut(auth) // Cerrar sesión inmediatamente
        throw new Error('Usuario no autorizado para acceder al panel de administración')
      }

      // Usuario autenticado y autorizado
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Michael Sáez',
        isLocal: false
      }

      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_user', JSON.stringify(userData))

      return { success: true, user: userData }

    } catch (error) {
      console.error('Error en signIn:', error)
      
      // Mapear errores de Firebase a mensajes amigables
      let message = 'Error al iniciar sesión'
      
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no encontrado'
          break
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta'
          break
        case 'auth/invalid-email':
          message = 'Email inválido'
          break
        case 'auth/too-many-requests':
          message = 'Demasiados intentos fallidos. Intenta más tarde'
          break
        case 'auth/network-request-failed':
          message = 'Error de conexión. Verifica tu internet'
          break
        default:
          message = error.message || 'Error desconocido'
      }

      return { success: false, error: message }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      if (auth && isFirebaseConfigured()) {
        await signOut(auth)
      }
      
      // Limpiar almacenamiento local
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_user')
      
      return { success: true }
    } catch (error) {
      console.error('Error en signOut:', error)
      return { success: false, error: error.message }
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true'
    const userData = localStorage.getItem('admin_user')
    
    if (isAuth && userData) {
      try {
        const user = JSON.parse(userData)
        return { isAuthenticated: true, user }
      } catch (error) {
        console.error('Error parsing user data:', error)
        this.signOut() // Limpiar datos corruptos
        return { isAuthenticated: false, user: null }
      }
    }
    
    return { isAuthenticated: false, user: null }
  },

  // Obtener usuario actual
  getCurrentUser() {
    const { isAuthenticated, user } = this.isAuthenticated()
    return isAuthenticated ? user : null
  },

  // Verificar si el email está autorizado
  isAuthorizedEmail(email) {
    return ADMIN_EMAILS.includes(email)
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChange(callback) {
    if (auth && isFirebaseConfigured()) {
      return onAuthStateChanged(auth, (user) => {
        if (user && this.isAuthorizedEmail(user.email)) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Michael Sáez',
            isLocal: false
          }
          callback(userData)
        } else {
          callback(null)
        }
      })
    } else {
      // Modo local - verificar periódicamente
      const checkAuth = () => {
        const { user } = this.isAuthenticated()
        callback(user)
      }
      
      checkAuth() // Verificación inicial
      const interval = setInterval(checkAuth, 5000) // Verificar cada 5 segundos
      
      // Retornar función de cleanup
      return () => clearInterval(interval)
    }
  },

  // Restablecer contraseña (solo para Firebase)
  async resetPassword(email) {
    try {
      if (!auth || !isFirebaseConfigured()) {
        throw new Error('Restablecimiento de contraseña no disponible en modo local')
      }

      if (!this.isAuthorizedEmail(email)) {
        throw new Error('Email no autorizado')
      }

      await sendPasswordResetEmail(auth, email)
      return { success: true, message: 'Email de restablecimiento enviado' }
    } catch (error) {
      console.error('Error en resetPassword:', error)
      return { success: false, error: error.message }
    }
  }
}

export default authService
