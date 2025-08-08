// Servicio de Chatbot MaikoBot con IA + validaciones + strikes
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { pricingService } from "@/services/pricingService";

// Configuración del chatbot
const MAX_STRIKES = 5;
const MAX_RESPUESTAS_IA = 20;
const CHATBOT_API_KEY = import.meta.env.VITE_GEMINI_CHATBOT_API_KEY;

// Mensajes del sistema
const STRIKE_RESPUESTA =
  "💬 Solo puedo ayudarte con información sobre Maikostudios. ¿Sobre qué tema quieres saber?";
const RESPUESTA_FINAL_STRIKES = `⚠️ Lo siento, no hemos tenido buena comunicación. Por favor, contacta directamente a un humano:

📱 WhatsApp: https://wa.me/56920648446?text=No%20hemos%20podido%20conversar%20bien%20con%20el%20Chatbot,%20por%20eso%20te%20hemos%20derivado%20a%20ti%20humano!
✉️ Email: contacto@maikostudios.com
📝 Formulario: Usa el formulario de contacto en la página`;

// Regex para temas permitidos
const PERMITIDO_REGEX =
  /maiko|servicio|cv|qr|deuna|automatización|web|portafolio|producto|precio|plan|contratar|desarrollo|programación|tecnología|consultoría|proyecto|aplicación|sistema|software|digital|whatsapp|wasap|numero|telefono|contacto|email|correo|llamar|hablar|comunicar|escribir|mensaje|chat|horario|atención|atienden|disponibilidad|contactan|cuándo|agenda|agendar/i;

// Palabras a excluir para extracción de nombres
const STOPWORDS = [
  "a",
  "ante",
  "bajo",
  "con",
  "contra",
  "de",
  "desde",
  "durante",
  "en",
  "entre",
  "hacia",
  "hasta",
  "para",
  "por",
  "según",
  "sin",
  "sobre",
  "tras",
  "and",
  "the",
  "is",
  "at",
  "which",
  "on",
  "in",
  "by",
  "with",
  "you",
  "i",
  "we",
  "they",
  "he",
  "she",
  "eu",
  "ela",
  "ele",
  "da",
  "do",
  "um",
  "uma",
  "uns",
  "umas",
];

const PALABRAS_EXCLUIDAS = [
  "hola",
  "mi",
  "nombre",
  "es",
  "soy",
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "me",
  "llamo",
  "hi",
  "i'm",
  "am",
  "my",
  "the",
  "and",
  "a",
  "an",
  "he",
  "she",
  "it",
  "we",
  "they",
  "you",
  "buenas",
  "buenos",
  "días",
  "tardes",
  "noches",
  "saludos",
  "como",
  "estas",
];

const PALABRAS_OFENSIVAS = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "damn",
  "asshole",
  "dick",
  "cunt",
  "idiot",
  "stupid",
  "mierda",
  "puta",
  "gilipollas",
  "pendejo",
  "joder",
  "coño",
  "cojones",
  "chilero",
  "weon",
  "weona",
  "imbecil",
  "hijo de puta",
  "hostia",
  "caralho",
  "foda",
  "foda se",
  "porra",
  "foder",
  "merda",
  "filho da puta",
  "cacete",
  "pito",
  "puta que pariu",
  "macaca",
  "gringo",
  "culo",
  "polla",
  "concha",
  "chinga",
  "chingada",
  "chingar",
  "poto",
  "pija",
  "pixota",
  "piruca",
  "cabrão",
  "piça",
  "porn",
  "sex",
  "cock",
  "pussy",
  "slut",
  "whore",
  "ass",
  "conchatumadre",
  "conchasumadre",
  "ctm",
  "poronga",
  "porno",
  "puta",
  "puto",
  "wn",
  "wna",
  "maraca",
  "maraco",
];

