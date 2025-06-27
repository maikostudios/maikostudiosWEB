// Servicio especializado para generar PDF del CV con el estilo exacto de los componentes
import html2pdf from "html2pdf.js";
import { perfilService } from "@/firebase/services";

class CVPDFService {
  constructor() {
    this.configuracionPDF = {
      margin: 0.5,
      filename: "cv-michael-saez.pdf",
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
    };
  }

  /**
   * Genera el HTML completo del CV usando la estructura exacta del CV tipo
   * @param {Object} perfilCandidato - Datos del perfil del candidato
   * @returns {string} - HTML completo del CV
   */
  generarHTMLCompleto(perfilCandidato = null) {
    // Datos por defecto si no hay perfil
    const datos = perfilCandidato || this.obtenerDatosPorDefecto();

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
        </style>
    </head>
    <body>
        ${this.generarHeader(datos)}
        <div class="divider"></div>
        ${this.generarPerfilProfesional(datos)}
        ${this.generarExperienciaProfesional(datos)}
        ${this.generarEducacion(datos)}
        ${this.generarCertificaciones(datos)}
        ${this.generarHabilidadesTecnicas(datos)}
        ${this.generarHabilidadesBlandas(datos)}
        ${this.generarIdiomas(datos)}
        ${this.generarInformacionAdicional(datos)}
        ${this.generarFooter(datos)}
    </body>
    </html>
    `;
  }

  /**
   * Genera el header del CV según la estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML del header
   */
  generarHeader(datos) {
    return `
      <header>
        <h1>${datos.nombre_completo}</h1>
        <div class="sub-header">${datos.cargo_principal}</div>
        <div class="sub-header">${datos.email} | ${datos.telefono} | <a href="${datos.linkedin}" style="color:white;">LinkedIn</a> | <a href="${datos.web}" style="color:white;">maikostudios.com</a></div>
        <div class="sub-header">${datos.ubicacion}</div>
      </header>
    `;
  }

  /**
   * Genera la sección de perfil profesional
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML del perfil profesional
   */
  generarPerfilProfesional(datos) {
    return `
      <section>
        <h2>Perfil Profesional</h2>
        <p>${
          datos.perfil_profesional ||
          "Desarrollador Full Stack con experiencia en tecnologías como Javascript, Node.js, Express, Vue, React, Java, Python y RoR. Capacidad para liderar equipos técnicos y enfocado en proyectos desafiantes que impulsen la innovación."
        }</p>
      </section>
    `;
  }

  /**
   * Genera la sección de habilidades blandas
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de habilidades blandas
   */
  generarHabilidadesBlandas(datos) {
    const habilidadesBlandas = datos.habilidades_blandas || [
      "Liderazgo de equipos y mentoría",
      "Resolución de problemas y análisis técnico",
      "Comunicación efectiva y docencia",
      "Gestión de proyectos e incidencias",
      "Orientación al cliente y habilidades comerciales",
    ];

    return `
      <section>
        <h2>Habilidades Blandas</h2>
        <p>${
          Array.isArray(habilidadesBlandas)
            ? habilidadesBlandas.join(", ")
            : habilidadesBlandas
        }</p>
      </section>
    `;
  }

  /**
   * Genera la sección de información adicional
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de información adicional
   */
  generarInformacionAdicional(datos) {
    const infoAdicional = datos.info_adicional || {
      licencia: "Clase B",
      situacion_militar: "al día",
    };

    return `
      <section>
        <h2>Información Adicional</h2>
        <p>Licencia de conducir ${infoAdicional.licencia}. Servicio Militar ${infoAdicional.situacion_militar}.</p>
      </section>
    `;
  }

  /**
   * Genera el footer del CV
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML del footer
   */
  generarFooter(datos) {
    return `
      <div class="footer">
        Contacto: <a href="mailto:${datos.email}">${datos.email}</a> | <a href="${datos.linkedin}">LinkedIn</a> | <a href="${datos.web}">maikostudios.com</a>
      </div>
    `;
  }

  /**
   * Genera la sección de experiencia profesional según estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de experiencia
   */
  generarExperienciaProfesional(datos) {
    const experiencia = datos.experiencia_profesional;

    if (!experiencia || !Array.isArray(experiencia)) {
      return `
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
            <div class="entry-title">Facilitador/Docente Bootcamp Front End - INFOCAL (Ene 2024 – Sep 2024)</div>
            <p>Enseñanza de HTML, CSS, BOOTSTRAP, JAVASCRIPT, y VUE JS. Certificado por Desafío Latam.</p>
          </div>

          <div class="entry">
            <div class="entry-title">Developer Full Stack & Soporte TI - Tata Consultancy Services – Metlife Chile (Jul 2021 – Dic 2023)</div>
            <p>Desarrollos para área Direct Marketing. Soporte a aplicaciones y resolución de tickets.</p>
          </div>

          <div class="entry">
            <div class="entry-title">Developer & Soporte TI - NTTDATA Centers – Chile (Nov 2020 – 2021)</div>
            <p>Gestión de datos GIS, implementación de soluciones, soporte técnico.</p>
          </div>
        </section>
      `;
    }

    const experienciaHTML = experiencia
      .map(
        (exp) => `
        <div class="entry">
          <div class="entry-title">${exp.cargo} - ${exp.empresa} (${exp.periodo})</div>
          <p>${exp.descripcion}</p>
        </div>
      `
      )
      .join("");

    return `
      <section>
        <h2>Experiencia Profesional</h2>
        ${experienciaHTML}
      </section>
    `;
  }

  /**
   * Genera la sección de educación según estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de educación
   */
  generarEducacion(datos) {
    const educacion = datos.educacion;

    if (!educacion || !Array.isArray(educacion)) {
      return `
        <section>
          <h2>Educación</h2>
          <p><strong>Ingeniería en Informática Mención Ciberseguridad</strong> - Instituto Profesional Providencia (2021 – Actualmente)</p>
          <p><strong>Certificado Facilitador Cursos e-learning</strong> - Desafío Latam (2024)</p>
          <p><strong>Desarrollo de Aplicaciones Móviles Full Stack Android</strong> - Awakelab - Fundación Fudesco (2023)</p>
          <p><strong>Desarrollo de Aplicaciones Full Stack Javascript</strong> - Talento Digital para Chile (2022)</p>
          <p><strong>Programador Front End y Back End</strong> - Instituto Hernando de Magallanes (2021)</p>
          <p><strong>Administración de Empresas Mención Marketing</strong> - Instituto AIEP (2016 – 2017)</p>
        </section>
      `;
    }

    const educacionHTML = educacion
      .map(
        (edu) => `
        <p><strong>${edu.titulo}</strong> - ${edu.institucion} (${edu.periodo})</p>
      `
      )
      .join("");

    return `
      <section>
        <h2>Educación</h2>
        ${educacionHTML}
      </section>
    `;
  }

  /**
   * Genera la sección de habilidades técnicas según estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de habilidades técnicas
   */
  generarHabilidadesTecnicas(datos) {
    const habilidades = datos.habilidades_tecnicas;

    if (!habilidades) {
      return `
        <section>
          <h2>Habilidades Técnicas</h2>
          <p><strong>Lenguajes:</strong> Javascript, Python, Java, Kotlin, SQL, PL/SQL, Ruby, PHP</p>
          <p><strong>Frontend:</strong> Vue.js, React, HTML, CSS, Bootstrap, Android</p>
          <p><strong>Backend / Microservicios:</strong> Node.js, Express, Spring Framework, RoR</p>
          <p><strong>Stack:</strong> MEVN, MERN, MEAN</p>
          <p><strong>Bases de Datos:</strong> MySQL, PostgreSQL, MongoDB, Relacionales, No Relacionales</p>
          <p><strong>Herramientas:</strong> GIT, JIRA, SCRUM, KANBAN, MVC, Trello, Firebase, Firestore</p>
        </section>
      `;
    }

    return `
      <section>
        <h2>Habilidades Técnicas</h2>
        ${
          habilidades.lenguajes
            ? `<p><strong>Lenguajes:</strong> ${habilidades.lenguajes.join(
                ", "
              )}</p>`
            : ""
        }
        ${
          habilidades.frameworks
            ? `<p><strong>Frontend/Backend:</strong> ${habilidades.frameworks.join(
                ", "
              )}</p>`
            : ""
        }
        ${
          habilidades.bases_datos
            ? `<p><strong>Bases de Datos:</strong> ${habilidades.bases_datos.join(
                ", "
              )}</p>`
            : ""
        }
        ${
          habilidades.herramientas
            ? `<p><strong>Herramientas:</strong> ${habilidades.herramientas.join(
                ", "
              )}</p>`
            : ""
        }
        ${
          habilidades.metodologias
            ? `<p><strong>Metodologías:</strong> ${habilidades.metodologias.join(
                ", "
              )}</p>`
            : ""
        }
      </section>
    `;
  }

  /**
   * Genera la sección de certificaciones según estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de certificaciones
   */
  generarCertificaciones(datos) {
    const certificaciones = datos.certificaciones;

    if (!certificaciones || !Array.isArray(certificaciones)) {
      return `
        <section>
          <h2>Certificaciones</h2>
          <p>Vue.js, Firebase, JavaScript Fullstack, Android Mobile Development, Facilitador eLearning</p>
        </section>
      `;
    }

    return `
      <section>
        <h2>Certificaciones</h2>
        <p>${certificaciones.join(", ")}</p>
      </section>
    `;
  }

  /**
   * Genera la sección de idiomas según estructura del CV tipo
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML de idiomas
   */
  generarIdiomas(datos) {
    const idiomas = datos.idiomas;

    if (!idiomas || !Array.isArray(idiomas)) {
      return `
        <section>
          <h2>Idiomas</h2>
          <p>Español (Nativo), Inglés (Intermedio), Portugués (Básico), Japonés (Básico)</p>
        </section>
      `;
    }

    const idiomasTexto = idiomas
      .map((idioma) => `${idioma.idioma} (${idioma.nivel})`)
      .join(", ");

    return `
      <section>
        <h2>Idiomas</h2>
        <p>${idiomasTexto}</p>
      </section>
    `;
  }

  /**
   * Convierte el HTML a PDF usando html2pdf.js
   * @param {string} htmlContent - Contenido HTML
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<Blob>} - Blob del PDF
   */
  async convertirAPDF(htmlContent, filename = "cv-michael-saez.pdf") {
    try {
      // Crear elemento temporal en el DOM
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "8.5in";
      tempDiv.style.backgroundColor = "#ffffff";

      document.body.appendChild(tempDiv);

      // Configurar opciones específicas para este diseño
      const opciones = {
        ...this.configuracionPDF,
        filename,
      };

      const pdf = await html2pdf()
        .set(opciones)
        .from(tempDiv)
        .toPdf()
        .get("pdf");

      // Limpiar elemento temporal
      document.body.removeChild(tempDiv);

      return pdf.output("blob");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  }

  /**
   * Descarga el PDF
   * @param {Blob} pdfBlob - Blob del PDF
   * @param {string} filename - Nombre del archivo
   */
  descargarPDF(pdfBlob, filename = "cv-michael-saez.pdf") {
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
   * Genera y descarga el CV completo
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async generarYDescargarCV(filename = "cv-michael-saez.pdf") {
    try {
      // Obtener datos del perfil desde Firebase
      const perfilResult = await perfilService.obtenerPerfilCandidato();
      const perfilCandidato = perfilResult.success ? perfilResult.data : null;

      // Generar HTML completo
      const htmlCompleto = this.generarHTMLCompleto(perfilCandidato);

      // Convertir a PDF
      const pdfBlob = await this.convertirAPDF(htmlCompleto, filename);

      // Descargar
      this.descargarPDF(pdfBlob, filename);

      return {
        success: true,
        filename,
        size: pdfBlob.size,
      };
    } catch (error) {
      console.error("Error al generar y descargar CV:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene datos por defecto del candidato
   * @returns {Object} - Datos por defecto
   */
  obtenerDatosPorDefecto() {
    return {
      nombre_completo: "Michael Esteban Sáez Contreras",
      cargo_principal: "Desarrollador Full Stack",
      ubicacion: "Temuco, IX Región, Chile",
      email: "m.saezc@maikostudios.com",
      telefono: "+56983833148",
      linkedin: "https://www.linkedin.com/in/me-saezc/",
      web: "https://maikostudios.com/",
      perfil_profesional:
        "Desarrollador Full Stack con experiencia comprobada en tecnologías modernas como Vue, React, Node.js, Java y Python. Certificado como facilitador e-learning y comprometido con la formación de nuevos talentos. Apasionado por la innovación, automatización y optimización de procesos usando software y herramientas digitales. Dispuesto a liderar o integrarse en equipos con metodologías ágiles (Scrum/Kanban).",
    };
  }
}

export default new CVPDFService();
