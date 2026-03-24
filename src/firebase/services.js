import apiClient from '@/api/apiClient';

// Mantendré la exportación de pricingService para no romper dependencias,
// pero re-exportándolo desde el nuevo servicio.
export { pricingService } from '@/services/pricingService';

// Servicio para contacto (REST)
export const contactService = {
  async enviarMensaje(datos) {
    try {
      const response = await apiClient.post('/contact', datos);
      return { success: true, id: response.data.id || response.data._id };
    } catch (error) {
      console.error("Error enviando mensaje de contacto:", error);
      return { success: false, error: error.message || 'Error de conexión' };
    }
  },

  async obtenerMensajes() {
    try {
      const response = await apiClient.get('/contact');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error("Error obteniendo mensajes de contacto:", error);
      return { success: false, error: error.message };
    }
  },

  async marcarComoLeido(mensajeId) {
    try {
      await apiClient.patch(`/contact/${mensajeId}/read`);
      return { success: true };
    } catch (error) {
      console.error("Error marcando mensaje como leído:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para CV (REST)
export const cvService = {
  async guardarSolicitudCV(datos) {
    try {
      const response = await apiClient.post('/cv/request', datos);
      return { success: true, id: response.data.id };
    } catch (error) {
      console.error("Error guardando solicitud de CV:", error);
      return { success: false, error: error.message };
    }
  },

  async obtenerSolicitudesCV() {
    try {
      const response = await apiClient.get('/cv/requests');
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error("Error obteniendo solicitudes de CV:", error);
      return { success: false, error: error.message };
    }
  },

  // Guardar información del reclutador (placeholder / no implementado localmente pero no rompe el flujo)
  async guardarReclutador(datosReclutador) {
    console.log("👤 Reclutador web guardado (sin persistencia estricta):", datosReclutador);
    return {
      success: true,
      id: "demo-reclutador-" + Date.now(),
      demo: true,
    };
  },

  // Actualizar estado del CV del reclutador (placeholder)
  async actualizarEstadoCV(reclutadorId, datosCV) {
    console.log("📄 Estado CV web actualizado:", { reclutadorId, datosCV });
    return {
      success: true,
      demo: true,
    };
  },
};

// Servicio para estadísticas (REST)
export const statsService = {
  async registrarVisita(pagina) {
    try {
      await apiClient.post('/stats/visit', { page: pagina });
      return { success: true };
    } catch (error) {
      // No loguear fuertemente para no ensuciar consola
      return { success: false, error: error.message };
    }
  },

  async obtenerEstadisticas() {
    try {
      const response = await apiClient.get('/stats');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      return { 
        success: false, 
        data: { totalVisitas: 0, totalMensajes: 0, totalSolicitudesCV: 0, totalProyectos: 0 }
      };
    }
  },
};

// Servicio para perfil del candidato (Estático)
export const perfilService = {
  async obtenerPerfilCandidato() {
    return {
      success: true,
      data: this.obtenerDatosLocal(),
      demo: true,
    };
  },

  obtenerDatosLocal() {
    return {
      nombre_completo: "Michael Esteban Sáez Contreras",
      cargo_principal: "Desarrollador Full Stack",
      ubicacion: "Temuco, IX Región, Chile",
      email: "m.saezc@maikostudios.com",
      telefono: "+56920648446",
      linkedin: "https://www.linkedin.com/in/me-saezc/",
      github: "https://github.com/maikostudios",
      web: "https://maikostudios.com/",
      perfil_profesional: "Desarrollador Full Stack con experiencia comprobada en tecnologías modernas como Vue, React, Node.js, Java y Python. Certificado como facilitador e-learning y comprometido con la formación de nuevos talentos. Apasionado por la innovación, automatización y optimización de procesos usando software y herramientas digitales. Dispuesto a liderar o integrarse en equipos con metodologías ágiles (Scrum/Kanban).",
      experiencia_profesional: [
        {
          cargo: "Fundador y Desarrollador Principal",
          empresa: "Maiko Studios",
          periodo: "2024 - Presente",
          descripcion: "Creación y desarrollo de plataformas digitales innovadoras como DeUna Transferencias. Implementación de automatizaciones con IA para optimizar procesos empresariales. Digitalización integral para PYMEs y asesorías tecnológicas especializadas.",
        },
        {
          cargo: "Facilitador Front End",
          empresa: "Desafío Latam",
          periodo: "Ago 2024 - Dic 2024",
          descripcion: "Impartí cursos en tecnologías Front End como HTML, CSS, JavaScript, y Vue en el marco del programa Talento Digital para Chile. Certificado como facilitador por la institución, enfocado en la formación de nuevos desarrolladores.",
        },
        {
          cargo: "Facilitador Bootcamp",
          empresa: "INFOCAL",
          periodo: "Ene 2024 - Sep 2024",
          descripcion: "Docente en cursos de desarrollo Front End usando HTML, CSS, JavaScript, Bootstrap y Vue.js, adaptando contenidos a estudiantes en formación técnica y profesional.",
        },
        {
          cargo: "Full Stack Developer",
          empresa: "Tata Consultancy Services",
          periodo: "Jul 2021 - Dic 2023",
          descripcion: "Desarrollador líder en proyectos para Metlife Chile, resolviendo el 100% de tickets reportados. Trabajo Full Stack con tecnologías JavaScript, Node.js, Express, y bases de datos SQL.",
        },
        {
          cargo: "Soporte TI",
          empresa: "NTTDATA Centers",
          periodo: "Nov 2020 - Dic 2021",
          descripcion: "Gestión de incidencias, soporte técnico especializado, geolocalización de datos y configuración de infraestructura tecnológica para clientes corporativos.",
        },
      ],
      educacion: [
        {
          titulo: "Ingeniería en Informática Mención Ciberseguridad",
          institucion: "Instituto Profesional Providencia",
          periodo: "2021 - Actualmente",
          descripcion: "Especialización en desarrollo de software seguro y arquitecturas de ciberseguridad.",
        },
      ],
      habilidades_tecnicas: {
        lenguajes: ["JavaScript", "Python", "Java", "TypeScript", "HTML5", "CSS3"],
        frameworks: ["Vue.js", "React", "Angular", "Node.js", "Express.js", "Spring Boot", "Django", "Flask"],
        bases_datos: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
        herramientas: ["Git", "Docker", "AWS", "Jira", "Figma", "Adobe XD"],
        metodologias: ["Scrum", "Kanban", "Agile", "DevOps", "CI/CD", "MVC", "MVVM", "Microservicios"],
      },
      certificaciones: [
        "Vue.js Certified Developer",
        "JavaScript Full Stack Development",
        "Android Mobile Development",
        "Facilitador eLearning Certificado",
        "Scrum Master Fundamentals",
        "AWS Cloud Practitioner",
      ],
      idiomas: [
        { idioma: "Español", nivel: "Nativo" },
        { idioma: "Inglés", nivel: "Intermedio" },
        { idioma: "Portugués", nivel: "Básico" },
        { idioma: "Japonés", nivel: "Básico" },
      ],
      info_adicional: {
        licencia: "Clase B",
        situacion_militar: "al día",
        disponibilidad: "Inmediata",
      },
      areas_interes: [
        "Desarrollo Full Stack",
        "DevOps y Cloud Computing",
        "Inteligencia Artificial",
        "Liderazgo Técnico",
        "Mentoría y Educación",
        "Automatización de Procesos",
      ],
    };
  },

  async actualizarPerfil(datosPerfil) {
    console.log("📝 Perfil local no fue actualizado:", datosPerfil);
    return { success: true, demo: true };
  },
};

// Servicio para plantillas de CV (Estático)
export const plantillasService = {
  async obtenerPlantillaCV() {
    return {
      success: true,
      data: this.obtenerPlantillaLocal(),
      demo: true,
    };
  },

  obtenerPlantillaLocal() {
    return {
      nombre: "cv_michael_saez_completo",
      tipo: "cv_profesional",
      plantilla_cv_maiko: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000 !important; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; color: white; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; color: #000 !important; }
    h1, h2, h3, h4, h5, h6 { color: #000 !important; margin-bottom: 10px; }
    h2 { color: #00cccc !important; margin-bottom: 10px; }
    h3 { color: #000 !important; font-size: 16px; font-weight: bold; margin-bottom: 8px; margin-top: 15px; }
    .entry { margin-bottom: 15px; color: #000 !important; }
    .entry-title { font-weight: bold; color: #000 !important; }
    .entry-subtitle { color: #000 !important; font-style: italic; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; color: #000 !important; }
    p { color: #000 !important; }
    div { color: #000 !important; }
    span { color: #000 !important; }
    a { color: #00cccc; text-decoration: none; }
    header a { color: white !important; }
    * { color: #000 !important; }
    header *, header h1, header .sub-header { color: white !important; }
    h2 { color: #00cccc !important; }
  </style>
</head>
<body>
  <header>
    <h1>{{nombre_completo}}</h1>
    <div class="sub-header">{{cargo_principal}}</div>
    <div class="sub-header">{{email}} | {{telefono}} | <a href="{{linkedin}}" style="color:white;">LinkedIn</a> | <a href="{{web}}" style="color:white;">maikostudios.com</a></div>
    <div class="sub-header">{{ubicacion}}</div>
  </header>
  <div class="divider"></div>
  <section>
    <h2>Perfil Profesional</h2>
    <p>{{perfil_profesional}}</p>
  </section>
  <section>
    <h2>Experiencia Profesional</h2>
    {{experiencia_profesional}}
  </section>
  <section>
    <h2>Educación</h2>
    {{educacion}}
  </section>
  <section>
    <h2>Certificaciones</h2>
    <p>{{certificaciones}}</p>
  </section>
  <section>
    <h2>Habilidades Técnicas</h2>
    {{habilidades_tecnicas}}
  </section>
  <section>
    <h2>Habilidades Blandas</h2>
    <p>{{habilidades_blandas}}</p>
  </section>
  <section>
    <h2>Idiomas</h2>
    <p>{{idiomas}}</p>
  </section>
  <section>
    <h2>Información Adicional</h2>
    <p>{{info_adicional}}</p>
  </section>
  <div class="footer">
    Contacto: <a href="mailto:{{email}}">{{email}}</a> | <a href="{{linkedin}}">LinkedIn</a> | <a href="{{web}}">maikostudios.com</a>
  </div>
</body>
</html>`,
      descripcion: "Plantilla oficial del CV de Michael Sáez",
      version: "1.0",
      activa: true,
      campos_variables: [
        "nombre_completo", "cargo_principal", "email", "telefono", "linkedin", "web", "ubicacion",
        "perfil_profesional", "experiencia_profesional", "educacion", "certificaciones",
        "habilidades_tecnicas", "habilidades_blandas", "idiomas", "info_adicional",
      ],
    };
  },

  async guardarPlantilla(plantillaData) {
    console.log("📄 Plantilla web no persistida externamente:", plantillaData.nombre);
    return { success: true, demo: true };
  },
};
