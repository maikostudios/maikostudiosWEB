/**
 * Script para crear datos de precios desde la consola del navegador
 * Ejecutar desde /admin en la consola del navegador
 */

async function createSamplePricingData() {
  console.log('🚀 Creando datos de muestra para precios desde navegador...')
  
  try {
    // Importar pricingService
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    // Datos de muestra para packs
    const samplePacks = [
      {
        name: 'Pack Básico',
        subtitle: 'Ideal para emprendedores',
        price: {
          monthly: 299000,
          annual: 2990000,
          currency: 'CLP'
        },
        features: [
          'Sitio web responsive',
          'Hasta 5 páginas',
          'Formulario de contacto',
          'Optimización SEO básica',
          'Hosting por 1 año'
        ],
        active: true,
        type: 'pack',
        category: 'web'
      },
      {
        name: 'Pack Profesional',
        subtitle: 'Para empresas en crecimiento',
        price: {
          monthly: 599000,
          annual: 5990000,
          currency: 'CLP'
        },
        features: [
          'Sitio web responsive avanzado',
          'Hasta 10 páginas',
          'Sistema de gestión de contenido',
          'Integración con redes sociales',
          'Optimización SEO avanzada',
          'Hosting por 2 años',
          'Soporte técnico 6 meses'
        ],
        active: true,
        type: 'pack',
        category: 'web'
      },
      {
        name: 'Pack Premium',
        subtitle: 'Solución completa empresarial',
        price: {
          monthly: 999000,
          annual: 9990000,
          currency: 'CLP'
        },
        features: [
          'Sitio web corporativo completo',
          'Páginas ilimitadas',
          'E-commerce integrado',
          'Panel de administración',
          'Integración con APIs',
          'Optimización SEO premium',
          'Hosting por 3 años',
          'Soporte técnico 12 meses',
          'Mantenimiento incluido'
        ],
        active: true,
        type: 'pack',
        category: 'web'
      }
    ]

    // Datos de muestra para planes
    const samplePlans = [
      {
        name: 'Plan Starter',
        subtitle: 'Para proyectos pequeños',
        price: {
          monthly: 49000,
          annual: 490000,
          currency: 'CLP'
        },
        features: [
          'Mantenimiento básico',
          'Actualizaciones de seguridad',
          'Backup semanal',
          'Soporte por email'
        ],
        active: true,
        type: 'plan',
        category: 'maintenance'
      },
      {
        name: 'Plan Business',
        subtitle: 'Para empresas activas',
        price: {
          monthly: 99000,
          annual: 990000,
          currency: 'CLP'
        },
        features: [
          'Mantenimiento completo',
          'Actualizaciones de contenido',
          'Backup diario',
          'Soporte prioritario',
          'Análisis de rendimiento',
          'Optimización continua'
        ],
        active: true,
        type: 'plan',
        category: 'maintenance'
      },
      {
        name: 'Plan Enterprise',
        subtitle: 'Para grandes empresas',
        price: {
          monthly: 199000,
          annual: 1990000,
          currency: 'CLP'
        },
        features: [
          'Mantenimiento premium',
          'Desarrollo de nuevas funcionalidades',
          'Backup en tiempo real',
          'Soporte 24/7',
          'Análisis avanzado',
          'Consultoría estratégica',
          'SLA garantizado'
        ],
        active: true,
        type: 'plan',
        category: 'maintenance'
      }
    ]
    
    // Crear packs
    console.log('📦 Creando packs de muestra...')
    const packResults = []
    for (const pack of samplePacks) {
      try {
        const result = await pricingService.createPack(pack)
        console.log(`✅ Pack "${pack.name}" creado:`, result)
        packResults.push(result)
      } catch (error) {
        console.error(`❌ Error creando pack "${pack.name}":`, error)
      }
    }
    
    // Crear planes
    console.log('📋 Creando planes de muestra...')
    const planResults = []
    for (const plan of samplePlans) {
      try {
        const result = await pricingService.createPlan(plan)
        console.log(`✅ Plan "${plan.name}" creado:`, result)
        planResults.push(result)
      } catch (error) {
        console.error(`❌ Error creando plan "${plan.name}":`, error)
      }
    }
    
    console.log('🎉 Proceso completado!')
    console.log(`📊 Resultados: ${packResults.length}/${samplePacks.length} packs, ${planResults.length}/${samplePlans.length} planes`)
    
    return {
      packs: packResults,
      plans: planResults,
      success: packResults.length > 0 || planResults.length > 0
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return { error: error.message }
  }
}

async function testPricingPageLoad() {
  console.log('🧪 Probando carga de datos para página de precios...')
  
  try {
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    console.log('📦 Obteniendo packs...')
    const packs = await pricingService.getAllPacks()
    console.log('✅ Packs obtenidos:', packs.length, packs)
    
    console.log('📋 Obteniendo planes...')
    const plans = await pricingService.getAllPlans()
    console.log('✅ Planes obtenidos:', plans.length, plans)
    
    return { packs, plans }
    
  } catch (error) {
    console.error('❌ Error probando carga:', error)
    return { error: error.message }
  }
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.createSamplePricingData = createSamplePricingData
  window.testPricingPageLoad = testPricingPageLoad
  
  console.log('🔧 Funciones de creación de precios disponibles:')
  console.log('   - window.createSamplePricingData()')
  console.log('   - window.testPricingPageLoad()')
}

export {
  createSamplePricingData,
  testPricingPageLoad
}
