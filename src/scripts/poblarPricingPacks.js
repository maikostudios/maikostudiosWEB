import { pricingService } from '@/services/pricingService'

// Datos de ejemplo para los packs de precios
const samplePacks = [
  {
    name: "Básico",
    subtitle: "Perfecto para empezar",
    price: {
      monthly: 299000,
      annual: 2990000,
      currency: "CLP"
    },
    badge: {
      text: "Más Popular",
      color: "success",
      show: true
    },
    features: [
      "Sitio web responsive",
      "Hasta 5 páginas",
      "Diseño personalizado",
      "Optimización SEO básica",
      "Formulario de contacto",
      "Hosting por 1 año",
      "Soporte técnico 3 meses"
    ],
    cta: {
      text: "Comenzar Ahora",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "success",
      highlighted: true,
      gradient: false
    },
    active: true,
    order: 1,
    category: "web"
  },
  {
    name: "Profesional",
    subtitle: "Para negocios en crecimiento",
    price: {
      monthly: 599000,
      annual: 5990000,
      currency: "CLP"
    },
    badge: {
      text: "Recomendado",
      color: "primary",
      show: true
    },
    features: [
      "Todo lo del plan Básico",
      "Hasta 15 páginas",
      "E-commerce básico",
      "Panel de administración",
      "Integración con redes sociales",
      "Analytics avanzado",
      "Optimización de velocidad",
      "Soporte técnico 6 meses",
      "2 revisiones incluidas"
    ],
    cta: {
      text: "Elegir Plan",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "primary",
      highlighted: false,
      gradient: true
    },
    active: true,
    order: 2,
    category: "web"
  },
  {
    name: "Empresarial",
    subtitle: "Solución completa para empresas",
    price: {
      monthly: 999000,
      annual: 9990000,
      currency: "CLP"
    },
    badge: {
      text: "Premium",
      color: "warning",
      show: true
    },
    features: [
      "Todo lo del plan Profesional",
      "Páginas ilimitadas",
      "E-commerce avanzado",
      "Sistema de gestión completo",
      "Integración con APIs",
      "Chatbot personalizado",
      "Optimización avanzada",
      "Soporte técnico 12 meses",
      "Revisiones ilimitadas",
      "Mantenimiento incluido"
    ],
    cta: {
      text: "Contactar Ventas",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "warning",
      highlighted: false,
      gradient: false
    },
    active: true,
    order: 3,
    category: "web"
  },
  {
    name: "Aplicación Móvil",
    subtitle: "Apps nativas para iOS y Android",
    price: {
      monthly: 1500000,
      annual: 15000000,
      currency: "CLP"
    },
    badge: {
      text: "Nuevo",
      color: "secondary",
      show: true
    },
    features: [
      "App nativa iOS y Android",
      "Diseño UI/UX personalizado",
      "Backend completo",
      "Panel de administración",
      "Notificaciones push",
      "Integración con APIs",
      "Publicación en stores",
      "Soporte técnico 12 meses",
      "3 actualizaciones incluidas"
    ],
    cta: {
      text: "Consultar Proyecto",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "secondary",
      highlighted: false,
      gradient: true
    },
    active: true,
    order: 4,
    category: "mobile"
  }
]

// Función para poblar la base de datos
export const poblarPricingPacks = async () => {
  try {
    console.log('🚀 Iniciando población de packs de precios...')
    
    for (const pack of samplePacks) {
      await pricingService.createPack(pack)
      console.log(`✅ Pack "${pack.name}" creado exitosamente`)
    }
    
    console.log('🎉 Todos los packs de precios han sido creados exitosamente!')
    return { success: true, message: 'Packs creados exitosamente' }
  } catch (error) {
    console.error('❌ Error poblando packs de precios:', error)
    return { success: false, error: error.message }
  }
}

// Función para limpiar todos los packs (útil para testing)
export const limpiarPricingPacks = async () => {
  try {
    console.log('🧹 Limpiando packs de precios existentes...')
    const packs = await pricingService.getAllPacksAdmin()
    
    for (const pack of packs) {
      await pricingService.deletePack(pack.id)
      console.log(`🗑️ Pack "${pack.name}" eliminado`)
    }
    
    console.log('✨ Todos los packs han sido eliminados')
    return { success: true, message: 'Packs eliminados exitosamente' }
  } catch (error) {
    console.error('❌ Error limpiando packs:', error)
    return { success: false, error: error.message }
  }
}

// Exponer funciones globalmente en desarrollo
if (import.meta.env.DEV) {
  window.poblarPricingPacks = poblarPricingPacks
  window.limpiarPricingPacks = limpiarPricingPacks
  console.log('🔧 Funciones de pricing expuestas:')
  console.log('   - window.poblarPricingPacks()')
  console.log('   - window.limpiarPricingPacks()')
}
