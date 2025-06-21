// Firebase Services
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

// Función helper para verificar si Firebase está disponible
const checkFirebaseAvailable = () => {
  if (!db || !isFirebaseConfigured()) {
    console.warn("Firebase no está configurado. Usando modo demo.");
    return false;
  }
  return true;
};

// Datos de demo para cuando Firebase no está configurado
const demoData = {
  mensajes: [
    {
      id: "demo-1",
      nombre: "Usuario Demo",
      email: "demo@ejemplo.com",
      asunto: "Consulta de ejemplo",
      mensaje: "Este es un mensaje de demostración",
      fechaCreacion: new Date(),
      leido: false,
      respondido: false,
    },
  ],
  solicitudesCV: [
    {
      id: "demo-cv-1",
      nombreReclutador: "Reclutador Demo",
      empresa: "Empresa Demo",
      posicion: "Desarrollador Full Stack",
      fechaCreacion: new Date(),
      procesado: false,
    },
  ],
};

// Servicio para mensajes de contacto
export const contactService = {
  // Enviar mensaje de contacto
  async enviarMensaje(datos) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular envío exitoso
      console.log("📧 Mensaje demo enviado:", datos);
      return {
        success: true,
        id: "demo-" + Date.now(),
        demo: true,
      };
    }

    try {
      const docRef = await addDoc(collection(db, "mensajes_contacto"), {
        ...datos,
        fechaCreacion: serverTimestamp(),
        leido: false,
        respondido: false,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener todos los mensajes (para admin)
  async obtenerMensajes() {
    if (!checkFirebaseAvailable()) {
      // Modo demo - devolver datos de ejemplo
      return {
        success: true,
        data: demoData.mensajes,
        demo: true,
      };
    }

    try {
      const q = query(
        collection(db, "mensajes_contacto"),
        orderBy("fechaCreacion", "desc")
      );
      const querySnapshot = await getDocs(q);
      const mensajes = [];
      querySnapshot.forEach((doc) => {
        mensajes.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: mensajes };
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return { success: false, error: error.message };
    }
  },

  // Marcar mensaje como leído
  async marcarComoLeido(mensajeId) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular éxito
      console.log("✅ Mensaje demo marcado como leído:", mensajeId);
      return { success: true, demo: true };
    }

    try {
      await updateDoc(doc(db, "mensajes_contacto", mensajeId), {
        leido: true,
        fechaLectura: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error al marcar como leído:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para solicitudes de CV
export const cvService = {
  // Guardar solicitud de CV personalizado
  async guardarSolicitudCV(datos) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular guardado exitoso
      console.log("📄 Solicitud CV demo guardada:", datos);
      return {
        success: true,
        id: "demo-cv-" + Date.now(),
        demo: true,
      };
    }

    try {
      const docRef = await addDoc(collection(db, "solicitudes_cv"), {
        ...datos,
        fechaCreacion: serverTimestamp(),
        procesado: false,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al guardar solicitud CV:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener solicitudes de CV (para admin)
  async obtenerSolicitudesCV() {
    if (!checkFirebaseAvailable()) {
      // Modo demo - devolver datos de ejemplo
      return {
        success: true,
        data: demoData.solicitudesCV,
        demo: true,
      };
    }

    try {
      const q = query(
        collection(db, "solicitudes_cv"),
        orderBy("fechaCreacion", "desc")
      );
      const querySnapshot = await getDocs(q);
      const solicitudes = [];
      querySnapshot.forEach((doc) => {
        solicitudes.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: solicitudes };
    } catch (error) {
      console.error("Error al obtener solicitudes CV:", error);
      return { success: false, error: error.message };
    }
  },

  // Guardar información del reclutador
  async guardarReclutador(datosReclutador) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular guardado exitoso
      console.log("👤 Reclutador demo guardado:", datosReclutador);
      return {
        success: true,
        id: "demo-reclutador-" + Date.now(),
        demo: true,
      };
    }

    try {
      const docRef = await addDoc(collection(db, "reclutadores_interesados"), {
        ...datosReclutador,
        fechaCreacion: serverTimestamp(),
        estadoCV: "pendiente",
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al guardar reclutador:", error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar estado del CV del reclutador
  async actualizarEstadoCV(reclutadorId, datosCV) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular actualización exitosa
      console.log("📄 Estado CV demo actualizado:", { reclutadorId, datosCV });
      return {
        success: true,
        demo: true,
      };
    }

    try {
      const docRef = doc(db, "reclutadores_interesados", reclutadorId);
      await updateDoc(docRef, {
        ...datosCV,
        estadoCV: "generado",
        fechaGeneracion: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar estado CV:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para perfil del candidato
export const perfilService = {
  // Obtener perfil completo del candidato
  async obtenerPerfilCandidato() {
    if (!checkFirebaseAvailable()) {
      // Modo demo - devolver datos completos de Michael
      return {
        success: true,
        data: this.obtenerDatosDemo(),
        demo: true,
      };
    }

    try {
      // Intentar obtener desde Firestore
      const perfilDoc = await getDocs(
        query(collection(db, "perfil_candidato"), where("activo", "==", true))
      );

      if (!perfilDoc.empty) {
        const datos = perfilDoc.docs[0].data();
        return { success: true, data: datos };
      } else {
        // Si no hay datos en Firestore, usar datos demo
        return {
          success: true,
          data: this.obtenerDatosDemo(),
          demo: true,
        };
      }
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      // Fallback a datos demo
      return {
        success: true,
        data: this.obtenerDatosDemo(),
        demo: true,
      };
    }
  },

  // Datos completos de Michael para modo demo
  obtenerDatosDemo() {
    return {
      // Información personal
      nombre_completo: "Michael Esteban Sáez Contreras",
      cargo_principal: "Desarrollador Full Stack",
      ubicacion: "Temuco, IX Región, Chile",
      email: "contacto@maikostudios.com",
      telefono: "+56983833148",
      linkedin: "https://www.linkedin.com/in/me-saezc/",
      github: "https://github.com/maikostudios",
      web: "https://maikostudios.com/",

      // Perfil profesional
      perfil_profesional:
        "Desarrollador Full Stack con experiencia comprobada en tecnologías modernas como Vue, React, Node.js, Java y Python. Certificado como facilitador e-learning y comprometido con la formación de nuevos talentos. Apasionado por la innovación, automatización y optimización de procesos usando software y herramientas digitales. Dispuesto a liderar o integrarse en equipos con metodologías ágiles (Scrum/Kanban).",

      // Experiencia profesional
      experiencia_profesional: [
        {
          cargo: "Fundador y Desarrollador Principal",
          empresa: "Maiko Studios",
          periodo: "2024 - Presente",
          descripcion:
            "Creación y desarrollo de plataformas digitales innovadoras como DeUna Transferencias. Implementación de automatizaciones con IA para optimizar procesos empresariales. Digitalización integral para PYMEs y asesorías tecnológicas especializadas.",
        },
        {
          cargo: "Facilitador Front End",
          empresa: "Desafío Latam",
          periodo: "Ago 2024 - Dic 2024",
          descripcion:
            "Impartí cursos en tecnologías Front End como HTML, CSS, JavaScript, y Vue en el marco del programa Talento Digital para Chile. Certificado como facilitador por la institución, enfocado en la formación de nuevos desarrolladores.",
        },
        {
          cargo: "Facilitador Bootcamp",
          empresa: "INFOCAL",
          periodo: "Ene 2024 - Sep 2024",
          descripcion:
            "Docente en cursos de desarrollo Front End usando HTML, CSS, JavaScript, Bootstrap y Vue.js, adaptando contenidos a estudiantes en formación técnica y profesional.",
        },
        {
          cargo: "Full Stack Developer",
          empresa: "Tata Consultancy Services",
          periodo: "Jul 2021 - Dic 2023",
          descripcion:
            "Desarrollador líder en proyectos para Metlife Chile, resolviendo el 100% de tickets reportados. Trabajo Full Stack con tecnologías JavaScript, Node.js, Express, y bases de datos SQL.",
        },
        {
          cargo: "Soporte TI",
          empresa: "NTTDATA Centers",
          periodo: "Nov 2020 - Dic 2021",
          descripcion:
            "Gestión de incidencias, soporte técnico especializado, geolocalización de datos y configuración de infraestructura tecnológica para clientes corporativos.",
        },
      ],

      // Educación
      educacion: [
        {
          titulo: "Ingeniería en Informática Mención Ciberseguridad",
          institucion: "Instituto Profesional Providencia",
          periodo: "2021 - Actualmente",
          descripcion:
            "Especialización en desarrollo de software seguro y arquitecturas de ciberseguridad.",
        },
      ],

      // Habilidades técnicas
      habilidades_tecnicas: {
        lenguajes: [
          "JavaScript",
          "Python",
          "Java",
          "TypeScript",
          "HTML5",
          "CSS3",
        ],
        frameworks: [
          "Vue.js",
          "React",
          "Angular",
          "Node.js",
          "Express.js",
          "Spring Boot",
          "Django",
          "Flask",
        ],
        bases_datos: [
          "PostgreSQL",
          "MongoDB",
          "MySQL",
          "Redis",
          "Firebase Firestore",
        ],
        herramientas: [
          "Git",
          "Docker",
          "AWS",
          "Firebase",
          "Jira",
          "Figma",
          "Adobe XD",
        ],
        metodologias: [
          "Scrum",
          "Kanban",
          "Agile",
          "DevOps",
          "CI/CD",
          "MVC",
          "MVVM",
          "Microservicios",
        ],
      },

      // Certificaciones
      certificaciones: [
        "Vue.js Certified Developer",
        "Firebase Certified Developer",
        "JavaScript Full Stack Development",
        "Android Mobile Development",
        "Facilitador eLearning Certificado",
        "Scrum Master Fundamentals",
        "AWS Cloud Practitioner",
      ],

      // Idiomas
      idiomas: [
        { idioma: "Español", nivel: "Nativo" },
        { idioma: "Inglés", nivel: "Intermedio" },
        { idioma: "Portugués", nivel: "Básico" },
        { idioma: "Japonés", nivel: "Básico" },
      ],

      // Información adicional
      info_adicional: {
        licencia: "Clase B",
        situacion_militar: "al día",
        disponibilidad: "Inmediata",
      },

      // Áreas de interés
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

  // Actualizar perfil del candidato
  async actualizarPerfil(datosPerfil) {
    if (!checkFirebaseAvailable()) {
      console.log("📝 Perfil demo actualizado:", datosPerfil);
      return { success: true, demo: true };
    }

    try {
      const docRef = await addDoc(collection(db, "perfil_candidato"), {
        ...datosPerfil,
        activo: true,
        fechaActualizacion: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para plantillas de CV
export const plantillasService = {
  // Obtener plantilla activa del CV
  async obtenerPlantillaCV() {
    if (!checkFirebaseAvailable()) {
      // Modo demo - devolver plantilla por defecto
      return {
        success: true,
        data: this.obtenerPlantillaDemo(),
        demo: true,
      };
    }

    try {
      const q = query(
        collection(db, "plantillas"),
        where("activa", "==", true),
        where("tipo", "==", "cv_profesional")
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const plantilla = snapshot.docs[0].data();
        return { success: true, data: plantilla };
      } else {
        // Fallback a plantilla demo
        return {
          success: true,
          data: this.obtenerPlantillaDemo(),
          demo: true,
        };
      }
    } catch (error) {
      console.error("Error al obtener plantilla:", error);
      return {
        success: true,
        data: this.obtenerPlantillaDemo(),
        demo: true,
      };
    }
  },

  // Plantilla demo por defecto
  obtenerPlantillaDemo() {
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
        "nombre_completo",
        "cargo_principal",
        "email",
        "telefono",
        "linkedin",
        "web",
        "ubicacion",
        "perfil_profesional",
        "experiencia_profesional",
        "educacion",
        "certificaciones",
        "habilidades_tecnicas",
        "habilidades_blandas",
        "idiomas",
        "info_adicional",
      ],
    };
  },

  // Guardar nueva plantilla
  async guardarPlantilla(plantillaData) {
    if (!checkFirebaseAvailable()) {
      console.log("📄 Plantilla demo guardada:", plantillaData.nombre);
      return { success: true, demo: true };
    }

    try {
      const docRef = await addDoc(collection(db, "plantillas"), {
        ...plantillaData,
        fecha_creacion: serverTimestamp(),
        activa: true,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error al guardar plantilla:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para estadísticas
export const statsService = {
  // Registrar visita a la página
  async registrarVisita(pagina) {
    if (!checkFirebaseAvailable()) {
      // Modo demo - simular registro exitoso
      console.log("📊 Visita demo registrada:", pagina);
      return { success: true, demo: true };
    }

    try {
      await addDoc(collection(db, "visitas"), {
        pagina,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || "directo",
      });
      return { success: true };
    } catch (error) {
      console.error("Error al registrar visita:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas básicas (para admin)
  async obtenerEstadisticas() {
    if (!checkFirebaseAvailable()) {
      // Modo demo - devolver estadísticas de ejemplo
      return {
        success: true,
        data: {
          totalVisitas: 1250,
          totalMensajes: demoData.mensajes.length,
          totalSolicitudesCV: demoData.solicitudesCV.length,
        },
        demo: true,
      };
    }

    try {
      const visitasSnapshot = await getDocs(collection(db, "visitas"));
      const mensajesSnapshot = await getDocs(
        collection(db, "mensajes_contacto")
      );
      const cvSnapshot = await getDocs(collection(db, "solicitudes_cv"));

      return {
        success: true,
        data: {
          totalVisitas: visitasSnapshot.size,
          totalMensajes: mensajesSnapshot.size,
          totalSolicitudesCV: cvSnapshot.size,
        },
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return { success: false, error: error.message };
    }
  },
};
