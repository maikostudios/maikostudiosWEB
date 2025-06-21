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
        <v-btn icon size="small" variant="text" @click="cerrarChat">
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
        <v-text-field v-model="mensajeActual" placeholder="Escribe tu mensaje..." variant="outlined" density="compact"
          hide-details @keyup.enter="enviarMensaje" :disabled="escribiendo">
          <template #append-inner>
            <v-btn icon size="small" color="primary" :disabled="!mensajeActual.trim() || escribiendo"
              @click="enviarMensaje">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-actions>

      <!-- Footer con información -->
      <div class="chat-footer">
        <small>Powered by IA • Maiko Studios</small>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
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
const enviarMensaje = async () => {
  const mensaje = mensajeActual.value.trim()
  if (!mensaje || escribiendo.value) return

  // Si es el primer mensaje (estado inicio), crear conversación
  if (estadoConversacion.value === 'inicio') {
    try {
      const resultado = await crearConversacion(mensaje)

      if (resultado.success) {
        // Nombre extraído correctamente
        nombreUsuario.value = resultado.data.nombre
        conversacionId.value = resultado.id
        estadoConversacion.value = 'esperandoContacto'

        // Agregar mensaje del usuario
        mensajes.push({
          texto: mensaje,
          esUsuario: true,
          timestamp: new Date()
        })

        // Respuesta del bot pidiendo contacto con el nombre extraído
        const respuestaContacto = `¡Hola ${resultado.data.nombre}! 👋 Si se pierde la conversación, agradecería que me dejaras tu WhatsApp o correo electrónico para contactarte más tarde. ¿Cuál prefieres dejar?`

        mensajes.push({
          texto: respuestaContacto,
          esUsuario: false,
          timestamp: new Date()
        })

        mensajeActual.value = ''
        await nextTick()
        scrollToBottom()
        return
      } else if (resultado.error === 'nombre_invalido') {
        // Error en extracción de nombre - mantener estado inicio
        mensajes.push({
          texto: mensaje,
          esUsuario: true,
          timestamp: new Date()
        })

        mensajes.push({
          texto: resultado.mensaje,
          esUsuario: false,
          timestamp: new Date()
        })

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

  // Para mensajes posteriores, usar el sistema de manejo
  if (conversacionId.value) {
    // Agregar mensaje del usuario
    mensajes.push({
      texto: mensaje,
      esUsuario: true,
      timestamp: new Date()
    })

    mensajeActual.value = ''
    escribiendo.value = true

    await nextTick()
    scrollToBottom()

    try {
      const resultado = await manejarMensajeUsuario(mensaje, conversacionId.value, estadoConversacion.value)

      if (resultado.success) {
        // Agregar respuesta del bot
        mensajes.push({
          texto: resultado.respuesta,
          esUsuario: false,
          timestamp: new Date()
        })

        // Actualizar estado
        estadoConversacion.value = resultado.nuevoEstado
        derivadoAHumano.value = resultado.derivadoAHumano

      } else {
        mensajes.push({
          texto: resultado.respuesta || 'Disculpa, hubo un error. ¿Podrías intentar de nuevo?',
          esUsuario: false,
          timestamp: new Date()
        })
      }

    } catch (error) {
      console.error('Error en el chat:', error)
      mensajes.push({
        texto: 'Disculpa, hubo un error técnico. ¿Podrías intentar de nuevo?',
        esUsuario: false,
        timestamp: new Date()
      })
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
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.chat-toggle-btn {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.chat-window {
  width: 380px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-text h4 {
  margin: 0;
  font-size: 1rem;
}

.status {
  font-size: 0.8rem;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--color-background);
}

.mensaje-bienvenida {
  text-align: center;
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.mensaje-bienvenida h3 {
  color: var(--color-primary);
  margin: 1rem 0 0.5rem 0;
}

.estado-chip {
  margin: 1rem 0;
}

.derivacion-humano {
  margin: 1rem 0;
  max-width: 300px;
}

.mensaje {
  margin-bottom: 1rem;
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
  padding: 0.75rem 1rem;
  border-radius: 18px;
  position: relative;
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
  margin-bottom: 0.25rem;
}

.mensaje-hora {
  font-size: 0.7rem;
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.6);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
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

  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-10px);
  }
}

.respuestas-rapidas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.respuesta-chip {
  cursor: pointer;
  transition: transform 0.2s;
}

.respuesta-chip:hover {
  transform: scale(1.05);
}

.chat-input {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-footer {
  text-align: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .chatbot-container {
    bottom: 1rem;
    right: 1rem;
  }

  .chat-window {
    width: calc(100vw - 2rem);
    height: calc(100vh - 4rem);
  }
}
</style>
