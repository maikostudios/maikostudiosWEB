/**
 * Script simple para probar la creación de un pack básico
 * Ejecutar desde la consola del navegador en /admin
 */

async function testSimplePack() {
  console.log('🧪 Probando creación de pack simple...')
  
  try {
    // Importar el servicio de precios
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    // Datos de pack simple
    const packData = {
      name: 'Pack de Prueba',
      subtitle: 'Solo para testing',
      price: {
        monthly: 50000,
        annual: 500000,
        currency: 'CLP'
      },
      badge: {
        text: '',
        color: 'primary',
        show: false
      },
      features: ['Característica 1', 'Característica 2'],
      cta: {
        text: 'Contactar',
        action: 'contact',
        whatsapp: true
      },
      styling: {
        borderColor: 'primary',
        highlighted: false,
        gradient: false
      },
      active: true,
      order: 1,
      category: 'test'
    }
    
    console.log('📦 Datos del pack:', packData)
    
    // Intentar crear el pack
    const result = await pricingService.createPack(packData)
    
    console.log('✅ Pack creado exitosamente:', result)
    
    return result
    
  } catch (error) {
    console.error('❌ Error creando pack:', error)
    console.error('Detalles del error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    return { error: error.message }
  }
}

async function testSimplePlan() {
  console.log('🧪 Probando creación de plan simple...')
  
  try {
    // Importar el servicio de precios
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    // Datos de plan simple
    const planData = {
      name: 'Plan de Prueba',
      description: 'Solo para testing',
      monthlyPrice: 25000,
      annualPrice: 250000,
      currency: 'CLP',
      highlighted: false,
      features: ['Característica 1', 'Característica 2'],
      active: true,
      order: 1
    }
    
    console.log('📋 Datos del plan:', planData)
    
    // Intentar crear el plan
    const result = await pricingService.createPlan(planData)
    
    console.log('✅ Plan creado exitosamente:', result)
    
    return result
    
  } catch (error) {
    console.error('❌ Error creando plan:', error)
    console.error('Detalles del error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    return { error: error.message }
  }
}

async function testReadPacks() {
  console.log('📖 Probando lectura de packs...')
  
  try {
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    const packs = await pricingService.getAllPacks()
    console.log('✅ Packs obtenidos:', packs.length, 'elementos')
    console.log('📦 Packs:', packs)
    
    return packs
    
  } catch (error) {
    console.error('❌ Error leyendo packs:', error)
    return { error: error.message }
  }
}

async function testReadPlans() {
  console.log('📖 Probando lectura de planes...')
  
  try {
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    const plans = await pricingService.getAllPlans()
    console.log('✅ Planes obtenidos:', plans.length, 'elementos')
    console.log('📋 Planes:', plans)
    
    return plans
    
  } catch (error) {
    console.error('❌ Error leyendo planes:', error)
    return { error: error.message }
  }
}

async function runBasicTests() {
  console.log('🚀 Ejecutando pruebas básicas...')
  
  const results = {
    readPacks: await testReadPacks(),
    readPlans: await testReadPlans(),
    createPack: await testSimplePack(),
    createPlan: await testSimplePlan()
  }
  
  console.log('📊 Resultados de las pruebas:', results)
  
  return results
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.testSimplePack = testSimplePack
  window.testSimplePlan = testSimplePlan
  window.testReadPacks = testReadPacks
  window.testReadPlans = testReadPlans
  window.runBasicTests = runBasicTests
  
  console.log('🔧 Funciones de prueba básica disponibles:')
  console.log('   - window.testSimplePack()')
  console.log('   - window.testSimplePlan()')
  console.log('   - window.testReadPacks()')
  console.log('   - window.testReadPlans()')
  console.log('   - window.runBasicTests()')
}

export {
  testSimplePack,
  testSimplePlan,
  testReadPacks,
  testReadPlans,
  runBasicTests
}