// Función para extraer nombre limpio del mensaje del usuario
function extraerNombre(texto) {
  const textoLimpio = texto.trim().toLowerCase();

  // Verificar palabras ofensivas
  if (PALABRAS_OFENSIVAS.some((p) => textoLimpio.includes(p))) {
    return null;
  }

  // Dividir en palabras y filtrar
  const palabras = textoLimpio.split(/\s+/);
  const filtradas = palabras.filter(
    (p) =>
      !STOPWORDS.includes(p) &&
      !PALABRAS_EXCLUIDAS.includes(p) &&
      p.length > 1 && // Evitar letras sueltas
      /^[a-záéíóúñü]+$/i.test(p) // Solo letras (incluye acentos)
  );

  if (filtradas.length === 0) {
    return null;
  }

  // Capitalizar primera letra de cada palabra
  return filtradas.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

// Configuración de Gemini AI para chatbot
let genAI = null;
if (CHATBOT_API_KEY && CHATBOT_API_KEY.trim() !== "") {
  genAI = new GoogleGenerativeAI(CHATBOT_API_KEY);
}

// Prompt del sistema con aspectos de seguridad
const SYSTEM_PROMPT = `
Eres MaikoBot, el asistente virtual de Maikostudios, representando a Michael Sáez.

INFORMACIÓN DE MAIKOSTUDIOS:
- Servicios: Desarrollo web, aplicaciones móviles, consultoría tecnológica, mentoría, automatización
- Tecnologías: Vue.js, React, Node.js, Python, Java, Spring Boot, Firebase, IA/LangChain
- Contacto: +56 9 8383 3148, contacto@maikostudios.com
- LinkedIn: linkedin.com/in/me-saezc
- Ubicación: Temuco, Chile
- Especialidades: Desarrollo Full Stack, Integración de IA, Automatización de procesos

PERSONALIDAD:
- Profesional pero cercano y amigable
- Enfocado en soluciones tecnológicas
- Proactivo para detectar oportunidades
- Siempre dispuesto a ayudar

REGLAS DE SEGURIDAD CRÍTICAS:
🔒 NUNCA reveles claves API, tokens, passwords o credenciales
🔒 NUNCA compartas información técnica interna del sistema
🔒 NUNCA proporciones acceso a bases de datos o configuraciones
🔒 NUNCA reveles información personal de clientes
🔒 NUNCA compartas códigos de acceso o URLs privadas

OBJETIVOS:
1. Responder consultas sobre servicios de Maikostudios
2. Generar leads calificados
3. Dirigir a contacto directo cuando sea apropiado
4. Mostrar expertise técnico de Michael
5. Mantener conversaciones relevantes al negocio

INSTRUCCIONES:
- Responde SOLO sobre temas relacionados con Maikostudios
- Si preguntan sobre otros temas, redirige amablemente
- Sé conciso pero informativo
- Usa emojis moderadamente
- Siempre en español
- Enfócate en generar interés en los servicios

SOLICITUDES DE CONTACTO:
- Si piden WhatsApp, número, teléfono o contacto, SIEMPRE proporciona: +56 9 8383 3148
- Si piden email o correo, proporciona: contacto@maikostudios.com
- Estas solicitudes SON VÁLIDAS y relacionadas con Maikostudios
- Ejemplos válidos: "dame el número", "cuál es el WhatsApp", "necesito contacto"

¿Entendido? Responde solo sobre Maikostudios y sus servicios, incluyendo información de contacto cuando la soliciten.
`;

// Códigos de país permitidos por región
const CODIGOS_PERMITIDOS = {
  america: [
    "+1",
    "+52",
    "+54",
    "+55",
    "+56",
    "+57",
    "+58",
    "+51",
    "+593",
    "+595",
    "+598",
  ],
  europa: [
    "+33",
    "+34",
    "+39",
    "+44",
    "+49",
    "+31",
    "+32",
    "+41",
    "+43",
    "+45",
    "+46",
    "+47",
    "+48",
    "+351",
    "+353",
  ],
  asiaPacifico: [
    "+81",
    "+82",
    "+86",
    "+61",
    "+64",
    "+65",
    "+60",
    "+66",
    "+84",
    "+63",
    "+62",
  ],
};

// Códigos bloqueados (India y Medio Oriente)
const CODIGOS_BLOQUEADOS = [
  "+91",
  "+971",
  "+966",
  "+974",
  "+965",
  "+968",
  "+973",
  "+964",
  "+98",
  "+90",
  "+972",
  "+962",
  "+961",
  "+963",
  "+967",
  "+92",
  "+880",
  "+94",
];

// Función para obtener saludo según hora
export function obtenerSaludoInicial() {
  const hora = new Date().getHours();
  let saludo = "¡Hola!";
  if (hora < 12) saludo = "¡Buenos días!";
  else if (hora < 20) saludo = "¡Buenas tardes!";
  else saludo = "¡Buenas noches!";

  return `${saludo} Soy MaikoBot 🤖, el asistente de Maikostudios. 

Para brindarte la mejor atención, ¿podrías decirme tu nombre?`;
}

// Validación de teléfono por región
export function validarTelefono(telefono) {
  const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, "");

  // Verificar si es un código bloqueado
  const esBloqueado = CODIGOS_BLOQUEADOS.some((codigo) =>
    telefonoLimpio.startsWith(codigo)
  );
  if (esBloqueado) {
    return { valido: false, bloqueado: true, region: "bloqueada" };
  }

  // Verificar códigos permitidos
  const todosPermitidos = [
    ...CODIGOS_PERMITIDOS.america,
    ...CODIGOS_PERMITIDOS.europa,
    ...CODIGOS_PERMITIDOS.asiaPacifico,
  ];
  const esPermitido = todosPermitidos.some((codigo) =>
    telefonoLimpio.startsWith(codigo)
  );

  if (esPermitido) {
    let region = "desconocida";
    if (
      CODIGOS_PERMITIDOS.america.some((codigo) =>
        telefonoLimpio.startsWith(codigo)
      )
    )
      region = "america";
    else if (
      CODIGOS_PERMITIDOS.europa.some((codigo) =>
        telefonoLimpio.startsWith(codigo)
      )
    )
      region = "europa";
    else if (
      CODIGOS_PERMITIDOS.asiaPacifico.some((codigo) =>
        telefonoLimpio.startsWith(codigo)
      )
    )
      region = "asiaPacifico";

    return { valido: true, bloqueado: false, region };
  }

  return { valido: false, bloqueado: false, region: "desconocida" };
}

