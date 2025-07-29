<template>
  <div class="login-page">
    <!-- Efecto de luz de fondo -->
    <div class="login-background">
      <SpotlightEffect />
    </div>

    <div class="login-container">
      <v-card class="login-card" elevation="12">
        <v-card-title class="login-header">
          <img src="/logo/logo_maikostudio.png" alt="Maiko Studios" class="login-logo" />
          <h2>Panel de Administración</h2>
          <p>Acceso restringido para Michael Sáez</p>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="iniciarSesion">
            <v-text-field v-model="credenciales.email" label="Email" type="email" :rules="[rules.required, rules.email]"
              variant="outlined" prepend-inner-icon="mdi-email" class="mb-4" />

            <v-text-field v-model="credenciales.password" label="Contraseña"
              :type="mostrarPassword ? 'text' : 'password'" :rules="[rules.required]" variant="outlined"
              prepend-inner-icon="mdi-lock" :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="mostrarPassword = !mostrarPassword" />

            <v-btn type="submit" color="primary" size="large" block :loading="cargando" :disabled="!valid" class="mt-4">
              <v-icon left>mdi-login</v-icon>
              Iniciar Sesión
            </v-btn>

            <!-- Botón temporal para desarrollo -->
            <v-btn v-if="isDev" @click="crearUsuarioAdminDev" color="warning" variant="outlined" size="small" block
              class="mt-2">
              🔧 Crear Usuario Admin (DEV)
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>

      <!-- Enlace para volver al sitio principal -->
      <div class="back-to-site">
        <v-btn variant="text" color="primary" to="/">
          <v-icon left>mdi-arrow-left</v-icon>
          Volver al sitio principal
        </v-btn>
      </div>
    </div>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="5000" location="top">
      {{ snackbar.message }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useMainStore } from '@/stores/main'
import SpotlightEffect from '@/components/SpotlightEffect.vue'

const router = useRouter()
const store = useMainStore()

// Variable para detectar modo desarrollo
const isDev = import.meta.env.DEV

// Importar funciones de setup admin en desarrollo
if (import.meta.env.DEV) {
  import('@/scripts/setupAdmin.js').then(module => {
    // Exponer funciones globalmente
    window.crearUsuarioAdmin = module.crearUsuarioAdmin;
    window.probarLoginAdmin = module.probarLoginAdmin;
    window.verificarConfiguracion = module.verificarConfiguracion;

    console.log('🔧 Funciones de setup admin disponibles:');
    console.log('   - window.crearUsuarioAdmin()');
    console.log('   - window.probarLoginAdmin()');
    console.log('   - window.verificarConfiguracion()');
    console.log('');
    console.log('💡 Si el login falla, ejecuta: await window.crearUsuarioAdmin()');
  });
}

// Estado del componente
const form = ref(null)
const valid = ref(false)
const cargando = ref(false)
const mostrarPassword = ref(false)

// Credenciales del formulario
const credenciales = reactive({
  email: '',
  password: ''
})

// Estado del snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es obligatorio',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Ingresa un email válido'
  }
}

// Función para mostrar notificaciones
const mostrarNotificacion = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Función para iniciar sesión
const iniciarSesion = async () => {
  if (!valid.value) return

  cargando.value = true

  try {
    // Autenticación real con Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credenciales.email,
      credenciales.password
    )

    // Verificar que el usuario es Michael (por email)
    const emailsAutorizados = [
      'maikostudios@gmail.com',
      'm.esteban.saez@gmail.com',
      'admin@maikostudios.com',
      'michael@maikostudios.com'
    ]

    if (!emailsAutorizados.includes(userCredential.user.email)) {
      throw new Error('Usuario no autorizado para acceder al panel de administración')
    }

    // Guardar usuario en el store
    store.user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || 'Michael Sáez'
    }

    mostrarNotificacion('Sesión iniciada correctamente', 'success')
    router.push('/admin')
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    let mensaje = 'Error al iniciar sesión'
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = 'Usuario no encontrado'
        break
      case 'auth/wrong-password':
        mensaje = 'Contraseña incorrecta'
        break
      case 'auth/invalid-email':
        mensaje = 'Email inválido'
        break
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos. Intenta más tarde'
        break
      default:
        mensaje = error.message || 'Error desconocido'
    }
    mostrarNotificacion(mensaje, 'error')
  } finally {
    cargando.value = false
  }
}

// Función para crear usuario admin en desarrollo
const crearUsuarioAdminDev = async () => {
  try {
    cargando.value = true
    console.log('🔧 Creando usuario admin en Firebase Auth...')

    const adminConfig = {
      email: 'maikostudios@gmail.com',
      password: '123456'
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminConfig.email,
      adminConfig.password
    )

    console.log('✅ Usuario admin creado exitosamente:', userCredential.user.email)
    mostrarNotificacion('Usuario admin creado exitosamente. Ahora puedes hacer login.', 'success')

    // Llenar automáticamente el formulario
    credenciales.email = adminConfig.email
    credenciales.password = adminConfig.password

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error)
    if (error.code === 'auth/email-already-in-use') {
      mostrarNotificacion('El usuario admin ya existe. Puedes hacer login normalmente.', 'info')
      // Llenar automáticamente el formulario
      credenciales.email = 'maikostudios@gmail.com'
      credenciales.password = '123456'
    } else {
      mostrarNotificacion(`Error creando usuario: ${error.message}`, 'error')
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  position: relative;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  padding: 2rem 2rem 1rem 2rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  flex-direction: column;
}

.login-logo {
  width: 80px;
  margin-bottom: 1rem;
  filter: brightness(0) invert(1);
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.back-to-site {
  text-align: center;
  margin-top: 2rem;
}

:deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.8);
}

:deep(.v-label) {
  color: #666;
}

:deep(.v-field__input) {
  color: #333;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    margin: 0;
  }
}
</style>