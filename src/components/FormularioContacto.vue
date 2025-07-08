<template>
  <div class="formulario-contacto">
    <h2>Envíame un mensaje</h2>
    <p class="form-subtitle">Completa el formulario y te responderé lo antes posible</p>

    <v-form ref="form" v-model="valid" @submit.prevent="enviarFormulario">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="formulario.nombre" label="Nombre completo" :rules="[rules.required]" variant="outlined"
            color="primary" prepend-inner-icon="mdi-account" />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field v-model="formulario.email" label="Correo electrónico" :rules="[rules.required, rules.email]"
            variant="outlined" color="primary" prepend-inner-icon="mdi-email" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="formulario.telefono" label="Teléfono (opcional)" variant="outlined" color="primary"
            prepend-inner-icon="mdi-phone" />
        </v-col>

        <v-col cols="12" md="6">
          <v-select v-model="formulario.asunto" :items="asuntos" label="Asunto" :rules="[rules.required]"
            variant="outlined" color="primary" prepend-inner-icon="mdi-tag" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-textarea v-model="formulario.mensaje" label="Mensaje" :rules="[rules.required, rules.minLength]"
            variant="outlined" color="primary" prepend-inner-icon="mdi-message-text" rows="5" counter="500"
            maxlength="500" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-checkbox v-model="formulario.aceptaTerminos" :rules="[rules.required]" color="primary">
            <template #label>
              <span class="checkbox-label">
                Acepto los
                <a href="#" @click.prevent="mostrarTerminos = true">términos y condiciones</a>
                y autorizo el tratamiento de mis datos personales
              </span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn type="submit" color="primary" size="large" block :loading="enviando" :disabled="!valid">
            <v-icon left>mdi-send</v-icon>
            Enviar Mensaje
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- Snackbar para notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="5000" location="top">
      {{ snackbar.message }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Dialog para términos y condiciones -->
    <v-dialog v-model="mostrarTerminos" max-width="600">
      <v-card>
        <v-card-title>Términos y Condiciones</v-card-title>
        <v-card-text>
          <p>Al enviar este formulario, aceptas que:</p>
          <ul>
            <li>Tus datos serán utilizados únicamente para responder a tu consulta</li>
            <li>No compartiremos tu información con terceros</li>
            <li>Puedes solicitar la eliminación de tus datos en cualquier momento</li>
            <li>Los datos se almacenan de forma segura en Firebase</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="mostrarTerminos = false">
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMainStore } from '@/stores/main'

const store = useMainStore()

// Estado del formulario
const form = ref(null)
const valid = ref(false)
const enviando = ref(false)
const mostrarTerminos = ref(false)

// Datos del formulario
const formulario = reactive({
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: '',
  aceptaTerminos: false
})

// Opciones de asunto
const asuntos = [
  'Aplicación Móvil',
  'Automatización de Procesos',
  'Colaboración',
  'Consultoría Tecnológica',
  'Desarrollo Web',
  'Digitalización de Pymes',
  'Empresa en un Día',
  'Marketing Digital',
  'Mentoría y Capacitación',
  'Soporte Técnico',
  'Otro'
];


// Reglas de validación
const rules = {
  required: value => !!value || 'Este campo es obligatorio',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Ingresa un email válido'
  },
  minLength: value => value.length >= 10 || 'El mensaje debe tener al menos 10 caracteres'
}

// Estado del snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Función para mostrar notificaciones
const mostrarNotificacion = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Función para limpiar el formulario
const limpiarFormulario = () => {
  formulario.nombre = ''
  formulario.email = ''
  formulario.telefono = ''
  formulario.asunto = ''
  formulario.mensaje = ''
  formulario.aceptaTerminos = false
  form.value?.resetValidation()
}

// Función para enviar el formulario
const enviarFormulario = async () => {
  if (!valid.value) return

  enviando.value = true

  try {
    // Sanitizar datos de entrada
    const datos = {
      nombre: formulario.nombre.trim().substring(0, 100),
      email: formulario.email.trim().toLowerCase().substring(0, 254),
      telefono: formulario.telefono ? formulario.telefono.trim().substring(0, 20) : null,
      asunto: formulario.asunto.trim().substring(0, 200),
      mensaje: formulario.mensaje.trim().substring(0, 5000),
      origen: 'formulario_web'
    }

    // Validaciones adicionales de seguridad
    if (datos.nombre.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      throw new Error('Email inválido');
    }

    if (datos.mensaje.length < 10) {
      throw new Error('El mensaje debe tener al menos 10 caracteres');
    }

    const resultado = await store.enviarMensajeContacto(datos)

    if (resultado.success) {
      mostrarNotificacion('¡Mensaje enviado correctamente! Te responderé pronto.', 'success')
      limpiarFormulario()
    } else {
      mostrarNotificacion('Error al enviar el mensaje. Inténtalo de nuevo.', 'error')
    }
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    mostrarNotificacion('Error inesperado. Inténtalo de nuevo.', 'error')
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.formulario-contacto {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.formulario-contacto h2 {
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #cccccc;
  margin-bottom: 2rem;
}

.checkbox-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.checkbox-label a {
  color: var(--color-primary);
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

/* Personalizar los campos de Vuetify para el tema oscuro */
:deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.v-field--focused) {
  border-color: var(--color-primary);
}

:deep(.v-label) {
  color: #cccccc;
}

:deep(.v-field__input) {
  color: var(--color-text);
}
</style>
