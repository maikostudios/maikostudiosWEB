/**
 * Servicio para integración con Gemini 1.5 Flash
 * Generación inteligente de CVs directamente desde frontend
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    this.apiUrl = GEMINI_API_URL;
    this.apiKey = API_KEY;
  }

  /**
   * Genera CV usando Gemini 1.5 Flash
   * @param {string} promptSystem - Prompt del sistema
   * @param {string} promptUser - Prompt del usuario
   * @returns {Promise<string>} - HTML generado
   */
  async generarCV(promptSystem, promptUser) {
    if (!this.apiKey || this.apiKey === "tu_gemini_api_key_aqui") {
      throw new Error(
        "API key de Gemini no configurada. Configura VITE_GEMINI_API_KEY en .env"
      );
    }

    // Gemini no soporta rol "system", combinamos en un solo mensaje de usuario
    const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`;

    const body = {
      contents: [{ role: "user", parts: [{ text: promptCombinado }] }],
    };

    try {
      console.log("🤖 Llamando a Gemini 1.5 Flash...", {
        url: this.apiUrl,
        systemPromptLength: promptSystem.length,
        userPromptLength: promptUser.length,
      });

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Error de Gemini:", error);
        throw new Error(
          error.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!respuesta) {
        throw new Error("Gemini no devolvió contenido válido");
      }

      console.log("✅ CV generado con Gemini exitosamente", {
        responseLength: respuesta.length,
        model: "gemini-1.5-flash",
      });

      return respuesta;
    } catch (error) {
      console.error("❌ Error en Gemini Service:", error);
      throw error;
    }
  }

  /**
   * Genera CV personalizado usando plantilla y datos de Firebase
   * @param {string} userPrompt - Prompt de personalización del usuario
   * @returns {Promise<Object>} - Resultado con HTML generado
   */
  async generarCVPersonalizado(userPrompt = "") {
    try {
      console.log("🚀 Iniciando generación de CV con Gemini...", {
        userPrompt,
      });

      // 1. Obtener plantilla HTML desde Firebase
      const { plantillasService } = await import("@/firebase/services");
      const plantillaResult = await plantillasService.obtenerPlantillaCV();

      if (!plantillaResult.success) {
        throw new Error("No se pudo obtener la plantilla HTML");
      }

      const plantillaHTML = plantillaResult.data.plantilla_cv_maiko;

      // 2. Obtener datos del perfil desde Firebase
      const { perfilService } = await import("@/firebase/services");
      const perfilResult = await perfilService.obtenerPerfilCandidato();

      if (!perfilResult.success) {
        throw new Error("No se pudo obtener los datos del candidato");
      }

      const datosJSON = JSON.stringify(perfilResult.data, null, 2);

      // 3. Crear prompts según tu especificación
      const promptSystem = this.crearPromptSistema();
      const promptUser = this.crearPromptUsuario(
        plantillaHTML,
        datosJSON,
        userPrompt
      );

      // 4. Llamar a Gemini
      const htmlGenerado = await this.generarCV(promptSystem, promptUser);

      return {
        success: true,
        html: htmlGenerado,
        metadata: {
          candidato: perfilResult.data.nombre_completo,
          modelo: "gemini-1.5-flash",
          timestamp: new Date().toISOString(),
          plantilla: plantillaResult.data.nombre,
          prompt: userPrompt,
        },
        provider: "gemini",
      };
    } catch (error) {
      console.error("❌ Error generando CV con Gemini:", error);
      return {
        success: false,
        error: error.message,
        provider: "gemini",
      };
    }
  }

  /**
   * Crea el prompt del sistema según tu especificación
   * @returns {string} - Prompt del sistema
   */
  crearPromptSistema() {
    return `Eres MaikoCV, un agente experto en generación de CVs personalizados para Michael Esteban Sáez Contreras.

Tu tarea es reemplazar únicamente los datos dinámicos dentro de una plantilla HTML predefinida, sin alterar la estructura, diseño, clases ni estilos inline. La plantilla base ya tiene la disposición visual, colores, tipografía y layout deseados.

⚠️ IMPORTANTE:
- No inventes secciones ni reestructures el HTML.
- No agregues estilos nuevos, emojis adicionales ni cambios en las etiquetas existentes.
- No modifiques los nombres de clases ni IDs en el HTML.
- Solo reemplaza los contenidos internos entre etiquetas (ej: \`<p>\`, \`<li>\`, \`<h2>\`, etc.) con la nueva información del candidato.

FORMATO DE RESPUESTA:
Devuelve exclusivamente el HTML completo y corregido, sin explicaciones.`;
  }

  /**
   * Crea el prompt del usuario según tu especificación
   * @param {string} plantillaHTML - HTML de la plantilla
   * @param {string} datosJSON - Datos del candidato en JSON
   * @param {string} userPrompt - Prompt de personalización
   * @returns {string} - Prompt del usuario
   */
  crearPromptUsuario(plantillaHTML, datosJSON, userPrompt = "") {
    let prompt = `Este es el contenido de la plantilla HTML maestra para el CV (estructura visual que debes respetar):

${plantillaHTML}

Estos son los nuevos datos del candidato en formato JSON que debes usar para reemplazar el contenido de la plantilla:

${datosJSON}

⚙️ Tu tarea:
1. Sustituye los textos del CV con la nueva información.
2. Mantén todos los estilos CSS inline y estructura HTML exactamente igual.
3. Respeta el orden, formato, títulos, colores y layout.
4. Usa los datos del JSON de forma precisa. Si hay campos faltantes, deja el contenido actual tal cual.
5. Devuelve el HTML final reemplazado, sin comentarios ni explicaciones.`;

    if (userPrompt.trim()) {
      prompt += `

📝 PERSONALIZACIÓN ADICIONAL SOLICITADA:
"${userPrompt}"

Aplica esta personalización manteniendo la estructura HTML base.`;
    }

    prompt += `

Cuando termines, el resultado debe ser un CV listo para renderizarse como HTML o exportarse como PDF.`;

    return prompt;
  }

  /**
   * Prueba la conexión con Gemini API
   * @returns {Promise<Object>} - Estado de la conexión
   */
  async probarConexion() {
    try {
      console.log("🔍 Probando conexión con Gemini...");

      const promptSystem = "Eres un asistente de prueba.";
      const promptUser = "Responde solo 'OK' si puedes procesar este mensaje.";

      const respuesta = await this.generarCV(promptSystem, promptUser);

      return {
        success: true,
        message: "Conexión con Gemini exitosa",
        response: respuesta.trim(),
        model: "gemini-1.5-flash",
      };
    } catch (error) {
      console.error("❌ Error probando conexión Gemini:", error);
      return {
        success: false,
        error: error.message,
        model: "gemini-1.5-flash",
      };
    }
  }

  /**
   * Genera prompts optimizados para diferentes tipos de CV
   * @param {string} tipoCV - Tipo de CV solicitado
   * @param {Array} habilidades - Habilidades a destacar
   * @param {string} empresa - Empresa objetivo
   * @param {string} posicion - Posición objetivo
   * @returns {string} - Prompt optimizado
   */
  generarPromptOptimizado(
    tipoCV,
    habilidades = [],
    empresa = "",
    posicion = ""
  ) {
    const prompts = {
      frontend: `CV para desarrollador Frontend. Destaca experiencia en ${habilidades
        .filter((h) =>
          [
            "Vue.js",
            "React",
            "Angular",
            "JavaScript",
            "HTML",
            "CSS",
            "Bootstrap",
          ].includes(h)
        )
        .join(
          ", "
        )}. Enfócate en proyectos de interfaz de usuario y experiencia del usuario.`,

      backend: `CV para desarrollador Backend. Resalta experiencia en ${habilidades
        .filter((h) =>
          [
            "Node.js",
            "Express",
            "Python",
            "Java",
            "Spring",
            "PostgreSQL",
            "MongoDB",
          ].includes(h)
        )
        .join(", ")}. Destaca arquitectura de sistemas y APIs.`,

      fullstack: `CV para desarrollador Full Stack. Equilibra experiencia frontend y backend. Destaca ${habilidades
        .slice(0, 6)
        .join(", ")} y capacidad de desarrollo integral.`,

      lider: `CV para posición de liderazgo técnico. Destaca experiencia en mentoría, gestión de equipos, y arquitectura de software. Resalta habilidades de comunicación y liderazgo.`,

      docente: `CV para posición educativa/facilitador. Destaca experiencia como facilitador en Desafío Latam e INFOCAL. Resalta habilidades pedagógicas y capacidad de transmitir conocimiento técnico.`,
    };

    let prompt = prompts[tipoCV] || prompts.fullstack;

    if (empresa && posicion) {
      prompt += ` Personaliza para la posición de ${posicion} en ${empresa}.`;
    }

    if (habilidades.length > 0) {
      prompt += ` Tecnologías clave a destacar: ${habilidades.join(", ")}.`;
    }

    return prompt;
  }
}

// Exportar instancia única
export default new GeminiService();
