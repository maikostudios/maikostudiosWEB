// Servicio de GPT para el chatbot de Maiko Studios
import OpenAI from "openai";

// Verificar si hay API key configurada
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Configuración de OpenAI (solo si hay API key)
let openai = null;
if (apiKey && apiKey.trim() !== "") {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Solo para desarrollo, en producción usar backend
  });
}

// Contexto base sobre Maiko Studios
const CONTEXT_MAIKOSTUDIOS = `
Eres un asistente virtual de Maiko Studios, empresa chilena de desarrollo web y consultoría tecnológica dirigida por Michael Sáez.

INFORMACIÓN DE LA EMPRESA:
- Nombre: Maiko Studios
- Ubicación: Temuco, Chile
- Fundador: Michael Esteban Sáez Contreras
- Especialidades: Desarrollo web, aplicaciones móviles, consultoría tecnológica, mentoría
- Tecnologías: Vue.js, React, Node.js, Python, Java, Firebase, PostgreSQL, MongoDB

SERVICIOS PRINCIPALES:
1. Desarrollo Web a Medida
2. Aplicaciones Móviles
3. Consultoría Tecnológica
4. Mentoría y Capacitación
5. Automatización de Procesos
6. Soporte Técnico

PROYECTO ESTRELLA:
- "De Una Transferencias": Sistema SaaS para transferencias y gestión financiera

CONTACTO:
- Email: contacto@maikostudios.com
- WhatsApp: +56 9 2064 8446
- LinkedIn: linkedin.com/in/me-saezc
- GitHub: github.com/maikostudios

PERSONALIDAD DEL ASISTENTE:
- Profesional pero cercano
- Conocedor de tecnología
- Orientado a soluciones
- Proactivo en detectar oportunidades de negocio
- Siempre dispuesto a ayudar

INSTRUCCIONES ESPECIALES:
- Si detectas interés en contratación, pregunta por detalles del proyecto
- Si mencionan presupuesto o timeline, deriva a contacto directo
- Promociona sutilmente los servicios cuando sea relevante
- Mantén respuestas concisas pero informativas
`;

// Función para detectar intención de contratación
export const detectarIntencionContratacion = (mensaje) => {
  const palabrasClave = [
    "contratar",
    "presupuesto",
    "cotizar",
    "proyecto",
    "desarrollar",
    "necesito",
    "quiero",
    "busco",
    "precio",
    "costo",
    "timeline",
    "cuando",
    "disponible",
    "urgente",
    "empresa",
    "negocio",
  ];

  const mensajeLower = mensaje.toLowerCase();
  return palabrasClave.some((palabra) => mensajeLower.includes(palabra));
};

// Función para categorizar el tipo de consulta
export const categorizarConsulta = (mensaje) => {
  const mensajeLower = mensaje.toLowerCase();

  if (mensajeLower.includes("cv") || mensajeLower.includes("curriculum")) {
    return "cv";
  }
  if (mensajeLower.includes("servicio") || mensajeLower.includes("que hace")) {
    return "servicios";
  }
  if (mensajeLower.includes("precio") || mensajeLower.includes("costo")) {
    return "presupuesto";
  }
  if (mensajeLower.includes("contacto") || mensajeLower.includes("hablar")) {
    return "contacto";
  }
  if (
    mensajeLower.includes("experiencia") ||
    mensajeLower.includes("portfolio")
  ) {
    return "experiencia";
  }

  return "general";
};

// Función principal para obtener respuesta de GPT
export const obtenerRespuestaGPT = async (
  mensaje,
  historialConversacion = []
) => {
  // Detectar intención de contratación
  const esIntencionContratacion = detectarIntencionContratacion(mensaje);
  const categoria = categorizarConsulta(mensaje);

  // Si no hay OpenAI configurado, usar respuestas de fallback
  if (!openai) {
    console.warn("OpenAI no configurado, usando respuestas de fallback");
    return {
      success: false,
      respuesta: getFallbackResponse(mensaje),
      metadata: {
        esIntencionContratacion,
        categoria,
        timestamp: new Date().toISOString(),
        fallback: true,
      },
    };
  }

  try {
    // Construir el prompt con contexto
    const mensajes = [
      {
        role: "system",
        content: CONTEXT_MAIKOSTUDIOS,
      },
      ...historialConversacion,
      {
        role: "user",
        content: mensaje,
      },
    ];

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mensajes,
      max_tokens: 300,
      temperature: 0.7,
    });

    const respuesta = completion.choices[0].message.content;

    return {
      success: true,
      respuesta,
      metadata: {
        esIntencionContratacion,
        categoria,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error al obtener respuesta de GPT:", error);

    // Respuesta de fallback
    return {
      success: false,
      respuesta: getFallbackResponse(mensaje),
      metadata: {
        esIntencionContratacion: detectarIntencionContratacion(mensaje),
        categoria: categorizarConsulta(mensaje),
        timestamp: new Date().toISOString(),
        error: true,
      },
    };
  }
};

// Respuestas de fallback cuando GPT no está disponible
const getFallbackResponse = (mensaje) => {
  const categoria = categorizarConsulta(mensaje);

  const respuestasFallback = {
    servicios:
      "¡Hola! Maiko Studios ofrece desarrollo web, aplicaciones móviles, consultoría tecnológica y mentoría. ¿Te interesa algún servicio en particular?",
    presupuesto:
      "Para cotizaciones personalizadas, te recomiendo contactar directamente a Michael al +56 9 2064 8446 o contacto@maikostudios.com",
    contacto:
      "Puedes contactar a Michael Sáez por WhatsApp: +56 9 2064 8446, email: contacto@maikostudios.com o LinkedIn: linkedin.com/in/me-saezc",
    cv: "Puedes descargar el CV de Michael desde la sección CV de esta web, incluso personalizado para tu oferta laboral.",
    experiencia:
      "Michael tiene más de 5 años de experiencia en desarrollo Full Stack con tecnologías como Vue.js, React, Node.js, Python y Java.",
    general:
      "¡Hola! Soy el asistente de Maiko Studios. ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros servicios, experiencia o ponerte en contacto con Michael.",
  };

  return respuestasFallback[categoria] || respuestasFallback.general;
};

// Función para generar respuestas rápidas sugeridas
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

// Función para notificar a Michael sobre leads importantes
export const notificarLead = async (conversacion, metadata) => {
  if (metadata.esIntencionContratacion) {
    // Aquí se implementaría la notificación por email/WhatsApp
    console.log("🚨 LEAD DETECTADO:", {
      timestamp: metadata.timestamp,
      categoria: metadata.categoria,
      ultimoMensaje: conversacion[conversacion.length - 1],
    });

    // En una implementación real, aquí se enviaría:
    // - Email a Michael
    // - Notificación push
    // - Mensaje a WhatsApp Business API

    return {
      success: true,
      message: "Notificación enviada a Michael",
    };
  }

  return {
    success: false,
    message: "No se detectó intención de contratación",
  };
};
