// Store principal de la aplicación
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { contactService, cvService, statsService } from "@/firebase/services";
import { proyectosService } from "@/services/proyectosService";
import geminiService from "@/services/geminiService";

export const useMainStore = defineStore("main", () => {
  // Estado
  const loading = ref(false);
  const user = ref(null);
  const mensajes = ref([]);
  const solicitudesCV = ref([]);
  const proyectos = ref([]);
  const estadisticas = ref({
    totalVisitas: 0,
    totalMensajes: 0,
    totalSolicitudesCV: 0,
    totalProyectos: 0,
  });

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const mensajesNoLeidos = computed(
    () => mensajes.value.filter((m) => !m.leido).length
  );

  // Actions para contacto
  const enviarMensajeContacto = async (datos) => {
    loading.value = true;
    try {
      const resultado = await contactService.enviarMensaje(datos);
      if (resultado.success) {
        // Registrar la interacción para estadísticas
        await statsService.registrarVisita("contacto-enviado");
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const cargarMensajes = async () => {
    loading.value = true;
    try {
      const resultado = await contactService.obtenerMensajes();
      if (resultado.success) {
        mensajes.value = resultado.data;
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const marcarMensajeLeido = async (mensajeId) => {
    try {
      const resultado = await contactService.marcarComoLeido(mensajeId);
      if (resultado.success) {
        // Actualizar el estado local
        const mensaje = mensajes.value.find((m) => m.id === mensajeId);
        if (mensaje) {
          mensaje.leido = true;
          mensaje.fechaLectura = new Date();
        }
      }
      return resultado;
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
      return { success: false, error: error.message };
    }
  };

  // Actions para CV
  const enviarSolicitudCV = async (datos) => {
    loading.value = true;
    try {
      const resultado = await cvService.guardarSolicitudCV(datos);
      if (resultado.success) {
        await statsService.registrarVisita("cv-solicitado");
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const cargarSolicitudesCV = async () => {
    loading.value = true;
    try {
      const resultado = await cvService.obtenerSolicitudesCV();
      if (resultado.success) {
        solicitudesCV.value = resultado.data;
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  // Función para guardar información del reclutador
  const guardarReclutador = async (datosReclutador) => {
    try {
      const resultado = await cvService.guardarReclutador(datosReclutador);
      return resultado;
    } catch (error) {
      console.error("Error al guardar reclutador:", error);
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar estado del CV del reclutador
  const actualizarEstadoCVReclutador = async (reclutadorId, datosCV) => {
    try {
      const resultado = await cvService.actualizarEstadoCV(
        reclutadorId,
        datosCV
      );
      return resultado;
    } catch (error) {
      console.error("Error al actualizar estado CV:", error);
      return { success: false, error: error.message };
    }
  };

  // Actions para estadísticas
  const registrarVisita = async (pagina) => {
    try {
      await statsService.registrarVisita(pagina);
    } catch (error) {
      console.error("Error al registrar visita:", error);
    }
  };

  const cargarEstadisticas = async () => {
    loading.value = true;
    try {
      const resultado = await statsService.obtenerEstadisticas();
      if (resultado.success) {
        estadisticas.value = resultado.data;
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  // Actions para proyectos
  const cargarProyectos = async () => {
    loading.value = true;
    try {
      const resultado = await proyectosService.obtenerProyectos();
      if (resultado.success) {
        proyectos.value = resultado.data;
        estadisticas.value.totalProyectos = resultado.data.length;
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const crearProyecto = async (datosProyecto) => {
    loading.value = true;
    try {
      const resultado = await proyectosService.crearProyecto(datosProyecto);
      if (resultado.success) {
        // Recargar proyectos para obtener la lista actualizada
        await cargarProyectos();
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const actualizarProyecto = async (proyectoId, datosProyecto) => {
    loading.value = true;
    try {
      const resultado = await proyectosService.actualizarProyecto(
        proyectoId,
        datosProyecto
      );
      if (resultado.success) {
        // Actualizar el proyecto en el estado local
        const index = proyectos.value.findIndex((p) => p.id === proyectoId);
        if (index > -1) {
          proyectos.value[index] = {
            ...proyectos.value[index],
            ...resultado.data,
          };
        }
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const eliminarProyecto = async (proyectoId) => {
    loading.value = true;
    try {
      const resultado = await proyectosService.eliminarProyecto(proyectoId);
      if (resultado.success) {
        // Remover el proyecto del estado local
        const index = proyectos.value.findIndex((p) => p.id === proyectoId);
        if (index > -1) {
          proyectos.value.splice(index, 1);
          estadisticas.value.totalProyectos = proyectos.value.length;
        }
      }
      return resultado;
    } finally {
      loading.value = false;
    }
  };

  const obtenerProyectosActivos = async () => {
    try {
      const resultado = await proyectosService.obtenerProyectosActivos();
      return resultado;
    } catch (error) {
      console.error("Error al obtener proyectos activos:", error);
      return { success: false, error: error.message };
    }
  };

  const obtenerProyectoEstrella = async () => {
    try {
      const resultado = await proyectosService.obtenerProyectoEstrella();
      return resultado;
    } catch (error) {
      console.error("Error al obtener proyecto estrella:", error);
      return { success: false, error: error.message };
    }
  };

  const obtenerProyectosEstrella = async () => {
    try {
      const resultado = await proyectosService.obtenerProyectosEstrella();
      return resultado;
    } catch (error) {
      console.error("Error al obtener proyectos estrella:", error);
      return { success: false, error: error.message };
    }
  };

  const obtenerProyectosHome = async () => {
    try {
      const resultado = await proyectosService.obtenerProyectosHome();
      return resultado;
    } catch (error) {
      console.error("Error al obtener proyectos para Home:", error);
      return { success: false, error: error.message };
    }
  };

  // Función para generar CV personalizado con Gemini
  const generarCVPersonalizado = async (datosSolicitud) => {
    try {
      console.log("🤖 Generando CV personalizado con Gemini...");
      console.log("📋 Datos recibidos:", datosSolicitud);

      // Crear prompt personalizado basado en los datos de la solicitud
      const userPrompt = `
🎯 PERSONALIZACIÓN ESPECÍFICA PARA ESTA SOLICITUD:

📋 POSICIÓN OBJETIVO: ${datosSolicitud.posicion}
🏢 EMPRESA: ${datosSolicitud.empresa || "No especificada"}
👤 RECLUTADOR: ${datosSolicitud.reclutador || "No especificado"}

🔧 HABILIDADES REQUERIDAS:
${datosSolicitud.habilidades.map((h) => `- ${h}`).join("\n")}

📝 DESCRIPCIÓN DEL CARGO:
${datosSolicitud.descripcionCargo}

💡 INSTRUCCIONES DE PERSONALIZACIÓN:
- Adapta el perfil profesional para destacar experiencia relevante para "${
        datosSolicitud.posicion
      }"
- Prioriza las habilidades técnicas mencionadas: ${datosSolicitud.habilidades.join(
        ", "
      )}
- Optimiza las descripciones de experiencia laboral para incluir palabras clave del cargo
- Enfoca el CV hacia las responsabilidades descritas en la oferta laboral
- Mantén un tono profesional y técnico apropiado para el sector IT
- Asegúrate de que el CV sea ATS-friendly con las palabras clave correctas

🎯 OBJETIVO: Crear un CV altamente personalizado que maximice las posibilidades de pasar filtros ATS y captar la atención del reclutador para la posición de "${
        datosSolicitud.posicion
      }".
      `;

      // Llamar al servicio de Gemini para generar el CV
      const resultado = await geminiService.generarCVPersonalizado(userPrompt);

      if (resultado.success) {
        console.log("✅ CV personalizado generado exitosamente");
        return {
          success: true,
          html: resultado.html,
          message: "CV personalizado generado exitosamente",
        };
      } else {
        console.error("❌ Error en generación de CV:", resultado.error);
        return {
          success: false,
          error: resultado.error || "Error al generar CV personalizado",
          message: "Error al generar CV personalizado",
        };
      }
    } catch (error) {
      console.error("❌ Error inesperado en generación de CV:", error);
      return {
        success: false,
        error: error.message,
        message: "Error inesperado al generar CV personalizado",
      };
    }
  };

  // Función para limpiar el estado (logout)
  const limpiarEstado = () => {
    user.value = null;
    mensajes.value = [];
    solicitudesCV.value = [];
    proyectos.value = [];
    estadisticas.value = {
      totalVisitas: 0,
      totalMensajes: 0,
      totalSolicitudesCV: 0,
      totalProyectos: 0,
    };
  };

  return {
    // Estado
    loading,
    user,
    mensajes,
    solicitudesCV,
    proyectos,
    estadisticas,

    // Getters
    isAuthenticated,
    mensajesNoLeidos,

    // Actions
    enviarMensajeContacto,
    cargarMensajes,
    marcarMensajeLeido,
    enviarSolicitudCV,
    cargarSolicitudesCV,
    guardarReclutador,
    actualizarEstadoCVReclutador,
    registrarVisita,
    cargarEstadisticas,

    // Actions para proyectos
    cargarProyectos,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    obtenerProyectosActivos,
    obtenerProyectoEstrella,
    obtenerProyectosEstrella,
    obtenerProyectosHome,

    // Actions para CV
    generarCVPersonalizado,

    limpiarEstado,
  };
});
