<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir/cerrar chat -->
    <v-btn v-if="!chatAbierto" class="chat-toggle-btn" color="primary" size="large" icon elevation="8"
      @click="abrirChat">
      <v-icon size="28">mdi-chat</v-icon>
    </v-btn>

    <!-- Ventana del chat -->
    <v-card v-if="chatAbierto" class="chat-window" elevation="12">
      <!-- Header del chat -->
      <v-card-title class="chat-header">
        <div class="header-info">
          <v-avatar size="40" color="primary">
            <v-icon color="white">mdi-robot</v-icon>
          </v-avatar>
          <div class="header-text">

            <h5>MaikoBot 🤖</h5>
            <h6>Asistente de Maiko Studios</h6>
            <span class="status">En línea</span>
          </div>
        </div>
        <!-- Botón de cerrar movido a la esquina superior derecha -->
        <v-btn icon size="small" variant="text" @click="cerrarChat" class="close-btn-absolute">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Área de mensajes -->
      <v-card-text class="chat-messages" ref="mensajesContainer">
        <!-- Mensaje de bienvenida -->
        <div v-if="mensajes.length === 0" class="mensaje-bienvenida">
          <v-icon color="primary" size="48">mdi-robot</v-icon>
          <h3>¡Hola! Soy MaikoBot 🤖</h3>
          <p>{{ mensajeInicial }}</p>

          <!-- Indicador de estado -->
          <v-chip :color="estadoConversacion === 'inicio' ? 'primary' : 'success'" variant="outlined" size="small"
            class="estado-chip">
            {{ estadoConversacion === 'inicio' ? 'Esperando tu nombre' : 'Conversación activa' }}
          </v-chip>
        </div>

        <!-- Mensajes de la conversación -->
        <div v-for="(mensaje, index) in mensajes" :key="index" class="mensaje"
          :class="{ 'mensaje-usuario': mensaje.esUsuario, 'mensaje-bot': !mensaje.esUsuario }">
          <div class="mensaje-contenido">
            <div class="mensaje-texto">{{ mensaje.texto }}</div>
            <div class="mensaje-hora">{{ formatearHora(mensaje.timestamp) }}</div>
          </div>
        </div>

        <!-- Botones de selección de contacto -->
        <div v-if="estadoConversacion === 'esperandoContacto' && !opcionContactoElegida" class="botones-contacto">
          <v-btn color="primary" @click="elegirOpcionContacto('telefono')" :disabled="escribiendo" aria-label="Elegir Teléfono">Teléfono</v-btn>
          <v-btn color="secondary" @click="elegirOpcionContacto('correo')" :disabled="escribiendo" aria-label="Elegir Correo Electrónico">Correo Electrónico</v-btn>
        </div>
        <!-- Input contextual para Teléfono o Correo -->
        <div v-if="estadoConversacion === 'esperandoContacto' && opcionContactoElegida">
          <div v-if="opcionContactoElegida === 'telefono'">
            <div class="mensaje mensaje-bot"><div class="mensaje-contenido">📞 Ingresa tu número de teléfono para poder contactarte.</div></div>
            <v-text-field
              v-model="inputContacto"
              placeholder="+56987654321"
              variant="outlined"
              density="compact"
              hide-details
              :aria-label="'Campo para ingresar teléfono'"
              :disabled="escribiendo"
              class="input-validacion"
              @input="validarTelefono"
              @keyup.enter="enviarContacto"
            />
            <div v-if="inputContacto && !telefonoValido" class="error-texto">Número inválido. Debe comenzar con 9 o +569 y tener 9 dígitos.</div>
            <!-- Eliminado el botón oculto para enviar teléfono -->
          </div>
          <div v-else-if="opcionContactoElegida === 'correo'">
            <div class="mensaje mensaje-bot"><div class="mensaje-contenido">📧 Ingresa tu correo electrónico para continuar.</div></div>
            <v-text-field
              v-model="inputContacto"
              placeholder="ejemplo@ejemplo.com"
              variant="outlined"
              density="compact"
              hide-details
              :aria-label="'Campo para ingresar correo electrónico'"
              :disabled="escribiendo"
              class="input-validacion"
              @keyup.enter="validarCorreoEnviar"
            />
            <div v-if="inputContacto && !correoValido" class="error-texto">Correo electrónico inválido.</div>
            <v-btn color="primary" :disabled="!correoValido" @click="enviarContacto" aria-label="Enviar Correo Electrónico" style="display: none;">Enviar</v-btn>
          </div>
        </div>
        <!-- Indicador de escritura -->
        <div v-if="escribiendo" class="mensaje mensaje-bot">
          <div class="mensaje-contenido">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Indicador de derivación a humano -->
        <div v-if="derivadoAHumano" class="derivacion-humano">
          <v-alert type="warning" variant="tonal" density="compact">
            <v-icon>mdi-account-supervisor</v-icon>
            <strong>Conversación derivada a equipo humano</strong>
            <br>
            <small>Te contactaremos pronto por WhatsApp o email</small>
          </v-alert>
        </div>
      </v-card-text>

      <!-- Input para escribir mensajes -->
      <v-card-actions class="chat-input">
        <v-text-field
          v-model="mensajeActual"
          :placeholder="placeholderInputChat"
          variant="outlined"
          density="compact"
          hide-details
          @keyup.enter="enviarMensaje"
          :disabled="escribiendo || (estadoConversacion === 'esperandoContacto' && !opcionContactoElegida)"
          :error="mostrarErrorInput"
          :aria-label="ariaLabelInput"
        >
          <template #append-inner>
            <v-btn icon size="small" color="primary" :disabled="!mensajeActual.trim() || escribiendo || (estadoConversacion === 'esperandoContacto' && !opcionContactoElegida) || mostrarErrorInput"
              @click="enviarMensaje">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <div v-if="mostrarErrorInput" class="error-texto">{{ mensajeErrorInput }}</div>
      </v-card-actions>

      <!-- Footer con información -->
      <div class="chat-footer">
        <small>Powered by IA • Maiko Studios</small>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, computed } from 'vue'
