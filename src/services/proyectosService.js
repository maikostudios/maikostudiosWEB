import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Servicio para gestionar proyectos del portafolio en Firebase
 * Colección: 'proyectos'
 */
export class ProyectosService {
  constructor() {
    this.collectionName = "proyectos";
    this.collection = collection(db, this.collectionName);
  }

  /**
   * Obtener todos los proyectos ordenados por fecha de creación
   */
  async obtenerProyectos() {
    try {
      console.log("🔍 Obteniendo proyectos desde Firebase...");

      const q = query(this.collection, orderBy("fechaCreacion", "desc"));
      const querySnapshot = await getDocs(q);

      const proyectos = [];
      querySnapshot.forEach((doc) => {
        proyectos.push({
          id: doc.id,
          ...doc.data(),
          // Convertir timestamp a Date si existe
          fechaCreacion: doc.data().fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: doc.data().fechaActualizacion?.toDate() || null,
        });
      });

      console.log(`✅ ${proyectos.length} proyectos obtenidos desde Firebase`);
      return {
        success: true,
        data: proyectos,
        message: `${proyectos.length} proyectos cargados exitosamente`,
      };
    } catch (error) {
      console.error("❌ Error al obtener proyectos:", error);
      return {
        success: false,
        data: [],
        error: error.message,
        message: "Error al cargar proyectos desde Firebase",
      };
    }
  }

  /**
   * Crear un nuevo proyecto
   */
  async crearProyecto(datosProyecto) {
    try {
      console.log(
        "📝 Creando nuevo proyecto en Firebase...",
        datosProyecto.titulo
      );

      // Validar datos requeridos
      const erroresValidacion = this.validarDatosProyecto(datosProyecto);
      if (erroresValidacion.length > 0) {
        throw new Error(`Datos inválidos: ${erroresValidacion.join(", ")}`);
      }

      // Preparar datos para Firebase
      const proyectoData = {
        titulo: datosProyecto.titulo.trim(),
        descripcion: datosProyecto.descripcion.trim(),
        imagen: datosProyecto.imagen,
        tecnologias: datosProyecto.tecnologias || [],
        enlaceDemo: datosProyecto.enlaceDemo?.trim() || "",
        enlaceGithub: datosProyecto.enlaceGithub?.trim() || "",
        esEstrella: Boolean(datosProyecto.esEstrella),
        caracteristicas: datosProyecto.caracteristicas || [],
        activo: true,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp(),
      };

      // Verificar que no haya más de un proyecto estrella si este es estrella
      if (proyectoData.esEstrella) {
        await this.verificarProyectoEstrella();
      }

      const docRef = await addDoc(this.collection, proyectoData);

      console.log("✅ Proyecto creado exitosamente con ID:", docRef.id);
      return {
        success: true,
        data: { id: docRef.id, ...proyectoData },
        message: "Proyecto creado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al crear el proyecto",
      };
    }
  }

  /**
   * Actualizar un proyecto existente
   */
  async actualizarProyecto(proyectoId, datosProyecto) {
    try {
      console.log("📝 Actualizando proyecto en Firebase...", proyectoId);

      // Validar datos requeridos
      const erroresValidacion = this.validarDatosProyecto(datosProyecto);
      if (erroresValidacion.length > 0) {
        throw new Error(`Datos inválidos: ${erroresValidacion.join(", ")}`);
      }

      // Preparar datos para actualización
      const proyectoData = {
        titulo: datosProyecto.titulo.trim(),
        descripcion: datosProyecto.descripcion.trim(),
        imagen: datosProyecto.imagen,
        tecnologias: datosProyecto.tecnologias || [],
        enlaceDemo: datosProyecto.enlaceDemo?.trim() || "",
        enlaceGithub: datosProyecto.enlaceGithub?.trim() || "",
        esEstrella: Boolean(datosProyecto.esEstrella),
        caracteristicas: datosProyecto.caracteristicas || [],
        fechaActualizacion: serverTimestamp(),
      };

      // Verificar proyecto estrella si es necesario
      if (proyectoData.esEstrella) {
        await this.verificarProyectoEstrella(proyectoId);
      }

      const docRef = doc(db, this.collectionName, proyectoId);
      await updateDoc(docRef, proyectoData);

      console.log("✅ Proyecto actualizado exitosamente:", proyectoId);
      return {
        success: true,
        data: { id: proyectoId, ...proyectoData },
        message: "Proyecto actualizado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al actualizar proyecto:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al actualizar el proyecto",
      };
    }
  }