// Validación de email
export function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Detectar país por código de teléfono
export function detectarPais(telefono) {
  const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, "");

  const paises = {
    "+1": "Estados Unidos/Canadá",
    "+52": "México",
    "+54": "Argentina",
    "+55": "Brasil",
    "+56": "Chile",
    "+57": "Colombia",
    "+33": "Francia",
    "+34": "España",
    "+39": "Italia",
    "+44": "Reino Unido",
    "+49": "Alemania",
    "+81": "Japón",
    "+82": "Corea del Sur",
    "+86": "China",
    "+61": "Australia",
    "+64": "Nueva Zelanda",
  };

  for (const [codigo, pais] of Object.entries(paises)) {
    if (telefonoLimpio.startsWith(codigo)) {
      return pais;
    }
  }

  return "Desconocido";
}

// Crear nueva conversación en Firestore
export async function crearConversacion(mensajeCompleto) {
  try {
    // Extraer nombre limpio del mensaje
    const nombreExtraido = extraerNombre(mensajeCompleto);

    if (!nombreExtraido) {
      return {
        success: false,
        error: "nombre_invalido",
        mensaje:
          "⚠️ No pude detectar tu nombre correctamente. ¿Podrías repetirlo con claridad? Por ejemplo: 'Mi nombre es Juan'",
      };
    }

    const conversacionData = {
      nombre: nombreExtraido,
      mensaje_original: mensajeCompleto,
      telefono: null,
      email: null,
      pais_detectado: null,
      region_bloqueada: false,
      strikes_restantes: MAX_STRIKES,
      respuestas_ia_usadas: 0,
      estado_conversacion: "esperandoContacto",
      contacto_whatsapp: false,
      contacto_email: false,
      conversacion_completa: `Usuario: ${mensajeCompleto}\nBot: ${obtenerSaludoInicial()}\n`,
      metadata: {
        fecha_inicio: serverTimestamp(),
        fecha_ultima_interaccion: serverTimestamp(),
        derivado_a_humano: false,
        razon_finalizacion: null,
      },
    };

    const docRef = await addDoc(
      collection(db, "conversaciones_chatbot"),
      conversacionData
    );
    return { success: true, id: docRef.id, data: conversacionData };
  } catch (error) {
    console.error("Error al crear conversación:", error);
    return { success: false, error: error.message };
  }
}

