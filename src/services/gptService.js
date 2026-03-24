/**
 * Servicio genérico inteligente para consultas y chat centralizado
 */
import apiClient from '@/api/apiClient';

// Mantener helper para compatibilidad de categorización de consultas
export const categorizarConsulta = (mensaje) => {
  const mensajeLower = mensaje?.toLowerCase() || "";
  if (mensajeLower.includes("cv") || mensajeLower.includes("curriculum")) return "cv";
  if (mensajeLower.includes("servicio") || mensajeLower.includes("que hace")) return "servicios";
  if (mensajeLower.includes("precio") || mensajeLower.includes("costo")) return "presupuesto";
  if (mensajeLower.includes("contacto") || mensajeLower.includes("hablar")) return "contacto";
  if (mensajeLower.includes("experiencia") || mensajeLower.includes("portfolio")) return "experiencia";
  return "general";
};

// Generar respuestas de autocompletado para el UI del usuario
export const generarRespuestasRapidas = (categoria) => {
  const respuestasRapidas = {
    servicios: [
      "¿Qué tecnologías manejan?",
      "¿Hacen aplicaciones móviles?",
      "Cuéntame sobre consultoría",
    ],
    presupuesto: [
      "Necesito una cotización",
      "¿Cuánto cuesta un sitio web?",
      "Quiero hablar de mi proyecto",
    ],
    general: [
      "¿Qué servicios ofrecen?",
      "Quiero ver el portfolio",
      "Necesito contactar a Michael",
    ],
  };

  return respuestasRapidas[categoria] || respuestasRapidas.general;
};

// Envío a proxy directo en el Backend
export const obtenerRespuestaGPT = async (mensaje, historialConversacion = []) => {
  try {
    // OpenAI HTTP Proxy requiere: { messages, model, systemPrompt, userMessage, maxTokens }
    // Podemos empaquetar el flujo y enviarlo a /api/ai/openai
    const response = await apiClient.post('/ai/openai', {
      messages: historialConversacion.concat([{ role: 'user', content: mensaje }]),
      model: 'gpt-3.5-turbo'
    });
    
    return {
      success: true,
      respuesta: response.data.text,
      metadata: {
        categoria: categorizarConsulta(mensaje),
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error al obtener respuesta de GPT/Servidor IA:", error);

    // Respuesta de fallback si falla el backend
    return {
      success: false,
      respuesta: "¡Hola! Estoy experimentando problemas de red. Por favor, contáctanos a contacto@maikostudios.com",
      metadata: {
        categoria: categorizarConsulta(mensaje),
        timestamp: new Date().toISOString(),
        error: true,
      },
    };
  }
};
