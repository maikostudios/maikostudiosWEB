// Servicio de Chatbot MaikoBot consumiendo la API de Node.js
import apiClient from '@/api/apiClient';

// Mantener función helper para el UI que requiere el saludo inmediato
export function obtenerSaludoInicial() {
  const hora = new Date().getHours();
  let saludo = "¡Hola!";
  if (hora < 12) saludo = "¡Buenos días!";
  else if (hora < 20) saludo = "¡Buenas tardes!";
  else saludo = "¡Buenas noches!";

  return `${saludo} Soy MaikoBot 🤖, el asistente de Maikostudios. \n\nPara brindarte la mejor atención, ¿podrías decirme tu nombre?`;
}

// Crear nueva conversación (Inicialización)
export async function crearConversacion(mensajeCompleto) {
  try {
    const response = await apiClient.post('/chatbot/conversation', {
      visitorName: mensajeCompleto
    });
    
    // Adaptar la respuesta del backend a la estructura que espera la UI
    return { 
      success: true, 
      id: response.data.conversationId, 
      data: { nombre: response.data.visitorName } 
    };
  } catch (error) {
    console.error("Error al crear conversación:", error);
    return { 
      success: false, 
      error: 'nombre_invalido', 
      mensaje: error.response?.data?.error || "⚠️ No pude procesar la conversación. Inténtalo de nuevo." 
    };
  }
}

// Enviar nuevo mensaje a la conversación
export async function manejarMensajeUsuario(mensaje, conversacionId, estadoActual) {
  try {
    const response = await apiClient.post('/chatbot/message', {
      conversationId: conversacionId,
      message: mensaje
    });

    // Mapear el 'status' del backend ('active' / 'finished') a la variable que usaba el frontend (usualmente lo dejaba igual o cambiaba a 'finalizada'/'esperandoContacto' etc)
    // El frontend usa 'estadoConversacion' para la lógica local (esperandoContacto, preguntarDuda), así que no debemos pisarlo sin cuidado.
    // Sin embargo, podemos mapear 'finished' a 'finalizada' si el backend ya cerró la sesión.
    let nuevoEstado = estadoActual;
    if (response.data.status === 'finished') {
      nuevoEstado = 'finalizada';
    }

    return {
      success: true,
      respuesta: response.data.response,
      nuevoEstado: nuevoEstado,
      derivadoAHumano: false // Por defecto, se podría ajustar si el backend envía la bandera
    };
  } catch (error) {
    console.error("Error al manejar mensaje:", error);
    return {
      success: false,
      respuesta: "Disculpa, hubo un error técnico. ¿Podrías intentar de nuevo?",
      error: error.message,
    };
  }
}