import {
  obtenerSaludoInicial,
  crearConversacion,
  manejarMensajeUsuario
} from '@/services/chatbotService'

// Estado del chatbot mejorado
const chatAbierto = ref(false)
const mensajeActual = ref('')
const escribiendo = ref(false)
const mensajes = reactive([])
const mensajesContainer = ref(null)

// Estado de la conversación
const conversacionId = ref(null)
const estadoConversacion = ref('inicio') // inicio, esperandoContacto, preguntarDuda, finalizada
const nombreUsuario = ref('')
const derivadoAHumano = ref(false)

// Mensaje inicial del bot
const mensajeInicial = obtenerSaludoInicial()

// Función para abrir el chat
const abrirChat = () => {
  chatAbierto.value = true
  nextTick(() => {
    scrollToBottom()
  })
}

// Función para cerrar el chat
const cerrarChat = () => {
  chatAbierto.value = false
}

// Función para enviar mensaje con nuevo sistema
const opcionContactoElegida = ref(null)
const inputContacto = ref("")
const telefonoValido = ref(false)
const correoValido = ref(false)
const intentoEnvioFallido = ref(false)

function elegirOpcionContacto(opcion) {
  opcionContactoElegida.value = opcion
  inputContacto.value = ""
  telefonoValido.value = false
  correoValido.value = false
  intentoEnvioFallido.value = false // Resetear al cambiar de opción
  nextTick(() => scrollToBottom())
}

function validarTelefono() {
  // Permite 949475207 o +56949475207 o 9xxxxxxxx sin +56
  const regex = /^(\+?56)?9\d{8}$/
  telefonoValido.value = regex.test(inputContacto.value.trim())
}
function validarCorreo() {
  // Validación básica de correo
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  correoValido.value = regex.test(inputContacto.value.trim())
}
async function enviarContacto() {
  if (opcionContactoElegida.value === 'telefono' && telefonoValido.value) {
    // Evitar duplicar el mensaje en mensajes y en mensajeActual
    mensajeActual.value = inputContacto.value
    inputContacto.value = ""
    telefonoValido.value = false
    await enviarMensaje()
    opcionContactoElegida.value = null
  } else if (opcionContactoElegida.value === 'correo' && correoValido.value) {
    mensajeActual.value = inputContacto.value
    inputContacto.value = ""
    correoValido.value = false
    await enviarMensaje()
    opcionContactoElegida.value = null
  }
}

const placeholderInputChat = computed(() => {
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'telefono') {
    return '+56987654321'
  } else if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'correo') {
    return 'ejemplo@ejemplo.com'
  }
  return 'Escribe tu mensaje...'
})
const ariaLabelInput = computed(() => {
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'telefono') {
    return 'Campo para ingresar teléfono'
  } else if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'correo') {
    return 'Campo para ingresar correo electrónico'
  }
  return 'Campo para escribir mensaje'
})
const mostrarErrorInput = computed(() => {
  if (!intentoEnvioFallido.value) {
    return false
  }
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'telefono') {
    return !/^(\+?56)?9\d{8}$/.test(mensajeActual.value.trim())
  }
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'correo') {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mensajeActual.value.trim())
  }
  return false
})
const mensajeErrorInput = computed(() => {
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'telefono') {
    return 'Número inválido. Debe comenzar con 9 o +569 y tener 9 dígitos.'
  }
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value === 'correo') {
    return 'Correo electrónico inválido.'
  }
  return ''
})

