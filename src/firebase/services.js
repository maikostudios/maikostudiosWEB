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
