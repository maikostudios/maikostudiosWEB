/**
 * Firebase Functions para MaikoCV con DeepSeek
 * Generación inteligente de CVs personalizados
 */

const { onCall } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const axios = require("axios");

// Inicializar Firebase Admin
admin.initializeApp();

/**
 * Función para generar CV con DeepSeek AI
 * Adaptada al proyecto MaikoStudios
 */
exports.generateCVWithDeepSeek = onCall(async (request) => {
  const { data } = request;
  const db = admin.firestore();

  try {
    logger.info("🚀 Iniciando generación de CV con DeepSeek", {
      userPrompt: data.userPrompt,
      timestamp: new Date().toISOString(),
    });

    // 1. Obtener plantilla HTML activa con variables {{}}
    const templateSnapshot = await db
      .collection("plantillas")
      .where("activa", "==", true)
      .where("tipo", "==", "cv_profesional")
      .limit(1)
      .get();

    if (templateSnapshot.empty) {
      throw new Error("No se encontró plantilla activa");
    }

    const templateData = templateSnapshot.docs[0].data();
    const htmlTemplate = templateData.plantilla_cv_maiko;
    const camposVariables = templateData.campos_variables || [];

    logger.info("✅ Plantilla obtenida", {
      templateId: templateSnapshot.docs[0].id,
      campos: camposVariables.length,
    });

    // 2. Obtener datos del perfil activo del candidato
    const profileSnapshot = await db
      .collection("perfil_candidato")
      .where("activo", "==", true)
      .limit(1)
      .get();

    if (profileSnapshot.empty) {
      throw new Error("No se encontró perfil activo del candidato");
    }

    const cvData = profileSnapshot.docs[0].data();

    logger.info("✅ Perfil obtenido", {
      profileId: profileSnapshot.docs[0].id,
      nombre: cvData.nombre_completo,
    });

    // 3. Crear prompt estructurado para DeepSeek
    const systemPrompt = `
Eres MaikoCV, un asistente especializado en generar CVs profesionales en HTML.

REGLAS ESTRICTAS:
1. Usa ÚNICAMENTE estos datos reales del candidato: ${JSON.stringify(cvData)}
2. Reemplaza las variables {{}} en esta plantilla HTML: ${htmlTemplate}
3. Personaliza según esta solicitud: "${
      data.userPrompt || "CV estándar profesional"
    }"
4. NUNCA inventes información que no esté en los datos proporcionados
5. Mantén la estructura HTML exacta de la plantilla
6. Conserva todos los estilos CSS inline

VARIABLES DISPONIBLES: ${camposVariables.join(", ")}

DATOS DEL CANDIDATO:
- Nombre: ${cvData.nombre_completo}
- Cargo: ${cvData.cargo_principal}
- Email: ${cvData.email}
- Experiencia: ${cvData.experiencia_profesional?.length || 0} trabajos
- Habilidades: ${Object.keys(cvData.habilidades_tecnicas || {}).join(", ")}

INSTRUCCIONES ESPECÍFICAS:
- Para {{experiencia_profesional}}: Genera HTML con estructura .entry y .entry-title
- Para {{habilidades_tecnicas}}: Organiza por categorías (Lenguajes, Frontend, Backend, etc.)
- Para {{educacion}}: Formato <p><strong>Título</strong> - Institución (Período)</p>
- Para {{idiomas}}: Formato "Idioma (Nivel), Idioma (Nivel)"
- Mantén colores: header #121212, títulos #00cccc, footer #f0f0f0
`;

    const userMessage = `Genera mi CV profesional en HTML reemplazando todas las variables {{}} con los datos reales proporcionados. ${
      data.userPrompt ? `Personalización solicitada: ${data.userPrompt}` : ""
    }`;

    // 4. Llamar a DeepSeek API
    logger.info("🤖 Llamando a DeepSeek API...");

    const deepseekResponse = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const generatedHTML = deepseekResponse.data.choices[0].message.content;

    logger.info("✅ CV generado exitosamente", {
      htmlLength: generatedHTML.length,
      model: "deepseek-chat",
    });

    // 5. Guardar solicitud en Firestore para tracking
    await db.collection("cv_generaciones_deepseek").add({
      userPrompt: data.userPrompt || "",
      candidato: cvData.nombre_completo,
      plantillaUsada: templateSnapshot.docs[0].id,
      fechaGeneracion: admin.firestore.FieldValue.serverTimestamp(),
      modelo: "deepseek-chat",
      exitoso: true,
      htmlLength: generatedHTML.length,
    });

    return {
      success: true,
      html: generatedHTML,
      metadata: {
        candidato: cvData.nombre_completo,
        modelo: "deepseek-chat",
        timestamp: new Date().toISOString(),
        plantilla: templateData.nombre,
      },
    };
  } catch (error) {
    logger.error("❌ Error generando CV con DeepSeek", error);

    // Guardar error para análisis
    await db.collection("cv_generaciones_deepseek").add({
      userPrompt: data.userPrompt || "",
      fechaGeneracion: admin.firestore.FieldValue.serverTimestamp(),
      modelo: "deepseek-chat",
      exitoso: false,
      error: error.message,
    });

    // Retornar error estructurado
    return {
      success: false,
      error: error.message,
      fallback: true,
    };
  }
});

// Función de prueba para verificar configuración
exports.testDeepSeekConnection = onCall(async (request) => {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: "Responde solo 'OK' si puedes procesar este mensaje.",
          },
        ],
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "Conexión con DeepSeek exitosa",
      response: response.data.choices[0].message.content,
    };
  } catch (error) {
    logger.error("Error conectando con DeepSeek", error);
    return {
      success: false,
      error: error.message,
    };
  }
});