// Eliminar inputContacto, telefonoValido, correoValido y enviarContacto
// Modificar enviarMensaje para validar y restaurar placeholder
const enviarMensaje = async () => {
  const mensaje = mensajeActual.value.trim()
  if (!mensaje || escribiendo.value) return

  intentoEnvioFallido.value = false // Resetear al intentar enviar

  // Validar si estamos en estado de contacto y el mensaje es inválido
  if (estadoConversacion.value === 'esperandoContacto') {
    if (opcionContactoElegida.value === 'telefono') {
      if (!/^(\+?56)?9\d{8}$/.test(mensaje)) {
        intentoEnvioFallido.value = true
        return
      }
    } else if (opcionContactoElegida.value === 'correo') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mensaje)) {
        intentoEnvioFallido.value = true
        return
      }
    }
  }

  // Si es el primer mensaje (estado inicio), crear conversación
  if (estadoConversacion.value === 'inicio') {
    try {
      const resultado = await crearConversacion(mensaje)
      if (resultado.success) {
        nombreUsuario.value = resultado.data.nombre
        conversacionId.value = resultado.id
        estadoConversacion.value = 'esperandoContacto'
        mensajes.push({ texto: mensaje, esUsuario: true, timestamp: new Date() })
        const respuestaContacto = `¡Hola ${resultado.data.nombre}! 👋 Para poder contactarte si se pierde la conversación, ¿qué prefieres dejar?`
        mensajes.push({ texto: respuestaContacto, esUsuario: false, timestamp: new Date() })
        mensajeActual.value = ''
        await nextTick()
        scrollToBottom()
        return
      } else if (resultado.error === 'nombre_invalido') {
        mensajes.push({ texto: mensaje, esUsuario: true, timestamp: new Date() })
        mensajes.push({ texto: resultado.mensaje, esUsuario: false, timestamp: new Date() })
        mensajeActual.value = ''
        await nextTick()
        scrollToBottom()
        return
      } else {
        console.error('Error al crear conversación:', resultado.error)
      }
    } catch (error) {
      console.error('Error al crear conversación:', error)
    }
  }

  // Validación de contacto
  if (estadoConversacion.value === 'esperandoContacto' && opcionContactoElegida.value) {
    if (opcionContactoElegida.value === 'telefono') {
      if (!/^(\+?56)?9\d{8}$/.test(mensaje)) return
    } else if (opcionContactoElegida.value === 'correo') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mensaje)) return
    }
    // Evitar duplicar el mensaje en mensajes y en mensajeActual
    mensajeActual.value = ''
    opcionContactoElegida.value = null
    await nextTick()
    scrollToBottom()
    // Continuar flujo normal
  }

  if (conversacionId.value) {
    mensajes.push({ texto: mensaje, esUsuario: true, timestamp: new Date() })
    mensajeActual.value = ''
    escribiendo.value = true
    await nextTick()
    scrollToBottom()
    try {
      const resultado = await manejarMensajeUsuario(mensaje, conversacionId.value, estadoConversacion.value)
      if (resultado.success) {
        mensajes.push({ texto: resultado.respuesta, esUsuario: false, timestamp: new Date() })
        estadoConversacion.value = resultado.nuevoEstado
        derivadoAHumano.value = resultado.derivadoAHumano
      } else {
        mensajes.push({ texto: resultado.respuesta || 'Disculpa, hubo un error. ¿Podrías intentar de nuevo?', esUsuario: false, timestamp: new Date() })
      }
    } catch (error) {
      console.error('Error en el chat:', error)
      mensajes.push({ texto: 'Disculpa, hubo un error técnico. ¿Podrías intentar de nuevo?', esUsuario: false, timestamp: new Date() })
    } finally {
      escribiendo.value = false
      await nextTick()
      scrollToBottom()
    }
  }
}

// Función para enviar respuesta rápida (simplificada)
const enviarRespuestaRapida = (respuesta) => {
  mensajeActual.value = respuesta
  enviarMensaje()
}