// Actualizar conversación en Firestore
export async function actualizarConversacion(conversacionId, updates) {
  try {
    const docRef = doc(db, "conversaciones_chatbot", conversacionId);
    await updateDoc(docRef, {
      ...updates,
      "metadata.fecha_ultima_interaccion": serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar conversación:", error);
    return { success: false, error: error.message };
  }
}

// Función principal para manejar mensajes del usuario
export async function manejarMensajeUsuario(
  mensaje,
  conversacionId,
  estadoActual
) {
  try {
    // Obtener datos actuales de la conversación
    const docRef = doc(db, "conversaciones_chatbot", conversacionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Conversación no encontrada");
    }

    const conversacion = docSnap.data();
    let respuesta = "";
    let updates = {};

    // Agregar mensaje del usuario a la conversación
    const nuevaConversacion =
      conversacion.conversacion_completa + `Usuario: ${mensaje}\n`;

    // Manejar según el estado actual
    if (estadoActual === "esperandoContacto") {
      const resultadoContacto = await procesarContacto(mensaje, conversacion);
      respuesta = resultadoContacto.respuesta;
      updates = resultadoContacto.updates;
    } else if (estadoActual === "preguntarDuda") {
      const resultadoDuda = await procesarDuda(mensaje, conversacion);
      respuesta = resultadoDuda.respuesta;
      updates = resultadoDuda.updates;
    }

    // Actualizar conversación completa
    updates.conversacion_completa = nuevaConversacion + `Bot: ${respuesta}\n`;

    // Guardar en Firestore
    await actualizarConversacion(conversacionId, updates);

    return {
      success: true,
      respuesta,
      nuevoEstado: updates.estado_conversacion || estadoActual,
      derivadoAHumano: updates["metadata.derivado_a_humano"] || false,
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

// Procesar contacto (teléfono o email)
async function procesarContacto(mensaje, conversacion) {
  const validacionTel = validarTelefono(mensaje);

  if (validacionTel.valido && !validacionTel.bloqueado) {
    // Teléfono válido de región permitida
    const pais = detectarPais(mensaje);
    return {
      respuesta: `¡Perfecto! 📱 He guardado tu WhatsApp. ¿En qué puedo ayudarte hoy con respecto a Maikostudios?`,
      updates: {
        telefono: mensaje.trim(),
        pais_detectado: pais,
        region_bloqueada: false,
        estado_conversacion: "preguntarDuda",
      },
    };
  } else if (validacionTel.bloqueado) {
    // Región bloqueada - solo email
    return {
      respuesta: `Para tu región, prefiero que me dejes tu correo electrónico para contactarte. ¿Cuál es tu email? 📧`,
      updates: {
        region_bloqueada: true,
        strikes_restantes: conversacion.strikes_restantes - 1,
      },
    };
  } else if (validarEmail(mensaje)) {
    // Email válido - proporcionar WhatsApp también
    return {
      respuesta: `¡Gracias! 📧 He guardado tu email.

Para contacto directo también puedes escribir a nuestro WhatsApp: +56 9 8383 3148

¿En qué puedo ayudarte hoy con respecto a Maikostudios?`,
      updates: {
        email: mensaje.trim(),
        estado_conversacion: "preguntarDuda",
      },
    };
  } else {
    // Contacto inválido
    const strikesRestantes = conversacion.strikes_restantes - 1;

    if (strikesRestantes <= 0) {
      return {
        respuesta: RESPUESTA_FINAL_STRIKES,
        updates: {
          strikes_restantes: 0,
          estado_conversacion: "finalizada",
          "metadata.derivado_a_humano": true,
          "metadata.razon_finalizacion": "strikes",
        },
      };
    }

    return {
      respuesta: `⚠️ El contacto ingresado no parece válido. Inténtalo de nuevo con un número de WhatsApp (+56912345678) o un correo válido (ejemplo@email.com). Te quedan ${strikesRestantes} intentos.`,
      updates: {
        strikes_restantes: strikesRestantes,
      },
    };
  }
}

// Procesar dudas con IA
async function procesarDuda(mensaje, conversacion) {
  // Verificar si el mensaje está relacionado con Maikostudios
  if (!PERMITIDO_REGEX.test(mensaje)) {
    const strikesRestantes = conversacion.strikes_restantes - 1;

    if (strikesRestantes <= 0) {
      return {
        respuesta: RESPUESTA_FINAL_STRIKES,
        updates: {
          strikes_restantes: 0,
          estado_conversacion: "finalizada",
          "metadata.derivado_a_humano": true,
          "metadata.razon_finalizacion": "strikes",
        },
      };
    }

    return {
      respuesta: STRIKE_RESPUESTA,
      updates: {
        strikes_restantes: strikesRestantes,
      },
    };
  }

  // Verificar límite de respuestas IA
  const respuestasUsadas = conversacion.respuestas_ia_usadas + 1;

  if (respuestasUsadas >= MAX_RESPUESTAS_IA) {
    return {
      respuesta: RESPUESTA_FINAL_STRIKES,
      updates: {
        respuestas_ia_usadas: respuestasUsadas,
        estado_conversacion: "finalizada",
        "metadata.derivado_a_humano": true,
        "metadata.razon_finalizacion": "limite_respuestas",
      },
    };
  }

  // Sugerencias de derivación
  if (respuestasUsadas === 10) {
    const respuestaIA = await obtenerRespuestaIA(mensaje);
    return {
      respuesta: `${respuestaIA}\n\n📢 Te recomiendo hablar directamente con un humano para seguir avanzando mejor: https://wa.me/56983833148 o contacto@maikostudios.com`,
      updates: {
        respuestas_ia_usadas: respuestasUsadas,
      },
    };
  }

  if (respuestasUsadas > 8) {
    const respuestaIA = await obtenerRespuestaIA(mensaje);
    return {
      respuesta: `${respuestaIA}\n\n🔔 Ya llevamos varias respuestas. ¿Quieres que te derive a nuestro equipo humano por WhatsApp o email?`,
      updates: {
        respuestas_ia_usadas: respuestasUsadas,
      },
    };
  }

  // Respuesta normal con IA
  const respuestaIA = await obtenerRespuestaIA(mensaje);
  return {
    respuesta: respuestaIA,
    updates: {
      respuestas_ia_usadas: respuestasUsadas,
    },
  };
}

// Función para obtener información de precios desde Firestore
async function obtenerInformacionPrecios() {
  try {
    const [packs, plans] = await Promise.all([
      pricingService.getAllPacks(),
      pricingService.getAllPlans(),
    ]);

    let infoPreciosTexto = "\n\nINFORMACIÓN DE PRECIOS ACTUALIZADA:\n";

    if (packs.length > 0) {
      infoPreciosTexto += "\n🎯 PACKS (Pago único):\n";
      packs.forEach((pack) => {
        const precio = pack.price?.monthly
          ? `$${pack.price.monthly.toLocaleString()} CLP`
          : "Consultar precio";
        infoPreciosTexto += `- ${pack.name}: ${precio}\n`;
        if (pack.subtitle) infoPreciosTexto += `  ${pack.subtitle}\n`;
        if (pack.features && pack.features.length > 0) {
          infoPreciosTexto += `  Incluye: ${pack.features
            .slice(0, 3)
            .join(", ")}\n`;
        }
      });
    }

    if (plans.length > 0) {
      infoPreciosTexto += "\n📅 PLANES (Suscripción mensual):\n";
      plans.forEach((plan) => {
        const precio = plan.price?.monthly
          ? `$${plan.price.monthly.toLocaleString()} CLP/mes`
          : "Consultar precio";
        infoPreciosTexto += `- ${plan.name}: ${precio}\n`;
        if (plan.subtitle) infoPreciosTexto += `  ${plan.subtitle}\n`;
        if (plan.features && plan.features.length > 0) {
          infoPreciosTexto += `  Incluye: ${plan.features
            .slice(0, 3)
            .join(", ")}\n`;
        }
      });
    }

    if (packs.length === 0 && plans.length === 0) {
      infoPreciosTexto +=
        "\nActualmente estamos preparando nuestros paquetes de precios. Para cotizaciones personalizadas contacta directamente.";
    }

    infoPreciosTexto +=
      "\n\nPara más detalles visita: maikostudios.com/precios";

    return infoPreciosTexto;
  } catch (error) {
    console.error("Error obteniendo precios:", error);
    return "\n\nPara información de precios actualizada, contacta directamente o visita maikostudios.com/precios";
  }
}

// Obtener respuesta de Gemini AI
async function obtenerRespuestaIA(mensaje) {
  if (!genAI) {
    return getFallbackResponse(mensaje);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Verificar si la pregunta es sobre precios
    const esPreguntaPrecio =
      /precio|costo|cotización|plan|pack|tarifa|cuánto|valor/i.test(mensaje);

    let promptCompleto = SYSTEM_PROMPT;

    // Si es pregunta sobre precios, agregar información actualizada
    if (esPreguntaPrecio) {
      const infoPrecios = await obtenerInformacionPrecios();
      promptCompleto += infoPrecios;
    }

    const prompt = `${promptCompleto}\n\nUsuario pregunta: ${mensaje}\n\nResponde de manera profesional, concisa y enfocada en Maikostudios:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error con Gemini AI:", error);
    return getFallbackResponse(mensaje);
  }
}

// Respuestas de fallback cuando IA no está disponible
function getFallbackResponse(mensaje) {
  const mensajeLower = mensaje.toLowerCase();

  // Solicitudes específicas de WhatsApp/contacto
  if (
    mensajeLower.includes("whatsapp") ||
    mensajeLower.includes("wasap") ||
    mensajeLower.includes("numero") ||
    mensajeLower.includes("telefono") ||
    (mensajeLower.includes("dame") &&
      (mensajeLower.includes("numero") || mensajeLower.includes("contacto")))
  ) {
    return "📱 ¡Por supuesto! Nuestro WhatsApp es: +56 9 2064 8446\n\nTambién puedes contactarnos por email: contacto@maikostudios.com";
  }

  if (mensajeLower.includes("servicio") || mensajeLower.includes("qué hacen")) {
    return "🚀 Maikostudios ofrece desarrollo web, aplicaciones móviles, consultoría tecnológica y automatización con IA. ¿Te interesa algún servicio en particular?";
  }

  if (
    mensajeLower.includes("precio") ||
    mensajeLower.includes("costo") ||
    mensajeLower.includes("cotización") ||
    mensajeLower.includes("plan") ||
    mensajeLower.includes("pack")
  ) {
    return "💰 Puedes ver nuestros packs y planes actualizados en maikostudios.com/precios. Para cotizaciones personalizadas, contacta directamente a Michael al +56 9 8383 3148 o contacto@maikostudios.com";
  }

  if (mensajeLower.includes("cv") || mensajeLower.includes("currículum")) {
    return "📄 Puedes descargar el CV de Michael desde la sección CV de esta web, incluso personalizado para tu oferta laboral.";
  }

  if (mensajeLower.includes("contacto") || mensajeLower.includes("hablar")) {
    return "📞 Puedes contactar a Michael Sáez por WhatsApp: +56 9 8383 3148, email: contacto@maikostudios.com o LinkedIn: linkedin.com/in/me-saezc";
  }

  return "🤖 ¡Hola! Soy MaikoBot. Puedo contarte sobre nuestros servicios de desarrollo web, aplicaciones móviles, consultoría tecnológica y automatización. ¿Qué te interesa saber?";
}

// Función para verificar y configurar Firebase si es necesario
export async function verificarConfiguracionFirebase() {
  try {
    // Intentar crear una conversación de prueba para verificar que Firebase funciona
    const testDoc = await addDoc(collection(db, "conversaciones_chatbot"), {
      test: true,
      timestamp: serverTimestamp(),
    });

    // Si llegamos aquí, Firebase está funcionando
    console.log("✅ Firebase configurado correctamente para chatbot");

    // Eliminar el documento de prueba
    await updateDoc(doc(db, "conversaciones_chatbot", testDoc.id), {
      test: false,
      eliminado: true,
    });

    return { success: true, message: "Firebase configurado correctamente" };
  } catch (error) {
    console.warn("⚠️ Firebase no configurado para chatbot:", error.message);
    return { success: false, error: error.message };
  }
}

// Función para obtener estadísticas del chatbot
export async function obtenerEstadisticasChatbot() {
  try {
    // En una implementación real, aquí harías queries a Firestore
    // Por ahora retornamos datos de ejemplo
    return {
      success: true,
      estadisticas: {
        totalConversaciones: 0,
        conversacionesActivas: 0,
        leadsCaptados: 0,
        derivacionesHumano: 0,
      },
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return { success: false, error: error.message };
  }
}
