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
            <h4>Asistente Maiko Studios</h4>
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
          <v-icon color="primary" size="48">mdi-hand-wave</v-icon>
          <h3>¡Hola! Soy el asistente de Maiko Studios</h3>
          <p>¿En qué puedo ayudarte hoy?</p>

          <!-- Aviso de modo demo -->
          <v-alert type="info" variant="tonal" density="compact" class="demo-alert">
            <small>Modo Demo: Respuestas predefinidas (GPT no configurado)</small>
          </v-alert>

          <!-- Respuestas rápidas iniciales -->
          <div class="respuestas-rapidas">
            <v-chip v-for="respuesta in respuestasRapidasIniciales" :key="respuesta" class="respuesta-chip"
              color="primary" variant="outlined" @click="enviarRespuestaRapida(respuesta)">
              {{ respuesta }}
            </v-chip>
          </div>
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

        <!-- Respuestas rápidas dinámicas -->
        <div v-if="respuestasRapidas.length > 0" class="respuestas-rapidas">
          <v-chip v-for="respuesta in respuestasRapidas" :key="respuesta" class="respuesta-chip" color="secondary"
            variant="outlined" size="small" @click="enviarRespuestaRapida(respuesta)">
            {{ respuesta }}
          </v-chip>
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
        <small>Powered by GPT • Maiko Studios</small>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { obtenerRespuestaGPT, generarRespuestasRapidas, notificarLead } from '@/services/gptService'

// Estado del chatbot
const chatAbierto = ref(false)
const mensajeActual = ref('')
const escribiendo = ref(false)
const mensajes = reactive([])
const respuestasRapidas = ref([])
const mensajesContainer = ref(null)

// Respuestas rápidas iniciales
const respuestasRapidasIniciales = [
  '¿Qué servicios ofrecen?',
  'Quiero una cotización',
  'Ver portfolio',
  'Contactar a Michael'
]

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

// Función para enviar mensaje
const enviarMensaje = async () => {
  if (!mensajeActual.value.trim()) return

  const mensaje = mensajeActual.value.trim()

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
    // Obtener respuesta de GPT
    const historial = mensajes.map(m => ({
      role: m.esUsuario ? 'user' : 'assistant',
      content: m.texto
    }))

    const resultado = await obtenerRespuestaGPT(mensaje, historial.slice(-10)) // Últimos 10 mensajes

    // Agregar respuesta del bot
    mensajes.push({
      texto: resultado.respuesta,
      esUsuario: false,
      timestamp: new Date()
    })

    // Generar respuestas rápidas basadas en la categoría
    respuestasRapidas.value = generarRespuestasRapidas(resultado.metadata.categoria)

    // Notificar si es un lead potencial
    if (resultado.metadata.esIntencionContratacion) {
      await notificarLead(mensajes, resultado.metadata)
    }

  } catch (error) {
    console.error('Error en el chat:', error)
    mensajes.push({
      texto: 'Disculpa, hubo un error. ¿Podrías intentar de nuevo?',
      esUsuario: false,
      timestamp: new Date()
    })
  } finally {
    escribiendo.value = false
    await nextTick()
    scrollToBottom()
  }
}

// Función para enviar respuesta rápida
const enviarRespuestaRapida = (respuesta) => {
  mensajeActual.value = respuesta
  enviarMensaje()
  respuestasRapidas.value = []
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
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
  background: #f8f9fa;
}

.mensaje-bienvenida {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.mensaje-bienvenida h3 {
  color: var(--color-primary);
  margin: 1rem 0 0.5rem 0;
}

.demo-alert {
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
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
}

.mensaje-texto {
  margin-bottom: 0.25rem;
}

.mensaje-hora {
  font-size: 0.7rem;
  opacity: 0.7;
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
  background: #999;
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
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-footer {
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  color: #999;
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
