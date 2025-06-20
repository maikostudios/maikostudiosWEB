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
   * Genera el HTML completo del CV con el estilo exacto de los componentes
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
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${datos.nombre_completo}</title>
        <style>
            ${this.obtenerEstilosCSS()}
        </style>
    </head>
    <body>
        <div class="container">
            ${this.generarSidebar(datos)}
            ${this.generarContenidoPrincipal(datos)}
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Obtiene los estilos CSS exactos de los componentes
   * @returns {string} - CSS completo
   */
  obtenerEstilosCSS() {
    return `
      :root {
          --azul: #2a60c4;
          --gris-fondo: #f4f4f4;
          --blanco: #ffffff;
          --gris-texto: #444;
      }

      * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
      }

      body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--blanco);
          color: var(--gris-texto);
          line-height: 1.6;
          font-size: 14px;
      }

      .container {
          display: grid;
          grid-template-columns: 30% 70%;
          max-width: 8.5in;
          margin: 0 auto;
          background: var(--blanco);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          min-height: 11in;
      }

      aside {
          background-color: var(--azul);
          color: white;
          padding: 2rem 1rem;
      }

      aside h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
      }

      aside img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 1rem;
          object-fit: cover;
          display: block;
          margin-left: auto;
          margin-right: auto;
      }

      aside .tagline {
          font-weight: bold;
          font-size: 0.9rem;
          margin-top: 1rem;
          line-height: 1.4;
          text-align: center;
      }

      aside section {
          margin-bottom: 1.5rem;
      }

      aside h2 {
          border-bottom: 2px solid white;
          padding-bottom: 0.25rem;
          color: white;
          margin-bottom: 1rem;
          font-size: 1.1rem;
      }

      aside p {
          margin: 0.5rem 0;
          color: white;
          font-size: 0.9rem;
      }

      aside a {
          color: #87ceeb;
          text-decoration: none;
      }

      aside a:hover {
          text-decoration: underline;
      }

      main {
          padding: 2rem;
      }

      main section {
          margin-bottom: 2rem;
      }

      main h2 {
          border-bottom: 2px solid var(--azul);
          padding-bottom: 0.25rem;
          color: var(--azul);
          margin-bottom: 1rem;
          font-size: 1.2rem;
      }

      main p {
          margin: 0.5rem 0;
          color: var(--gris-texto);
          line-height: 1.6;
      }

      main a {
          color: var(--azul);
          text-decoration: none;
      }

      main a:hover {
          text-decoration: underline;
      }

      .section-block {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
      }

      .section-block h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
          color: var(--gris-texto);
      }

      .section-block p {
          margin: 0.2rem 0;
          font-size: 0.9rem;
          color: var(--gris-texto);
      }

      .section-block .periodo {
          font-style: italic;
          color: #666;
          font-size: 0.85rem;
      }

      ul {
          padding-left: 1rem;
          margin: 0.5rem 0;
      }

      .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          list-style: none;
          padding-left: 0;
      }

      .skills li {
          width: 45%;
          color: var(--gris-texto);
          font-size: 0.9rem;
          position: relative;
          padding-left: 1rem;
      }

      .skills li:before {
          content: "•";
          color: var(--azul);
          font-weight: bold;
          position: absolute;
          left: 0;
      }

      .languages {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          list-style: none;
          padding-left: 0;
      }

      .languages li {
          width: 45%;
          color: white;
          font-size: 0.9rem;
      }

      @media print {
          body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: white;
          }
          .container {
              box-shadow: none;
              max-width: 100%;
              margin: 0;
          }
      }
    `;
  }

  /**
   * Genera el sidebar del CV
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML del sidebar
   */
  generarSidebar(datos) {
    return `
      <aside>
          <img src="https://avatars.githubusercontent.com/u/68249859?v=4" alt="Foto ${
            datos.nombre_completo
          }">
          <h1>${datos.nombre_completo}</h1>
          <p class="tagline">
              ${datos.cargo_principal}<br>
              Javascript | Nodejs | Express | Vue | React | Java | Python<br>
              Facilitador y Mentor Tecnológico
          </p>
          
          <section>
              <h2>Contacto</h2>
              <p><strong>Email:</strong> ${datos.email}</p>
              <p><strong>Dirección:</strong> ${datos.ubicacion}</p>
              <p><strong>Teléfono:</strong> ${datos.telefono}</p>
              <p><strong>LinkedIn:</strong> <a href="${
                datos.linkedin
              }">linkedin.com/in/me-saezc</a></p>
              <p><strong>GitHub:</strong> <a href="https://github.com/maikostudios">github.com/maikostudios</a></p>
              <p><strong>Portafolio:</strong> <a href="${
                datos.web
              }">www.maikostudios.com</a></p>
          </section>

          <section>
              <h2>Idiomas</h2>
              ${this.generarIdiomas(datos.idiomas)}
          </section>
      </aside>
    `;
  }

  /**
   * Genera el contenido principal del CV
   * @param {Object} datos - Datos del candidato
   * @returns {string} - HTML del contenido principal
   */
  generarContenidoPrincipal(datos) {
    return `
      <main>
          <section>
              <h2>Resumen Profesional</h2>
              <p>${datos.perfil_profesional}</p>
              <p>Mi enfoque es la mejora continua, tanto en el desarrollo de software como en la mentoría de futuros profesionales. Busco contribuir a proyectos desafiantes que requieran habilidades técnicas sólidas y liderazgo efectivo.</p>
          </section>

          <section>
              <h2>Experiencia Profesional</h2>
              ${this.generarExperienciaProfesional(
                datos.experiencia_profesional
              )}
          </section>

          <section>
              <h2>Educación</h2>
              ${this.generarEducacion(datos.educacion)}
          </section>

          <section>
              <h2>Habilidades Técnicas</h2>
              ${this.generarHabilidadesTecnicas(datos.habilidades_tecnicas)}
          </section>

          <section>
              <h2>Certificaciones</h2>
              ${this.generarCertificaciones(datos.certificaciones)}
          </section>
      </main>
    `;
  }

  /**
   * Genera la sección de idiomas
   * @param {Array} idiomas - Array de idiomas
   * @returns {string} - HTML de idiomas
   */
  generarIdiomas(idiomas) {
    if (!idiomas || !Array.isArray(idiomas)) {
      return `
        <ul class="languages">
          <li>Español - Nativo</li>
          <li>Inglés - Intermedio</li>
          <li>Portugués - Básico</li>
          <li>Japonés - Básico</li>
        </ul>
      `;
    }

    return `
      <ul class="languages">
        ${idiomas
          .map((idioma) => `<li>${idioma.idioma} - ${idioma.nivel}</li>`)
          .join("")}
      </ul>
    `;
  }

  /**
   * Genera la sección de experiencia profesional
   * @param {Array} experiencia - Array de experiencias
   * @returns {string} - HTML de experiencia
   */
  generarExperienciaProfesional(experiencia) {
    if (!experiencia || !Array.isArray(experiencia)) {
      return `
        <div class="section-block">
          <h3>Facilitador Front End - Desafío Latam</h3>
          <p class="periodo">Ago 2024 - Dic 2024</p>
          <p>Impartí cursos en tecnologías Front End como HTML, CSS, JavaScript, y Vue en el marco del programa Talento Digital para Chile. Certificado como facilitador por la institución.</p>
        </div>
        <div class="section-block">
          <h3>Facilitador Bootcamp - INFOCAL</h3>
          <p class="periodo">Ene 2024 - Sep 2024</p>
          <p>Docente en cursos de desarrollo Front End usando HTML, CSS, JavaScript, Bootstrap y Vue.js, adaptando contenidos a estudiantes en formación técnica.</p>
        </div>
        <div class="section-block">
          <h3>Full Stack Developer - Tata Consultancy Services</h3>
          <p class="periodo">Jul 2021 - Dic 2023</p>
          <p>Desarrollador líder en proyectos para Metlife Chile, resolviendo el 100% de tickets reportados. Trabajo Full Stack con tecnologías JavaScript, Node, y SQL.</p>
        </div>
        <div class="section-block">
          <h3>Soporte TI - NTTDATA Centers</h3>
          <p class="periodo">Nov 2020 - Dic 2021</p>
          <p>Gestión de incidencias, soporte técnico, geolocalización de datos y configuración de infraestructura tecnológica.</p>
        </div>
      `;
    }

    return experiencia
      .map(
        (exp) => `
      <div class="section-block">
        <h3>${exp.cargo} - ${exp.empresa}</h3>
        <p class="periodo">${exp.periodo}</p>
        <p>${exp.descripcion}</p>
      </div>
    `
      )
      .join("");
  }

  /**
   * Genera la sección de educación
   * @param {Array} educacion - Array de educación
   * @returns {string} - HTML de educación
   */
  generarEducacion(educacion) {
    if (!educacion || !Array.isArray(educacion)) {
      return `
        <div class="section-block">
          <h3>Ingeniería en Informática Mención Ciberseguridad</h3>
          <p class="periodo">Instituto Profesional Providencia (2021 – Actualmente)</p>
        </div>
      `;
    }

    return educacion
      .map(
        (edu) => `
      <div class="section-block">
        <h3>${edu.titulo || edu.carrera}</h3>
        <p class="periodo">${edu.institucion} (${edu.periodo})</p>
        ${edu.descripcion ? `<p>${edu.descripcion}</p>` : ""}
      </div>
    `
      )
      .join("");
  }

  /**
   * Genera la sección de habilidades técnicas
   * @param {Object} habilidades - Objeto de habilidades técnicas
   * @returns {string} - HTML de habilidades
   */
  generarHabilidadesTecnicas(habilidades) {
    if (!habilidades) {
      return `
        <ul class="skills">
          <li>Desarrollo Web Full Stack</li>
          <li>Mentorías Técnicas</li>
          <li>Scrum / Kanban</li>
          <li>Node.js, Vue, React, Express</li>
          <li>SQL, PostgreSQL, MongoDB</li>
          <li>Spring Boot, Java 8+, Python</li>
          <li>GIT, Jira, MVC</li>
          <li>Automatización con herramientas IA</li>
        </ul>
      `;
    }

    let skillsHTML = '<ul class="skills">';

    if (habilidades.lenguajes) {
      habilidades.lenguajes.forEach((skill) => {
        skillsHTML += `<li>${skill}</li>`;
      });
    }

    if (habilidades.frameworks) {
      habilidades.frameworks.forEach((skill) => {
        skillsHTML += `<li>${skill}</li>`;
      });
    }

    if (habilidades.bases_datos) {
      habilidades.bases_datos.forEach((skill) => {
        skillsHTML += `<li>${skill}</li>`;
      });
    }

    if (habilidades.herramientas) {
      habilidades.herramientas.forEach((skill) => {
        skillsHTML += `<li>${skill}</li>`;
      });
    }

    skillsHTML += "</ul>";
    return skillsHTML;
  }

  /**
   * Genera la sección de certificaciones
   * @param {Array} certificaciones - Array de certificaciones
   * @returns {string} - HTML de certificaciones
   */
  generarCertificaciones(certificaciones) {
    if (!certificaciones || !Array.isArray(certificaciones)) {
      return `
        <ul>
          <li>Vue.js Certified Developer</li>
          <li>Firebase Certified</li>
          <li>JavaScript Full Stack Development</li>
          <li>Android Mobile Development</li>
          <li>Facilitador eLearning Certificado</li>
          <li>Scrum Master Fundamentals</li>
        </ul>
      `;
    }

    return `
      <ul>
        ${certificaciones
          .map((cert) => `<li>${cert.nombre || cert}</li>`)
          .join("")}
      </ul>
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
