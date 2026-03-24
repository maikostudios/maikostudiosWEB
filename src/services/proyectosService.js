import apiClient from '@/api/apiClient';

/**
 * Servicio para gestionar proyectos del portafolio consumiendo el backend Node.js
 */
export class ProyectosService {
  /**
   * Obtener todos los proyectos
   */
  async obtenerProyectos() {
    try {
      const response = await apiClient.get('/projects');
      return {
        success: true,
        data: response.data,
        message: `${response.data.length} proyectos cargados exitosamente`,
      };
    } catch (error) {
      console.error("❌ Error al obtener proyectos:", error);
      return {
        success: false,
        data: [],
        error: error.message,
        message: "Error al cargar proyectos del servidor",
      };
    }
  }

  /**
   * Crear un nuevo proyecto
   */
  async crearProyecto(datosProyecto) {
    try {
      const response = await apiClient.post('/projects', datosProyecto);
      return {
        success: true,
        data: response.data,
        message: "Proyecto creado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al crear proyecto:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: "Error al crear el proyecto",
      };
    }
  }

  /**
   * Actualizar un proyecto existente
   */
  async actualizarProyecto(proyectoId, datosProyecto) {
    try {
      const response = await apiClient.put(`/projects/${proyectoId}`, datosProyecto);
      return {
        success: true,
        data: response.data,
        message: "Proyecto actualizado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al actualizar proyecto:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: "Error al actualizar el proyecto",
      };
    }
  }

  /**
   * Eliminar un proyecto
   */
  async eliminarProyecto(proyectoId) {
    try {
      await apiClient.delete(`/projects/${proyectoId}`);
      return {
        success: true,
        message: "Proyecto eliminado exitosamente",
      };
    } catch (error) {
      console.error("❌ Error al eliminar proyecto:", error);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: "Error al eliminar el proyecto",
      };
    }
  }

  /**
   * Obtener solo proyectos activos para el portafolio público
   */
  async obtenerProyectosActivos() {
    try {
      const response = await apiClient.get('/projects?active=true');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Error al obtener proyectos activos:", error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Obtener el proyecto estrella (ej. primer proyecto marcado como estrella)
   */
  async obtenerProyectoEstrella() {
    try {
      const resultado = await this.obtenerProyectosActivos();
      if (resultado.success) {
        const proyectoEstrella = resultado.data.find(p => p.featured === true || p.esEstrella === true);
        return { success: true, data: proyectoEstrella || null };
      }
      return resultado;
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Obtener TODOS los proyectos estrella para mostrar en "Proyectos Destacados"
   */
  async obtenerProyectosEstrella() {
    try {
      const resultado = await this.obtenerProyectosActivos();
      if (resultado.success) {
        const proyectosEstrella = resultado.data.filter(p => p.featured === true || p.esEstrella === true);
        return { success: true, data: proyectosEstrella };
      }
      return resultado;
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * Obtener proyectos para mostrar en el Home (máximo 2)
   */
  async obtenerProyectosHome() {
    try {
      const resultado = await this.obtenerProyectosActivos();
      if (resultado.success) {
        const proyectosHome = resultado.data.filter(p => p.homeDisplay === true || p.mostrarEnHome === true);
        return { success: true, data: proyectosHome };
      }
      return resultado;
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  }
}

// Instancia singleton del servicio
export const proyectosService = new ProyectosService();
