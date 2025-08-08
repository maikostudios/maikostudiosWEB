import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

/**
 * Inicializa las colecciones necesarias en Firestore
 * Crea documentos de ejemplo si las colecciones no existen
 */
export const initializeCollections = async () => {
  try {
    console.log("🔧 Inicializando colecciones de Firestore...");

    // 1. Colección: reclutadores_interesados
    await createCollectionIfNotExists("reclutadores_interesados", {
      id: "ejemplo-reclutador-001",
      data: {
        nombre: "María González",
        empresa: "TechCorp",
        email: "maria.gonzalez@techcorp.com",
        posicion: "Desarrollador Full Stack",
        rubro: "Tecnología",
        cargo: "Desarrollador Full Stack",
        contacto: "maria.gonzalez@techcorp.com",
        fechaRegistro: new Date().toISOString(),
        cvGenerado: true,
        nombreArchivoCV: "cv-techcorp-ejemplo.pdf",
        habilidadesSeleccionadas: ["Vue.js", "Node.js", "PostgreSQL"],
        seguimientoRealizado: false,
        tipoSolicitud: "cv_dinamico",
        estado: "completado",
      },
    });

    // 2. Colección: solicitudes_cv
    await createCollectionIfNotExists("solicitudes_cv", {
      id: "solicitud-ejemplo-001",
      data: {
        nombreReclutador: "Juan Pérez",
        empresa: "StartupXYZ",
        email: "juan.perez@startupxyz.com",
        posicion: "Desarrollador Frontend",
        habilidadesSeleccionadas: ["React", "TypeScript", "Tailwind"],
        descripcionCargo:
          "Buscamos un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo.",
        tipoSolicitud: "cv_personalizado",
        fechaSolicitud: new Date().toISOString(),
        estado: "pendiente",
      },
    });

    // 3. Colección: mensajes_contacto
    await createCollectionIfNotExists("mensajes_contacto", {
      id: "mensaje-ejemplo-001",
      data: {
        nombre: "Ana Rodríguez",
        email: "ana.rodriguez@empresa.com",
        empresa: "Empresa Demo",
        mensaje:
          "Estamos interesados en sus servicios de desarrollo web. ¿Podrían contactarnos?",
        fechaEnvio: new Date().toISOString(),
        leido: false,
        respondido: false,
        tipo: "consulta_servicios",
      },
    });

    // 4. Colección: visitas
    await createCollectionIfNotExists("visitas", {
      id: "visita-ejemplo-001",
      data: {
        pagina: "/cv-generator",
        timestamp: new Date().toISOString(),
        userAgent: "Mozilla/5.0 (ejemplo)",
        ip: "192.168.1.1",
        referrer: "https://google.com",
        duracion: 120,
        acciones: ["formulario_abierto", "cv_generado", "pdf_descargado"],
      },
    });

    // 5. Colección: configuracion (para settings del sistema)
    await createCollectionIfNotExists("configuracion", {
      id: "sistema",
      data: {
        version: "1.0.0",
        ultimaActualizacion: new Date().toISOString(),
        estadisticas: {
          totalCVsGenerados: 0,
          totalReclutadores: 0,
          totalVisitas: 0,
          totalConversacionesChatbot: 0,
        },
        configuracionCV: {
          modeloIA: "gpt-4",
          formatoPDF: "letter",
          margenPDF: 0.5,
          escalaPDF: 2,
        },
        configuracionChatbot: {
          maxStrikes: 5,
          maxRespuestasIA: 20,
          apiKeyGemini: "configurada",
        },
      },
    });

    // 6. Colección: conversaciones_chatbot (para el chatbot mejorado)
    await createCollectionIfNotExists("conversaciones_chatbot", {
      id: "ejemplo_conversacion",
      data: {
        nombre: "Usuario Ejemplo",
        telefono: "+56920648446",
        email: "ejemplo@email.com",
        pais_detectado: "Chile",
        region_bloqueada: false,
        strikes_restantes: 5,
        respuestas_ia_usadas: 3,
        estado_conversacion: "preguntarDuda",
        contacto_whatsapp: false,
        contacto_email: false,
        conversacion_completa:
          "Usuario: Hola\nBot: ¡Hola! ¿Cuál es tu nombre?\nUsuario: Juan\nBot: Juan, ¿podrías dejarme tu WhatsApp?\n",
        metadata: {
          fecha_inicio: new Date().toISOString(),
          fecha_ultima_interaccion: new Date().toISOString(),
          derivado_a_humano: false,
          razon_finalizacion: null,
          ip_usuario: null,
          user_agent: null,
        },
      },
    });

    console.log("✅ Colecciones inicializadas correctamente");
    return { success: true, message: "Colecciones creadas exitosamente" };
  } catch (error) {
    console.error("❌ Error al inicializar colecciones:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Crea una colección con un documento de ejemplo si no existe
 * @param {string} collectionName - Nombre de la colección
 * @param {Object} exampleDoc - Documento de ejemplo con id y data
 */
const createCollectionIfNotExists = async (collectionName, exampleDoc) => {
  try {
    const docRef = doc(db, collectionName, exampleDoc.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, exampleDoc.data);
      console.log(
        `📄 Colección '${collectionName}' creada con documento de ejemplo`
      );
    } else {
      console.log(`✅ Colección '${collectionName}' ya existe`);
    }
  } catch (error) {
    console.error(`❌ Error creando colección '${collectionName}':`, error);
    throw error;
  }
};

/**
 * Verifica si las colecciones están configuradas correctamente
 */
export const verifyCollections = async () => {
  const collections = [
    "reclutadores_interesados",
    "solicitudes_cv",
    "mensajes_contacto",
    "visitas",
    "configuracion",
    "conversaciones_chatbot",
  ];

  const results = {};

  for (const collectionName of collections) {
    try {
      const testDocRef = doc(db, collectionName, "test");
      await getDoc(testDocRef);
      results[collectionName] = true;
    } catch (error) {
      results[collectionName] = false;
    }
  }

  return results;
};
