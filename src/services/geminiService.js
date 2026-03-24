/**
 * Servicio para integración con Gemini 1.5 Flash usando el Frontend
 * y enrutando la petición a través del Proxy Seguro de Backend API
 */
import apiClient from '@/api/apiClient';

class GeminiService {
  constructor() {
    this.apiUrl = '/ai/gemini';
  }

  /**
   * Genera CV usando Gemini
   * @param {string} promptSystem - Prompt del sistema
   * @param {string} promptUser - Prompt del usuario
   * @returns {Promise<string>} - HTML generado
   */
  async generarCV(promptSystem, promptUser) {
    if (!promptSystem || typeof promptSystem !== "string" || promptSystem.trim().length === 0) {
      throw new Error("Prompt del sistema es requerido");
    }

    if (!promptUser || typeof promptUser !== "string" || promptUser.trim().length === 0) {
      throw new Error("Prompt del usuario es requerido");
    }

    try {
      console.log("🤖 Solicitando generación de CV vía Proxy Backend...");

      const response = await apiClient.post(this.apiUrl, {
        prompt: promptUser,
        systemPrompt: promptSystem,
        model: 'gemini-1.5-flash'
      });

      console.log("✅ CV generado exitosamente");
      return response.data.text;
    } catch (error) {
      console.error("❌ Error en Proxy Gemini Service:", error);
      throw new Error(error.response?.data?.error || "Error al procesar la solicitud de IA");
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
   * Crea el prompt optimizado para RRHH técnico
   * @returns {string} - Prompt especializado en RRHH técnico
   */
  crearPromptSistema() {
    return `Eres MaikoCV, un agente experto en Recursos Humanos del sector TI y Generación de CVs Profesionales para Michael Esteban Sáez Contreras.

📌 Tu objetivo es generar un CV completamente personalizado, optimizado para superar filtros automatizados (ATS) y ser atractivo para reclutadores técnicos y no técnicos del área TI.

🎯 ESTRUCTURA DE TRABAJO:

1. Recibirás:
   - Una plantilla HTML con variables tipo {{variable}} que **NO debes modificar en estructura ni diseño**.
   - Datos personales, profesionales, técnicos y académicos del candidato en formato JSON.
   - Una posible descripción de oferta laboral o puesto objetivo.

2. Analiza cuidadosamente:
   - Las coincidencias entre habilidades, experiencia y lo que solicita el puesto.
   - Qué información puede ser omitida si no aporta al perfil buscado.
   - Cómo mejorar la redacción para destacar logros, impacto, tecnologías, resultados y métricas concretas.

3. Adaptación del contenido:
   - Reordena, resalta o personaliza la información **respetando la plantilla HTML**.
   - Omite experiencias o cursos no alineados al rol, a menos que puedas reformularlos para añadir valor.
   - Redacta en español profesional y neutro.
   - Ordena cronológicamente de lo más reciente a lo más antiguo.

4. Validación final (Autoevaluación):
   - Antes de entregar el HTML, realiza una evaluación interna:
     - ¿Es coherente y relevante el contenido?
     - ¿Refleja un perfil técnico moderno y competitivo?
     - ¿Está adaptado al puesto objetivo?
     - ¿Contiene suficientes palabras clave técnicas para sistemas ATS?
     - ¿Tiene un nivel profesional "10 de 10"?

   - Si alguna de las respuestas es "no", vuelve a optimizar el contenido **hasta que todas las respuestas sean afirmativas**.

⚠️ REGLAS OBLIGATORIAS:
- No modifiques el layout, clases CSS, etiquetas HTML ni la semántica.
- No generes texto fuera del HTML (no uses Markdown, JSON ni explicaciones).
- Devuelve exclusivamente el HTML con las variables reemplazadas.

💡 TU MISIÓN:
Entregar un CV altamente profesional, adaptado y atractivo tanto para filtros automáticos (ATS) como para reclutadores humanos en tecnología, utilizando al máximo los datos proporcionados y tu experiencia en el área de RRHH técnico.`;
  }

  /**
   * Crea el prompt del usuario con datos específicos
   * @param {string} plantillaHTML - HTML de la plantilla
   * @param {string} datosJSON - Datos del candidato en JSON
   * @param {string} userPrompt - Prompt de personalización
   * @returns {string} - Prompt del usuario
   */
  crearPromptUsuario(plantillaHTML, datosJSON, userPrompt = "") {
    let prompt = `📄 PLANTILLA HTML MAESTRA (NO MODIFICAR ESTRUCTURA):
La siguiente plantilla contiene variables {{variable}} que debes reemplazar con los datos del JSON:

${plantillaHTML}

👤 DATOS DEL CANDIDATO (FUENTE: Firebase Database):
Utiliza estos datos reales para reemplazar las variables {{}} en la plantilla:

${datosJSON}

🔍 VARIABLES A REEMPLAZAR:
- {{nombre_completo}} → Usar campo "nombre_completo" del JSON
- {{cargo_principal}} → Usar campo "cargo_principal" del JSON
- {{email}} → Usar campo "email" del JSON
- {{telefono}} → Usar campo "telefono" del JSON
- {{ubicacion}} → Usar campo "ubicacion" del JSON
- {{linkedin}} → Usar campo "linkedin" del JSON
- {{perfil_profesional}} → Usar campo "perfil_profesional" del JSON
- {{experiencia_profesional}} → Convertir array "experiencia_profesional" a HTML estructurado
- {{educacion}} → Convertir array "educacion" a HTML estructurado
- {{habilidades_tecnicas}} → Convertir objeto "habilidades_tecnicas" a HTML organizado por categorías
- {{habilidades_blandas}} → Usar campo "habilidades_blandas" del JSON
- {{idiomas}} → Convertir array "idiomas" a formato legible

⚙️ INSTRUCCIONES ESPECÍFICAS:
1. Para arrays (experiencia, educación): Crea HTML con estructura <div class="entry"> para cada elemento
2. Para habilidades técnicas: Organiza por categorías usando <h3> (Frontend, Backend, Databases, etc.)
3. Mantén colores exactos: header #121212, títulos h2 #00cccc, footer #f0f0f0
4. CRÍTICO: TODO el texto debe ser NEGRO (#000) - NUNCA uses colores grises, claros o por defecto
5. NO agregues estilos inline de color - los CSS ya están definidos
6. Para párrafos usa solo <p> sin atributos de estilo
7. Para subtítulos usa <div class="entry-subtitle">
8. Ordena cronológicamente de más reciente a más antiguo
9. Optimiza descripciones para ATS con palabras clave técnicas
10. ESTRUCTURA COMPACTA: Mantén secciones concisas para evitar cortes de página
11. ESPACIADO INTELIGENTE: No dejes secciones muy largas que puedan cortarse
12. Devuelve SOLO el HTML final, sin explicaciones ni comentarios

🔧 CORRECCIONES OBLIGATORIAS DE FORMATO:
- HEADER debe mostrar: "Desarrollador Full Stack" (CON espacio, no "DesarrolladorFull Stack")
- HEADER debe mostrar: "m.saezc@maikostudios.com | +56920648446 | LinkedIn"
- HEADER debe mostrar: "Chile | maikostudios.com" (NO "Temucą IX Región Chile")
- FOOTER debe mostrar: "Contacto: m.saezc@maikostudios.com | LinkedIn | maikostudios.com"
- SIEMPRE incluir el punto en "maikostudios.com" (NUNCA "maikostudioscom")
- SIEMPRE usar "Chile" (NUNCA "Temucą" con ą)

📄 REGLAS CRÍTICAS PARA PDF (EVITAR CORTES DE PÁGINA):
- NUNCA cortar títulos h2 entre páginas - usar page-break-inside: avoid
- NUNCA cortar entradas de experiencia/educación entre páginas
- Mantener secciones completas juntas cuando sea posible
- Usar page-break-before: auto para secciones largas
- Asegurar que títulos h2 tengan suficiente espacio debajo
- Si una sección no cabe completa, moverla a la siguiente página`;

    if (userPrompt.trim()) {
      prompt += `

🎯 PERSONALIZACIÓN PARA PUESTO ESPECÍFICO:
"${userPrompt}"

Aplica esta personalización:
- Destaca habilidades y experiencias relevantes al puesto
- Ajusta descripciones para incluir palabras clave del sector
- Reordena información por relevancia al rol objetivo
- Mantén estructura HTML base intacta`;
    }

    prompt += `

✅ RESULTADO ESPERADO:
HTML completo con todas las variables {{}} reemplazadas, optimizado para ATS y reclutadores técnicos, listo para renderizar o convertir a PDF.`;

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
      frontend: `CV optimizado para DESARROLLADOR FRONTEND.

🎯 OBJETIVO: Posición Frontend Developer con enfoque en interfaces modernas y UX/UI.

📋 PRIORIDADES ATS:
- Destacar: ${habilidades
        .filter((h) =>
          [
            "Vue.js",
            "React",
            "Angular",
            "JavaScript",
            "HTML",
            "CSS",
            "Bootstrap",
            "Vuetify",
          ].includes(h)
        )
        .join(", ")}
- Palabras clave: "Responsive Design", "SPA", "Component-based", "User Experience", "Performance Optimization"
- Métricas: Incluir tiempos de carga, mejoras de UX, proyectos completados

🔍 ENFOQUE RRHH: Resaltar capacidad de traducir diseños a código funcional, colaboración con equipos de diseño, y experiencia en frameworks modernos.`,

      backend: `CV optimizado para DESARROLLADOR BACKEND.

🎯 OBJETIVO: Posición Backend Developer con enfoque en arquitectura y escalabilidad.

📋 PRIORIDADES ATS:
- Destacar: ${habilidades
        .filter((h) =>
          [
            "Node.js",
            "Express",
            "Python",
            "Java",
            "Spring",
            "PostgreSQL",
            "MongoDB",
            "Firebase",
          ].includes(h)
        )
        .join(", ")}
- Palabras clave: "API REST", "Microservicios", "Base de datos", "Escalabilidad", "Performance", "Seguridad"
- Métricas: Incluir rendimiento de APIs, usuarios concurrentes, optimizaciones de BD

🔍 ENFOQUE RRHH: Resaltar experiencia en arquitectura de sistemas, optimización de consultas, y manejo de grandes volúmenes de datos.`,

      fullstack: `CV optimizado para DESARROLLADOR FULL STACK.

🎯 OBJETIVO: Posición Full Stack Developer con capacidad integral de desarrollo.

📋 PRIORIDADES ATS:
- Destacar: ${habilidades.slice(0, 8).join(", ")}
- Palabras clave: "End-to-end development", "MERN/MEAN Stack", "DevOps", "CI/CD", "Agile"
- Métricas: Proyectos completos, tiempo de desarrollo, tecnologías integradas

🔍 ENFOQUE RRHH: Resaltar versatilidad técnica, capacidad de liderar proyectos completos, y experiencia en todo el ciclo de desarrollo.`,

      lider: `CV optimizado para TECH LEAD / LÍDER TÉCNICO.

🎯 OBJETIVO: Posición de liderazgo técnico con responsabilidades de mentoría y arquitectura.

📋 PRIORIDADES ATS:
- Destacar: "Technical Leadership", "Team Management", "Architecture Design", "Code Review", "Mentoring"
- Palabras clave: "Scrum Master", "Agile", "Technical Decisions", "Performance Optimization", "Best Practices"
- Métricas: Tamaño de equipos liderados, proyectos entregados, mejoras implementadas

🔍 ENFOQUE RRHH: Resaltar experiencia en gestión de equipos técnicos, toma de decisiones arquitectónicas, y capacidad de mentoría.`,

      docente: `CV optimizado para FACILITADOR/DOCENTE TÉCNICO.

🎯 OBJETIVO: Posición educativa en tecnología con enfoque en formación práctica.

📋 PRIORIDADES ATS:
- Destacar: "Technical Training", "Curriculum Development", "Bootcamp", "Mentoring", "Knowledge Transfer"
- Palabras clave: "Facilitador", "Desafío Latam", "Talento Digital", "Vue.js", "JavaScript", "HTML/CSS"
- Métricas: Estudiantes formados, tasa de empleabilidad, cursos desarrollados

🔍 ENFOQUE RRHH: Resaltar experiencia en Desafío Latam, capacidad pedagógica, y habilidad para transmitir conocimientos técnicos complejos.`,
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