  /**
   * Eliminar un proyecto
   */
  async eliminarProyecto(proyectoId) {
    try {
      console.log("🗑️ Eliminando proyecto de Firebase...", proyectoId);

      const docRef = doc(db, this.collectionName, proyectoId);
      await deleteDoc(docRef);

      console.log("✅ Proyecto eliminado exitosamente:", proyectoId);
      return {
        success: true,
        message: "Proyecto eliminado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
      return {
        success: false,
        error: error.message,
        message: "Error al eliminar el proyecto",
      };
    }
  }

  /**
   * Obtener solo proyectos activos para mostrar en el portafolio público
   */
  async obtenerProyectosActivos() {
    try {
      const resultado = await this.obtenerProyectos();
      if (resultado.success) {
        const proyectosActivos = resultado.data.filter(
          (proyecto) => proyecto.activo !== false
        );
        return {
          ...resultado,
          data: proyectosActivos,
        };
      }
      return resultado;
    } catch (error) {
      console.error("❌ Error al obtener proyectos activos:", error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  }

  /**
   * Obtener el proyecto estrella (primer proyecto marcado como estrella)
   */
  async obtenerProyectoEstrella() {
    try {
      const resultado = await this.obtenerProyectosActivos();
      if (resultado.success) {
        const proyectoEstrella = resultado.data.find(
          (proyecto) => proyecto.esEstrella
        );
        return {
          success: true,
          data: proyectoEstrella || null,
        };
      }
      return resultado;
    } catch (error) {
      console.error("❌ Error al obtener proyecto estrella:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  }

  /**
   * Obtener TODOS los proyectos estrella para mostrar en "Proyectos Destacados"
   */
  async obtenerProyectosEstrella() {
    try {
      console.log("⭐ Obteniendo proyectos estrella desde Firebase...");

      const resultado = await this.obtenerProyectosActivos();
      if (resultado.success) {
        const proyectosEstrella = resultado.data.filter(
          (proyecto) => proyecto.esEstrella
        );
        console.log(
          `✅ ${proyectosEstrella.length} proyectos estrella encontrados`
        );

        return {
          success: true,
          data: proyectosEstrella,
          message: `${proyectosEstrella.length} proyectos destacados cargados`,
        };
      }
      return resultado;
    } catch (error) {
      console.error("❌ Error al obtener proyectos estrella:", error);
      return {
        success: false,
        data: [],
        error: error.message,
        message: "Error al cargar proyectos destacados",
      };
    }
  }

  /**
   * Validar datos del proyecto
   */
  validarDatosProyecto(datos) {
    const errores = [];

    if (!datos.titulo || datos.titulo.trim().length < 3) {
      errores.push("El título debe tener al menos 3 caracteres");
    }

    if (!datos.descripcion || datos.descripcion.trim().length < 10) {
      errores.push("La descripción debe tener al menos 10 caracteres");
    }

    if (!datos.imagen || !datos.imagen.trim()) {
      errores.push("Debe seleccionar una imagen");
    }

    if (!datos.tecnologias || datos.tecnologias.length === 0) {
      errores.push("Debe seleccionar al menos una tecnología");
    }

    return errores;
  }

  /**
   * Verificar que no haya más de un proyecto estrella
   */
  async verificarProyectoEstrella(proyectoIdExcluir = null) {
    try {
      const resultado = await this.obtenerProyectos();
      if (resultado.success) {
        const proyectosEstrella = resultado.data.filter(
          (proyecto) => proyecto.esEstrella && proyecto.id !== proyectoIdExcluir
        );

        // Si hay otros proyectos estrella, quitarles el estado
        for (const proyecto of proyectosEstrella) {
          const docRef = doc(db, this.collectionName, proyecto.id);
          await updateDoc(docRef, {
            esEstrella: false,
            fechaActualizacion: serverTimestamp(),
          });
          console.log(
            `⭐ Removido estado estrella del proyecto: ${proyecto.titulo}`
          );
        }
      }
    } catch (error) {
      console.error("❌ Error al verificar proyecto estrella:", error);
    }
  }
}

// Instancia singleton del servicio
export const proyectosService = new ProyectosService();
