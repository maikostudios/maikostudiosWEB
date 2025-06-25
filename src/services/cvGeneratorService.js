// Servicio para generación de CVs con MaikoCV Agent
import html2pdf from "html2pdf.js";

class CVGeneratorService {
  constructor() {
    this.maikoAgentEndpoint =
      import.meta.env.VITE_MAIKO_CV_AGENT_URL ||
      "https://api.openai.com/v1/chat/completions";
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  /**
   * Genera un CV personalizado usando el agente MaikoCV
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} - Resultado con HTML del CV
   */
  async generarCVConMaikoAgent(formData) {
    // Declarar perfilCandidato fuera del try block para que esté disponible en catch
    let perfilCandidato = null;

    try {
      // Obtener datos del perfil desde Firebase
      const { perfilService } = await import("@/firebase/services");
      const perfilResult = await perfilService.obtenerPerfilCandidato();
      perfilCandidato = perfilResult.success ? perfilResult.data : null;

      // Preparar el prompt para MaikoCV con datos reales
      const prompt = this.construirPromptMaikoCV(formData, perfilCandidato);

      // Llamar al agente MaikoCV
      const response = await fetch(this.maikoAgentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Eres MaikoCV, un agente especializado en generar CVs personalizados para Michael Esteban Sáez Contreras. 
              
              INFORMACIÓN DEL CANDIDATO:
              - Desarrollador Full Stack con 5+ años de experiencia
              - Especialista en Vue.js, React, Node.js, Python, Java
              - Experiencia en Firebase, PostgreSQL, MongoDB
              - Mentor tecnológico y facilitador
              - Ubicación: Chile
              
              INSTRUCCIONES:
              1. Usa SIEMPRE el CV Maestro como referencia de diseño y estructura
              2. Personaliza el contenido según los requisitos del puesto
              3. Destaca las habilidades y experiencias más relevantes
              4. Mantén un diseño profesional y legible
              5. Genera HTML estructurado listo para convertir a PDF
              6. Usa estilos CSS inline para mejor compatibilidad con PDF
              
              FORMATO DE RESPUESTA:
              Devuelve ÚNICAMENTE el HTML del CV, sin explicaciones adicionales.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      const htmlCV = data.choices[0].message.content;

      return {
        success: true,
        html: htmlCV,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al generar CV con MaikoCV:", error);

      // Fallback: generar CV básico si falla la API
      return {
        success: true,
        html: this.generarCVFallback(formData, perfilCandidato),
        timestamp: new Date().toISOString(),
        fallback: true,
      };
    }
  }

  /**
   * Construye el prompt para el agente MaikoCV
   * @param {Object} formData - Datos del formulario
   * @param {Object} perfilCandidato - Datos del perfil desde Firestore
   * @returns {string} - Prompt estructurado
   */
  construirPromptMaikoCV(formData, perfilCandidato = null) {
    const { reclutador, habilidadesSeleccionadas, descripcionCargo } = formData;

    // Usar datos del perfil si están disponibles
    const candidato = perfilCandidato || {
      nombre_completo: "Michael Esteban Sáez Contreras",
      cargo_principal: "Desarrollador Full Stack",
      experiencia_profesional: [],
      habilidades_tecnicas: { lenguajes: [], frameworks: [] },
    };

    return `
    SOLICITUD DE CV PERSONALIZADO:

    INFORMACIÓN DEL CANDIDATO (usar estos datos reales):
    - Nombre completo: ${candidato.nombre_completo}
    - Cargo principal: ${candidato.cargo_principal}
    - Ubicación: ${candidato.ubicacion || "Temuco, Chile"}
    - Email: ${candidato.email || "m.saezc@maikostudios.com"}
    - Teléfono: ${candidato.telefono || "+56983833148"}
    - LinkedIn: ${candidato.linkedin || "https://www.linkedin.com/in/me-saezc/"}
    - GitHub: ${candidato.github || "https://github.com/maikostudios"}
    - Web: ${candidato.web || "https://maikostudios.com/"}

    EXPERIENCIA PROFESIONAL REAL:
    ${
      candidato.experiencia_profesional
        ?.map(
          (exp) =>
            `- ${exp.cargo} en ${exp.empresa} (${exp.periodo}): ${exp.descripcion}`
        )
        .join("\n") || "Usar experiencia por defecto"
    }

    HABILIDADES TÉCNICAS REALES:
    - Lenguajes: ${
      candidato.habilidades_tecnicas?.lenguajes?.join(", ") ||
      "JavaScript, Python, Java"
    }
    - Frameworks: ${
      candidato.habilidades_tecnicas?.frameworks?.join(", ") ||
      "Vue.js, React, Node.js"
    }

    INFORMACIÓN DEL RECLUTADOR:
    - Nombre: ${reclutador?.nombre || formData.nombreReclutador}
    - Empresa: ${reclutador?.empresa || formData.empresa}
    - Posición: ${reclutador?.posicion || formData.posicion}
    - Email: ${reclutador?.email || formData.email}

    REQUISITOS DEL PUESTO:
    - Habilidades requeridas: ${(
      habilidadesSeleccionadas ||
      formData.tecnologias ||
      []
    ).join(", ")}
    - Descripción del cargo: ${
      descripcionCargo || formData.descripcionPuesto || ""
    }

    INSTRUCCIONES ESPECÍFICAS:
    1. Usa EXACTAMENTE los datos reales del candidato proporcionados arriba
    2. Personaliza el CV para la posición específica de ${
      reclutador?.posicion || formData.posicion
    }
    3. Destaca las habilidades que coincidan con los requisitos del puesto
    4. Adapta la descripción de experiencias para alinearse con el puesto
    5. Usa la paleta de colores: azul principal #2a60c4, turquesa #00cccc, gris #444
    6. Mantén estructura profesional con sidebar azul y contenido principal blanco
    7. Incluye emojis en la información de contacto
    8. Genera HTML completo con estilos CSS inline para PDF

    Genera el HTML del CV personalizado usando los datos reales del candidato.
    `;
  }

  /**
   * Genera un CV básico como fallback
   * @param {Object} formData - Datos del formulario
   * @param {Object} perfilCandidato - Datos del perfil desde Firestore
   * @returns {string} - HTML del CV básico
   */
  generarCVFallback(formData, perfilCandidato = null) {
    const habilidades =
      formData.habilidadesSeleccionadas || formData.tecnologias || [];
    const empresa =
      formData.empresa || formData.reclutador?.empresa || "Empresa";
    const posicion =
      formData.posicion || formData.reclutador?.posicion || "Desarrollador";

    // Usar datos del perfil si están disponibles
    const candidato = perfilCandidato || {
      nombre_completo: "Michael Esteban Sáez Contreras",
      cargo_principal: "Desarrollador Full Stack",
      email: "m.saezc@maikostudios.com",
      telefono: "+56983833148",
    };

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }
            header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
            .sub-header { font-size: 14px; margin-top: 5px; }
            .divider { height: 5px; background-color: #00cccc; }
            section { padding: 20px; }
            h2 { color: #00cccc; margin-bottom: 10px; }
            .entry { margin-bottom: 15px; }
            .entry-title { font-weight: bold; }
            .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; }
            a { color: #00cccc; text-decoration: none; }
            header a { color: white; }
            .highlight { background: #ffeb3b; padding: 2px 4px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <header>
            <h1>${candidato.nombre_completo}</h1>
            <div class="sub-header">${candidato.cargo_principal}</div>
            <div class="sub-header">${candidato.email} | ${
      candidato.telefono
    } | <a href="https://www.linkedin.com/in/me-saezc/" style="color:white;">LinkedIn</a> | <a href="https://maikostudios.com/" style="color:white;">maikostudios.com</a></div>
            <div class="sub-header">Temuco, IX Región, Chile</div>
        </header>
        <div class="divider"></div>

        <section>
            <h2>CV Personalizado para ${empresa}</h2>
            <p>Este CV ha sido personalizado específicamente para la posición de <strong>${posicion}</strong> en <strong>${empresa}</strong>.</p>
            <p>Habilidades que coinciden con los requisitos: <span class="highlight">${habilidades.join(
              ", "
            )}</span></p>
        </section>

        <section>
            <h2>Perfil Profesional</h2>
            <p>Desarrollador Full Stack con experiencia en tecnologías como Javascript, Node.js, Express, Vue, React, Java, Python y RoR. Capacidad para liderar equipos técnicos y enfocado en proyectos desafiantes que impulsen la innovación.</p>
        </section>

        <section>
            <h2>Experiencia Profesional</h2>

            <div class="entry">
                <div class="entry-title">Fundador y Desarrollador - Maiko Studios (2024 - Actualidad)</div>
                <p>Creación de plataformas como DeUna Transferencias, automatizaciones con IA, digitalización para PYMEs y asesorías tecnológicas.</p>
            </div>

            <div class="entry">
                <div class="entry-title">Facilitador/Docente Bootcamp Front End - Desafío Latam (Ago 2024 – Dic 2024)</div>
                <p>Enseñanza de HTML, CSS, BOOTSTRAP, JAVASCRIPT, y VUE JS en el Programa Talento Digital para Chile.</p>
            </div>

            <div class="entry">
                <div class="entry-title">Developer Full Stack & Soporte TI - Tata Consultancy Services – Metlife Chile (Jul 2021 – Dic 2023)</div>
                <p>Desarrollos para área Direct Marketing. Soporte a aplicaciones y resolución de tickets.</p>
            </div>
        </section>

        <section>
            <h2>Habilidades Técnicas</h2>
            <p><strong>Lenguajes:</strong> Javascript, Python, Java, Kotlin, SQL, PL/SQL, Ruby, PHP</p>
            <p><strong>Frontend:</strong> Vue.js, React, HTML, CSS, Bootstrap, Android</p>
            <p><strong>Backend / Microservicios:</strong> Node.js, Express, Spring Framework, RoR</p>
            <p><strong>Herramientas:</strong> GIT, JIRA, SCRUM, KANBAN, MVC, Trello, Firebase, Firestore</p>
        </section>

        <section>
            <h2>¿Por qué soy el candidato ideal para ${empresa}?</h2>
            <p>Mi experiencia como facilitador y desarrollador me ha permitido desarrollar tanto habilidades técnicas sólidas como capacidades de liderazgo y comunicación. Estoy preparado para contribuir inmediatamente al equipo de ${empresa} en la posición de ${posicion}.</p>
        </section>

        <div class="footer">
            Contacto: <a href="mailto:${candidato.email}">${
      candidato.email
    }</a> | <a href="https://www.linkedin.com/in/me-saezc/">LinkedIn</a> | <a href="https://maikostudios.com/">maikostudios.com</a>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Convierte HTML a PDF usando html2pdf.js
   * @param {string} htmlContent - Contenido HTML del CV
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<Blob>} - Blob del PDF generado
   */
  async convertirHTMLaPDF(htmlContent, filename = "cv-personalizado.pdf") {
    // Agregar CSS para evitar cortes de página
    const htmlConCSS = this.agregarCSSPageBreaks(htmlContent);

    const options = {
      margin: 0.5,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      const pdf = await html2pdf()
        .set(options)
        .from(htmlConCSS)
        .toPdf()
        .get("pdf");
      return pdf.output("blob");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  }

  /**
   * Renderiza el CV en un contenedor para previsualización
   * @param {string} htmlContent - Contenido HTML del CV
   * @param {string} containerId - ID del contenedor donde renderizar
   */
  renderizarCVEnContenedor(htmlContent, containerId = "cv-container") {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = htmlContent;
      container.style.display = "block";
    } else {
      console.error(`Contenedor ${containerId} no encontrado`);
    }
  }

  /**
   * Descarga el PDF generado
   * @param {Blob} pdfBlob - Blob del PDF
   * @param {string} filename - Nombre del archivo
   */
  descargarPDF(pdfBlob, filename = "cv-personalizado.pdf") {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Agrega CSS específico para evitar cortes de página
   * @param {string} htmlContent - HTML original
   * @returns {string} - HTML con CSS mejorado
   */
  agregarCSSPageBreaks(htmlContent) {
    const cssPageBreaks = `
    <style>
      /* CSS para evitar cortes de página */
      h1, h2, h3, h4, h5, h6 {
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
      }

      section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .entry {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .entry-title {
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
      }

      /* Evitar huérfanas y viudas */
      p {
        orphans: 3 !important;
        widows: 3 !important;
      }

      /* Mantener header y footer juntos */
      header {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      .footer {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Espaciado para evitar cortes */
      h2 {
        margin-top: 20px !important;
        margin-bottom: 15px !important;
      }
    </style>`;

    // Insertar CSS antes del cierre de </head>
    if (htmlContent.includes("</head>")) {
      return htmlContent.replace("</head>", cssPageBreaks + "\n</head>");
    } else {
      // Si no hay head, agregar al inicio del body
      return htmlContent.replace("<body>", "<body>" + cssPageBreaks);
    }
  }
}

export default new CVGeneratorService();
