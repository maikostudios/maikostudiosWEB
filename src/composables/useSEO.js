import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Configuración SEO por defecto
const DEFAULT_SEO = {
  title: 'MaikoStudios - Desarrollo Web y Aplicaciones Móviles',
  description: 'Desarrollo web profesional, aplicaciones móviles, consultoría tecnológica y automatización con IA. Especialistas en Vue.js, React, Node.js y más.',
  keywords: 'desarrollo web, aplicaciones móviles, Vue.js, React, Node.js, consultoría tecnológica, automatización IA, MaikoStudios',
  author: 'Michael Sáez - MaikoStudios',
  image: '/logo/logo_maikostudio.png',
  url: 'https://maikostudios.com',
  type: 'website',
  locale: 'es_ES',
  siteName: 'MaikoStudios'
}

// Configuración SEO por página
const PAGE_SEO = {
  '/': {
    title: 'MaikoStudios - Desarrollo Web y Aplicaciones Móviles',
    description: 'Aprende, crea y digitaliza tu mundo con MaikoStudios. Desarrollo web profesional, aplicaciones móviles y consultoría tecnológica.',
    keywords: 'desarrollo web, aplicaciones móviles, MaikoStudios, programación, tecnología'
  },
  '/sobre-mi': {
    title: 'Sobre Mí - Michael Sáez | MaikoStudios',
    description: 'Conoce a Michael Sáez, desarrollador Full Stack especializado en Vue.js, React, Node.js y tecnologías modernas. Facilitador y mentor tecnológico.',
    keywords: 'Michael Sáez, desarrollador full stack, Vue.js, React, Node.js, mentor tecnológico'
  },
  '/servicios': {
    title: 'Servicios de Desarrollo Web y Mobile | MaikoStudios',
    description: 'Servicios profesionales de desarrollo web, aplicaciones móviles, automatización de procesos y consultoría tecnológica.',
    keywords: 'servicios desarrollo web, aplicaciones móviles, automatización, consultoría tecnológica'
  },
  '/portafolio': {
    title: 'Portafolio de Proyectos | MaikoStudios',
    description: 'Explora nuestro portafolio de proyectos de desarrollo web, aplicaciones móviles y soluciones tecnológicas innovadoras.',
    keywords: 'portafolio, proyectos web, aplicaciones móviles, desarrollo software'
  },
  '/cv': {
    title: 'CV de Michael Sáez - Desarrollador Full Stack | MaikoStudios',
    description: 'Descarga el CV de Michael Sáez o genera uno personalizado con IA. Experiencia en Vue.js, React, Node.js, Python y más.',
    keywords: 'CV Michael Sáez, currículum desarrollador, Vue.js, React, Node.js, Python'
  },
  '/contacto': {
    title: 'Contacto - Solicita tu Cotización | MaikoStudios',
    description: 'Contacta con MaikoStudios para tu proyecto de desarrollo web o aplicación móvil. Cotizaciones personalizadas y asesoría gratuita.',
    keywords: 'contacto MaikoStudios, cotización desarrollo web, consultoría tecnológica'
  }
}

export function useSEO() {
  const route = useRoute()
  
  // Estado reactivo para SEO
  const seoData = ref({ ...DEFAULT_SEO })
  
  // Función para actualizar meta tags
  const updateMetaTags = (data) => {
    // Actualizar título
    document.title = data.title
    
    // Función helper para actualizar o crear meta tag
    const updateMetaTag = (name, content, property = false) => {
      if (!content) return
      
      const attribute = property ? 'property' : 'name'
      const selector = `meta[${attribute}="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }
    
    // Meta tags básicos
    updateMetaTag('description', data.description)
    updateMetaTag('keywords', data.keywords)
    updateMetaTag('author', data.author)
    updateMetaTag('robots', 'index, follow')
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    
    // Open Graph tags
    updateMetaTag('og:title', data.title, true)
    updateMetaTag('og:description', data.description, true)
    updateMetaTag('og:image', data.image, true)
    updateMetaTag('og:url', data.url, true)
    updateMetaTag('og:type', data.type, true)
    updateMetaTag('og:locale', data.locale, true)
    updateMetaTag('og:site_name', data.siteName, true)
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', data.title)
    updateMetaTag('twitter:description', data.description)
    updateMetaTag('twitter:image', data.image)
    updateMetaTag('twitter:creator', '@maikostudios')
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', data.url)
    
    // JSON-LD structured data
    updateStructuredData(data)
  }
  
  // Función para actualizar datos estructurados
  const updateStructuredData = (data) => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MaikoStudios",
      "description": data.description,
      "url": data.url,
      "logo": data.image,
      "founder": {
        "@type": "Person",
        "name": "Michael Sáez",
        "jobTitle": "Desarrollador Full Stack",
        "url": data.url + "/sobre-mi"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+56-9-8383-3148",
        "contactType": "customer service",
        "email": "contacto@maikostudios.com"
      },
      "sameAs": [
        "https://github.com/maikostudios",
        "https://linkedin.com/in/me-saezc"
      ]
    }
    
    // Remover script anterior si existe
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    // Crear nuevo script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }
  
  // Función para establecer SEO de página
  const setSEO = (customSEO = {}) => {
    const pageSEO = PAGE_SEO[route.path] || {}
    const finalSEO = {
      ...DEFAULT_SEO,
      ...pageSEO,
      ...customSEO
    }
    
    // Construir URL completa
    finalSEO.url = DEFAULT_SEO.url + route.path
    
    seoData.value = finalSEO
    updateMetaTags(finalSEO)
  }
  
  // Función para establecer SEO dinámico (ej: para artículos)
  const setDynamicSEO = (title, description, image = null, keywords = null) => {
    const dynamicSEO = {
      title: `${title} | MaikoStudios`,
      description,
      image: image || DEFAULT_SEO.image,
      keywords: keywords || DEFAULT_SEO.keywords
    }
    
    setSEO(dynamicSEO)
  }
  
  // Función para generar breadcrumbs
  const generateBreadcrumbs = () => {
    const pathSegments = route.path.split('/').filter(segment => segment)
    const breadcrumbs = [
      { name: 'Inicio', path: '/' }
    ]
    
    let currentPath = ''
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`
      const pageName = getPageName(currentPath)
      breadcrumbs.push({
        name: pageName,
        path: currentPath
      })
    })
    
    return breadcrumbs
  }
  
  // Helper para obtener nombre de página
  const getPageName = (path) => {
    const pageNames = {
      '/sobre-mi': 'Sobre Mí',
      '/servicios': 'Servicios',
      '/portafolio': 'Portafolio',
      '/cv': 'CV',
      '/contacto': 'Contacto'
    }
    return pageNames[path] || 'Página'
  }
  
  // Watcher para cambios de ruta
  watch(() => route.path, () => {
    setSEO()
  }, { immediate: true })
  
  // Inicializar en mounted
  onMounted(() => {
    setSEO()
  })
  
  return {
    seoData,
    setSEO,
    setDynamicSEO,
    generateBreadcrumbs,
    updateMetaTags
  }
}

// Instancia global
export const globalSEO = useSEO()
