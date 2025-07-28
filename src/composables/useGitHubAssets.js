import { ref, computed } from 'vue'

/**
 * Composable para gestionar assets desde el repositorio de GitHub
 * Extrae dinámicamente las imágenes de proyectos desde:
 * https://github.com/maikostudios/assets_maikostudio.git
 */
export function useGitHubAssets() {
  // Estado reactivo
  const imagenesProyectos = ref([])
  const cargandoImagenes = ref(false)
  const errorCarga = ref(null)

  // Configuración del repositorio
  const REPO_CONFIG = {
    owner: 'maikostudios',
    repo: 'assets_maikostudio',
    branch: 'main',
    carpetaProyectos: 'assets/img/proyectos'
  }

  // URLs base
  const API_BASE = `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}`
  const RAW_BASE = `https://raw.githubusercontent.com/${REPO_CONFIG.owner}/${REPO_CONFIG.repo}/${REPO_CONFIG.branch}`

  /**
   * Función para limpiar y formatear nombres de archivos
   */
  const formatearNombreArchivo = (filename) => {
    // Remover extensión
    const sinExtension = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    
    // Reemplazar guiones bajos y guiones por espacios
    const conEspacios = sinExtension.replace(/[_-]/g, ' ')
    
    // Capitalizar primera letra de cada palabra
    return conEspacios.replace(/\b\w/g, l => l.toUpperCase())
  }

  /**
   * Función para determinar si un archivo es una imagen válida
   */
  const esImagenValida = (filename) => {
    const extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return extensionesValidas.some(ext => 
      filename.toLowerCase().endsWith(ext)
    )
  }

  /**
   * Cargar imágenes desde la API de GitHub
   */
  const cargarImagenesProyectos = async () => {
    cargandoImagenes.value = true
    errorCarga.value = null

    try {
      console.log('🔍 Cargando imágenes desde GitHub API...')
      
      const response = await fetch(
        `${API_BASE}/contents/${REPO_CONFIG.carpetaProyectos}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'MaikoStudios-Web-App'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const archivos = await response.json()
      console.log('📁 Archivos encontrados:', archivos.length)

      // Filtrar solo imágenes y formatear datos
      const imagenesFormateadas = archivos
        .filter(archivo => archivo.type === 'file' && esImagenValida(archivo.name))
        .map(archivo => ({
          id: archivo.sha, // SHA único como ID
          nombre: formatearNombreArchivo(archivo.name),
          nombreArchivo: archivo.name,
          url: archivo.download_url, // URL directa para descargar
          urlRaw: `${RAW_BASE}/${archivo.path}`, // URL raw alternativa
          tamaño: archivo.size,
          path: archivo.path,
          htmlUrl: archivo.html_url // URL para ver en GitHub
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar alfabéticamente

      imagenesProyectos.value = imagenesFormateadas
      
      console.log('✅ Imágenes cargadas exitosamente:', imagenesFormateadas.length)
      console.log('🖼️ Imágenes disponibles:', imagenesFormateadas.map(img => img.nombre))

    } catch (error) {
      console.error('❌ Error al cargar imágenes desde GitHub:', error)
      errorCarga.value = error.message
      
      // Fallback a imágenes predefinidas en caso de error
      imagenesProyectos.value = [
        {
          id: 'fallback-1',
          nombre: 'Proyecto Demo 1',
          nombreArchivo: 'demo1.jpg',
          url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
          urlRaw: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
          tamaño: 0,
          path: 'fallback/demo1.jpg',
          htmlUrl: '#'
        },
        {
          id: 'fallback-2',
          nombre: 'Proyecto Demo 2',
          nombreArchivo: 'demo2.jpg',
          url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
          urlRaw: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
          tamaño: 0,
          path: 'fallback/demo2.jpg',
          htmlUrl: '#'
        }
      ]
    } finally {
      cargandoImagenes.value = false
    }
  }

  /**
   * Función para recargar imágenes manualmente
   */
  const recargarImagenes = async () => {
    await cargarImagenesProyectos()
  }

  /**
   * Función para obtener URL de imagen por nombre de archivo
   */
  const obtenerUrlPorNombre = (nombreArchivo) => {
    const imagen = imagenesProyectos.value.find(img => 
      img.nombreArchivo === nombreArchivo
    )
    return imagen?.url || null
  }

  /**
   * Computed para obtener solo los nombres para el selector
   */
  const opcionesSelector = computed(() => 
    imagenesProyectos.value.map(img => ({
      title: img.nombre,
      value: img.url,
      subtitle: img.nombreArchivo,
      imagen: img.url,
      tamaño: img.tamaño
    }))
  )

  /**
   * Computed para estadísticas
   */
  const estadisticas = computed(() => ({
    total: imagenesProyectos.value.length,
    tamañoTotal: imagenesProyectos.value.reduce((sum, img) => sum + img.tamaño, 0),
    tiposArchivos: [...new Set(imagenesProyectos.value.map(img => 
      img.nombreArchivo.split('.').pop().toLowerCase()
    ))]
  }))

  return {
    // Estado
    imagenesProyectos,
    cargandoImagenes,
    errorCarga,
    
    // Computed
    opcionesSelector,
    estadisticas,
    
    // Métodos
    cargarImagenesProyectos,
    recargarImagenes,
    obtenerUrlPorNombre,
    
    // Configuración (solo lectura)
    repoConfig: REPO_CONFIG
  }
}