// Función para hacer scroll al final
const scrollToBottom = () => {
  if (mensajesContainer.value) {
    mensajesContainer.value.scrollTop = mensajesContainer.value.scrollHeight
  }
}

// Función para formatear hora
const formatearHora = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Inicialización
onMounted(() => {
  // Auto-abrir chat después de 5 segundos si no se ha abierto
  setTimeout(() => {
    if (!chatAbierto.value) {
      // Mostrar una pequeña animación en el botón
      const btn = document.querySelector('.chat-toggle-btn')
      if (btn) {
        btn.style.animation = 'pulse 2s infinite'
      }
    }
  }, 5000)
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: clamp(0.75em, 4vw, 2em);
  right: clamp(0.75em, 4vw, 2em);
  z-index: 1000;
}

.chat-window {
  width: min(98vw, 24em);
  height: min(90vh, 32em);
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 10, 0.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.2em;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}

.chat-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.close-btn-absolute {
  position: absolute !important;
  top: 0.5em;
  right: 0.5em;
  z-index: 20;
  background: rgba(0,0,0,0.04);
  box-shadow: none;
}
@media (max-width: 600px) {
  .chat-header {
    padding: 0.5em 0.5em 0.5em 0.7em;
    border-radius: 1.2em 1.2em 0 0;
    min-height: 48px;
    flex-wrap: wrap;
    gap: 0.2em;
    position: relative;
  }
  .close-btn-absolute {
    top: 0.3em;
    right: 0.3em;
  }
}
.header-info {
  display: flex;
  align-items: center;
  gap: 0.75em;
}

.header-text h5 {
  margin: 0;
  font-size: 1.1em;
}

.header-text h6 {
  margin: 0;
  font-size: 0.95em;
  font-weight: 400;
}

.status {
  font-size: 0.8em;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1em;
  background: var(--color-background);
  scroll-behavior: smooth;
}

.mensaje-bienvenida {
  text-align: center;
  padding: 2em 1em;
  color: rgba(255, 255, 255, 0.8);
}

.mensaje-bienvenida h3 {
  color: var(--color-primary);
  margin: 1em 0 0.5em 0;
  font-size: 1.3em;
}

.estado-chip {
  margin: 1em 0;
}

.derivacion-humano {
  margin: 1em 0;
  max-width: 18em;
}

.mensaje {
  margin-bottom: 1em;
  display: flex;
}

.mensaje-usuario {
  justify-content: flex-end;
}

.mensaje-bot {
  justify-content: flex-start;
}

.mensaje-contenido {
  max-width: 80%;
  padding: 0.75em 1em;
  border-radius: 1.2em;
  position: relative;
  font-size: 1em;
}

.mensaje-usuario .mensaje-contenido {
  background: var(--color-primary);
  color: white;
}

.mensaje-bot .mensaje-contenido {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mensaje-texto {
  margin-bottom: 0.25em;
}

.mensaje-hora {
  font-size: 0.75em;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.6);
}

.typing-indicator {
  display: flex;
  gap: 0.3em;
  align-items: center;
}

.typing-indicator span {
  width: 0.6em;
  height: 0.6em;
  border-radius: 50%;
  background: var(--color-primary);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-0.6em); }
}

.chat-input {
  padding: 1em;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.chat-footer {
  text-align: center;
  padding: 0.5em;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95em;
}

@media (max-width: 600px) {
  .chatbot-container {
    bottom: 1.5em;
    right: 1.5em;
    left: 0;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 9999;
  }
  .chat-window {
    width: 96vw;
    max-width: 420px;
    height: 70vh;
    max-height: 80vh;
    margin: 0 auto;
    border-radius: 1.2em 1.2em 0.7em 0.7em;
    box-shadow: 0 6px 32px rgba(0,0,0,0.28);
    position: relative;
    bottom: 0;
  }
  .chat-header {
    padding: 0.5em 0.5em 0.5em 0.7em;
    border-radius: 1.2em 1.2em 0 0;
    min-height: 48px;
    flex-wrap: wrap;
    gap: 0.2em;
  }
  .header-info {
    min-width: 0;
    flex: 1 1 60%;
    gap: 0.5em;
  }
  .header-text h5, .header-text h6 {
    font-size: 1em;
    word-break: break-word;
  }
  .header-text {
    min-width: 0;
    flex-shrink: 1;
  }
  .chat-header > .v-btn {
    flex-shrink: 0;
    margin-left: 0.2em;
    z-index: 10;
  }
  .chat-messages {
    padding: 0.7em 0.7em 0.7em 0.7em;
    min-height: 30vh;
  }
}
</style>
