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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "./config";

// Función helper para verificar si Firebase está disponible
const checkFirebaseAvailable = () => {
  if (!db || !isFirebaseConfigured()) {
    console.warn("Firebase no está configurado. Usando modo demo.");
    return false;
  }
  return true;
};

// CRUD para colección 'pricing' (packs y planes)
export const pricingService = {
  async fetchAll() {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: fetchAll pricing");
      return { success: true, data: [] };
    }
    try {
      const snap = await getDocs(
        query(collection(db, "pricing"), orderBy("order", "asc"))
      );
      const items = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: items };
    } catch (error) {
      console.error("Error fetching pricing:", error);
      return { success: false, error: error.message };
    }
  },

  async create(item) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: create pricing");
      return { success: true, id: "demo-" + Date.now() };
    }
    try {
      const docRef = await addDoc(collection(db, "pricing"), {
        ...item,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating pricing:", error);
      return { success: false, error: error.message };
    }
  },

  async update(id, item) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: update pricing");
      return { success: true };
    }
    try {
      const docRef = doc(db, "pricing", id);
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating pricing:", error);
      return { success: false, error: error.message };
    }
  },

  async delete(id) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: delete pricing");
      return { success: true };
    }
    try {
      const docRef = doc(db, "pricing", id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error("Error deleting pricing:", error);
      return { success: false, error: error.message };
    }
  },

  async uploadImage(file, path) {
    if (!isFirebaseConfigured() || !storage) {
      console.warn("Firebase Storage no configurado");
      return { success: false, error: "Storage no configurado" };
    }
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { success: true, url };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, error: error.message };
    }
  },
};

// Otros servicios existentes (contactService, cvService, statsService) se mantienen igual

// Servicio para contacto
export const contactService = {
  async enviarMensaje(datos) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: enviarMensaje contacto");
      return { success: true };
    }
    try {
      // Aquí iría la lógica para enviar mensaje a Firestore
      const docRef = await addDoc(collection(db, "contactMessages"), {
        ...datos,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error enviando mensaje de contacto:", error);
      return { success: false, error: error.message };
    }
  },

  async obtenerMensajes() {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: obtenerMensajes contacto");
      return { success: true, data: [] };
    }
    try {
      const snap = await getDocs(
        query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))
      );
      const items = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: items };
    } catch (error) {
      console.error("Error obteniendo mensajes de contacto:", error);
      return { success: false, error: error.message };
    }
  },

  async marcarComoLeido(mensajeId) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: marcarComoLeido contacto");
      return { success: true };
    }
    try {
      const docRef = doc(db, "contactMessages", mensajeId);
      await updateDoc(docRef, { leido: true, fechaLectura: new Date() });
      return { success: true };
    } catch (error) {
      console.error("Error marcando mensaje como leído:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para CV
export const cvService = {
  async guardarSolicitudCV(datos) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: guardarSolicitudCV");
      return { success: true };
    }
    try {
      const docRef = await addDoc(collection(db, "cvRequests"), {
        ...datos,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error guardando solicitud de CV:", error);
      return { success: false, error: error.message };
    }
  },

  async obtenerSolicitudesCV() {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: obtenerSolicitudesCV");
      return { success: true, data: [] };
    }
    try {
      const snap = await getDocs(
        query(collection(db, "cvRequests"), orderBy("createdAt", "desc"))
      );
      const items = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: items };
    } catch (error) {
      console.error("Error obteniendo solicitudes de CV:", error);
      return { success: false, error: error.message };
    }
  },
};

// Servicio para estadísticas
export const statsService = {
  async registrarVisita(pagina) {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: registrarVisita");
      return { success: true };
    }
    try {
      const docRef = await addDoc(collection(db, "statsVisits"), {
        pagina,
        timestamp: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error registrando visita:", error);
      return { success: false, error: error.message };
    }
  },

  async obtenerEstadisticas() {
    if (!checkFirebaseAvailable()) {
      console.warn("Modo demo: obtenerEstadisticas");
      return {
        success: true,
        data: {
          totalVisitas: 0,
          totalMensajes: 0,
          totalSolicitudesCV: 0,
        },
      };
    }
    try {
      // Aquí iría la lógica para obtener estadísticas agregadas
      // Por simplicidad, retornamos datos demo
      return {
        success: true,
        data: {
          totalVisitas: 100,
          totalMensajes: 50,
          totalSolicitudesCV: 20,
        },
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      return { success: false, error: error.message };
    }
  },
};
