import { ref } from 'vue'
import { useMainStore } from '@/stores/main'
import cvGeneratorService from '@/services/cvGeneratorService'

/**
 * Composable para la generación unificada de CVs
 * Maneja tanto el formulario completo como el modal
 */
export function useCVGenerator() {
  const store = useMainStore()

  // Estado reactivo
  const generando = ref(false)
  const mostrandoPreview = ref(false)
  const cvHTML = ref('')
  const pdfBlob = ref(null)
  const reclutadorId = ref(null)
  const estadoActual = ref('')
  const progreso = ref(0)

  // Estados de generación
  const estadosGeneracion = [
    'Iniciando generación...',
    'Registrando información del reclutador...',
    'Analizando requisitos del puesto...',
    'Conectando con MaikoCV Agent...',
    'Personalizando contenido con IA...',
    'Preparando vista previa...',
    '¡CV generado exitosamente!'
  ]

  /**
   * Función principal para generar CV personalizado
   * @param {Object} formData - Datos del formulario
   * @param {string} tipoFormulario - 'dinamico' o 'modal'
   * @returns {Object} - Resultado de la generación
   */
  const generarCVPersonalizado = async (formData, tipoFormulario = 'dinamico') => {
    generando.value = true
    progreso.value = 0

    try {
      // Paso 1: Normalizar datos según el tipo de formulario
      await actualizarEstado('Iniciando generación...', 5)
      const datosNormalizados = normalizarDatosFormulario(
        formData,
        tipoFormulario
      )

      // Paso 2: Registrar reclutador en Firebase
      await actualizarEstado('Registrando información del reclutador...', 15)
      
      try {
        const resultadoReclutador = await store.guardarReclutador(
          datosNormalizados.reclutador
        )
        reclutadorId.value = resultadoReclutador.id
      } catch (error) {
        console.warn(
          'Firebase no disponible, continuando en modo demo:',
          error
        )
        reclutadorId.value = 'demo-' + Date.now()
      }

      // Paso 3: Analizar requisitos
      await actualizarEstado('Analizando requisitos del puesto...', 30)
      await delay(1000)

      // Paso 4: Conectar con MaikoCV Agent
      await actualizarEstado('Conectando con MaikoCV Agent...', 50)
      const resultadoCV = await cvGeneratorService.generarCVConIA(
        datosNormalizados
      )

      if (!resultadoCV.success) {
        throw new Error('Error al generar CV: ' + resultadoCV.error)
      }

      // Paso 5: Personalizar contenido
      await actualizarEstado('Personalizando contenido con IA...', 70)
      cvHTML.value = resultadoCV.html

      // Paso 6: Preparar vista previa
      await actualizarEstado('Preparando vista previa...', 90)

      // Renderizar en el contenedor de preview
      cvGeneratorService.renderizarCVEnContenedor(cvHTML.value, 'cv-container')
      mostrandoPreview.value = true

      // Paso 7: Actualizar estado en Firebase
      const nombreArchivo = `cv-${datosNormalizados.reclutador.empresa
        .toLowerCase()
        .replace(/\s+/g, '-')}-${Date.now()}.pdf`

      try {
        await store.actualizarEstadoCVReclutador(reclutadorId.value, {
          nombreArchivo,
          tipo: tipoFormulario,
          habilidades: datosNormalizados.habilidades,
        })
      } catch (error) {
        console.warn(
          'No se pudo actualizar estado en Firebase, continuando:',
          error
        )
      }

      await actualizarEstado('¡CV generado exitosamente!', 100)

      return {
        success: true,
        id: reclutadorId.value,
        html: cvHTML.value,
        nombreArchivo,
        fallback: resultadoCV.fallback || false,
      }
    } catch (error) {
      console.error('Error en generación de CV:', error)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      generando.value = false
    }
  }

  /**
   * Normaliza los datos del formulario según su tipo
   * @param {Object} formData - Datos originales del formulario
   * @param {string} tipo - Tipo de formulario
   * @returns {Object} - Datos normalizados
   */
  const normalizarDatosFormulario = (formData, tipo) => {
    if (tipo === 'dinamico') {
      // Formato del GeneradorCVDinamico
      return {
        reclutador: {
          nombre: formData.nombreReclutador,
          empresa: formData.empresa,
          email: formData.email,
          posicion: formData.posicion,
          cargo: formData.posicion,
          contacto: formData.email,
        },
        habilidades: formData.habilidadesSeleccionadas || [],
        descripcionCargo: formData.descripcionCargo || '',
        tipoSolicitud: 'cv_dinamico',
        fechaSolicitud: new Date().toISOString(),
      }
    } else {
      // Formato del FormularioCVPersonalizado (modal)
      return {
        reclutador: {
          nombre: formData.nombreReclutador,
          empresa: formData.empresa,
          email: formData.email,
          posicion: formData.posicion,
          rubro: formData.rubro,
          cargo: formData.posicion,
          contacto: formData.email,
        },
        habilidades: formData.tecnologias || [],
        descripcionCargo: formData.descripcionPuesto || '',
        experienciaRequerida: formData.experienciaRequerida,
        modalidad: formData.modalidad,
        requisitosEspeciales: formData.requisitosEspeciales,
        tipoSolicitud: 'cv_modal',
        fechaSolicitud: new Date().toISOString(),
      }
    }
  }

  /**
   * Actualiza el estado de progreso
   * @param {string} mensaje - Mensaje de estado
   * @param {number} porcentaje - Porcentaje de progreso
   */
  const actualizarEstado = async (mensaje, porcentaje) => {
    estadoActual.value = mensaje
    progreso.value = porcentaje
    await delay(800) // Simular tiempo de procesamiento
  }

  /**
   * Genera y descarga el PDF del CV
   * @param {string} nombreArchivo - Nombre personalizado del archivo
   */
  const descargarCVPDF = async (nombreArchivo = null) => {
    if (!cvHTML.value) {
      console.error('No hay CV generado para descargar')
      return
    }

    try {
      const filename = nombreArchivo || `cv-personalizado-${Date.now()}.pdf`
      pdfBlob.value = await cvGeneratorService.convertirHTMLaPDF(
        cvHTML.value,
        filename
      )
      cvGeneratorService.descargarPDF(pdfBlob.value, filename)

      return {
        success: true,
        filename,
        size: pdfBlob.value.size,
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Limpia el estado del generador
   */
  const limpiarEstado = () => {
    generando.value = false
    mostrandoPreview.value = false
    cvHTML.value = ''
    pdfBlob.value = null
    reclutadorId.value = null
    estadoActual.value = ''
    progreso.value = 0
  }

  /**
   * Oculta la vista previa del CV
   */
  const ocultarPreview = () => {
    mostrandoPreview.value = false
    const container = document.getElementById('cv-container')
    if (container) {
      container.style.display = 'none'
      container.innerHTML = ''
    }
  }

  /**
   * Función helper para delays
   * @param {number} ms - Milisegundos de delay
   */
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  return {
    // Estado
    generando,
    mostrandoPreview,
    cvHTML,
    pdfBlob,
    reclutadorId,
    estadoActual,
    progreso,
    estadosGeneracion,

    // Métodos
    generarCVPersonalizado,
    descargarCVPDF,
    limpiarEstado,
    ocultarPreview,
  }
}
