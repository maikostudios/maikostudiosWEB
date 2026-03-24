/**
 * Servicio para integración con DeepSeek AI
 * Generación inteligente de CVs usando Firebase Functions
 */

import apiClient from '@/api/apiClient';

/**
 * Servicio para integración con la API de DeepSeek a través del backend local
 */
class DeepSeekService {
  constructor() {
    this.model = "deepseek-chat";
  }

  /**
   * Genera un CV personalizado usando DeepSeek AI
   * @param {string} userPrompt - Prompt del usuario para personalización
   * @returns {Promise<Object>} - Resultado con HTML generado
   */
  async generarCVPersonalizado(userPrompt = "") {
    try {
      console.log("🤖 Iniciando generación con DeepSeek...", { userPrompt });

      const response = await apiClient.post('/ai/deepseek/generate-cv', {
        userPrompt: userPrompt.trim(),
        model: this.model
      });

      if (response.data.success) {
        console.log("✅ CV generado exitosamente con DeepSeek", {
          candidato: response.data.metadata.candidato,
          modelo: response.data.metadata.modelo,
          htmlLength: response.data.html.length,
        });

        return {
          success: true,
          html: response.data.html,
          metadata: response.data.metadata,
          provider: "deepseek",
        };
      } else {
        throw new Error(
          response.data.error || "Error desconocido en DeepSeek"
        );
      }
    } catch (error) {
      console.error("❌ Error en DeepSeek Service:", error);
      console.log("🔄 Usando DeepSeek Mock Service como fallback...");

      // Fallback al servicio mock
      return await deepSeekMockService.generarCVPersonalizado(userPrompt);
    }
  }

  /**
   * Prueba la conexión con DeepSeek API
   * @returns {Promise<Object>} - Estado de la conexión
   */
  async probarConexion() {
    try {
      console.log("🔍 Probando conexión con DeepSeek...");

      const response = await apiClient.get('/ai/deepseek/test-connection');

      if (response.data.success) {
        console.log("✅ Conexión con DeepSeek exitosa");
        return {
          success: true,
          message: response.data.message,
          response: response.data.response,
        };
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("❌ Error probando conexión DeepSeek:", error);
      console.log("🔄 Usando DeepSeek Mock Service como fallback...");

      // Fallback al servicio mock
      return await deepSeekMockService.probarConexion();
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

  /**
   * Analiza el prompt del usuario y sugiere mejoras
   * @param {string} userPrompt - Prompt original del usuario
   * @returns {Object} - Análisis y sugerencias
   */
  analizarPrompt(userPrompt) {
    const palabrasClave = {
      frontend: ["frontend", "vue", "react", "angular", "ui", "ux", "interfaz"],
      backend: [
        "backend",
        "api",
        "servidor",
        "base de datos",
        "microservicios",
      ],
      liderazgo: ["líder", "team lead", "senior", "arquitecto", "mentor"],
      docente: ["profesor", "facilitador", "docente", "enseñanza", "educación"],
    };

    const tipoDetectado =
      Object.keys(palabrasClave).find((tipo) =>
        palabrasClave[tipo].some((palabra) =>
          userPrompt.toLowerCase().includes(palabra)
        )
      ) || "general";

    const empresaMencionada = /para\s+(\w+)/i.exec(userPrompt)?.[1];
    const posicionMencionada = /como\s+(\w+(?:\s+\w+)*)/i.exec(userPrompt)?.[1];

    return {
      tipoDetectado,
      empresaMencionada,
      posicionMencionada,
      longitud: userPrompt.length,
      sugerencias: this.generarSugerencias(tipoDetectado, userPrompt.length),
    };
  }

  /**
   * Genera sugerencias para mejorar el prompt
   * @param {string} tipo - Tipo detectado
   * @param {number} longitud - Longitud del prompt
   * @returns {Array} - Lista de sugerencias
   */
  generarSugerencias(tipo, longitud) {
    const sugerencias = [];

    if (longitud < 20) {
      sugerencias.push(
        "Considera agregar más detalles sobre el tipo de posición o empresa objetivo"
      );
    }

    if (tipo === "general") {
      sugerencias.push(
        "Especifica si es para frontend, backend, full stack o liderazgo"
      );
    }

    if (!tipo.includes("empresa")) {
      sugerencias.push(
        "Menciona la empresa objetivo para mayor personalización"
      );
    }

    sugerencias.push(
      `Prompt optimizado para ${tipo}: Usa palabras clave específicas del área`
    );

    return sugerencias;
  }
}

// Exportar instancia única
export default new DeepSeekService();
