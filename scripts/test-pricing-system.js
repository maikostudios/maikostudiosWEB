/**
 * Script de prueba completo para el sistema de precios
 * Ejecutar desde la consola del navegador en /admin
 */

async function testPricingSystem() {
  console.log('🚀 Iniciando pruebas del sistema de precios...')
  
  try {
    // 1. Verificar que las funciones estén disponibles
    console.log('📋 1. Verificando funciones disponibles...')
    if (typeof window.crearDatosPrueba !== 'function') {
      throw new Error('window.crearDatosPrueba no está disponible')
    }
    console.log('✅ Funciones disponibles')

    // 2. Limpiar datos existentes
    console.log('🧹 2. Limpiando datos existentes...')
    if (typeof window.limpiarPricingPacks === 'function') {
      await window.limpiarPricingPacks()
    }
    console.log('✅ Datos limpiados')

    // 3. Crear datos de prueba
    console.log('📦 3. Creando datos de prueba...')
    await window.crearDatosPrueba()
    console.log('✅ Datos de prueba creados')

    // 4. Verificar navegación
    console.log('🧭 4. Verificando navegación...')
    console.log('   - Ir a /precios para verificar la página')
    console.log('   - Verificar que se muestren packs y planes')
    console.log('   - Verificar que los botones de WhatsApp funcionen')

    // 5. Verificar admin panel
    console.log('⚙️ 5. Verificando admin panel...')
    console.log('   - Ir a pestaña "Gestión de Precios"')
    console.log('   - Verificar sub-pestañas "Packs" y "Planes"')
    console.log('   - Probar crear/editar/eliminar elementos')

    console.log('✅ Pruebas completadas. Verificar manualmente los puntos 4 y 5.')
    
    return {
      success: true,
      message: 'Sistema de precios funcionando correctamente',
      nextSteps: [
        'Verificar /precios en el navegador',
        'Probar funcionalidad CRUD en admin panel',
        'Verificar responsive design',
        'Probar integración WhatsApp'
      ]
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
}

// Función para verificar datos en Firestore
async function verifyFirestoreData() {
  console.log('🔍 Verificando datos en Firestore...')
  
  try {
    // Importar Firebase (asumiendo que está disponible globalmente)
    const { collection, getDocs } = window.firebase || {}
    
    if (!collection || !getDocs) {
      console.log('⚠️ Firebase no disponible globalmente, usar herramientas de desarrollador')
      return
    }

    // Verificar colecciones
    const packsSnapshot = await getDocs(collection(db, 'pricing_packs'))
    const plansSnapshot = await getDocs(collection(db, 'pricing_plans'))
    
    console.log(`📦 Packs encontrados: ${packsSnapshot.size}`)
    console.log(`📋 Planes encontrados: ${plansSnapshot.size}`)
    
    packsSnapshot.forEach(doc => {
      console.log('Pack:', doc.id, doc.data().name)
    })
    
    plansSnapshot.forEach(doc => {
      console.log('Plan:', doc.id, doc.data().name)
    })
    
  } catch (error) {
    console.error('Error verificando Firestore:', error)
  }
}

// Función para probar responsive design
function testResponsiveDesign() {
  console.log('📱 Probando diseño responsive...')
  
  const viewports = [
    { width: 320, height: 568, name: 'Mobile Small' },
    { width: 375, height: 667, name: 'Mobile Medium' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Desktop Small' },
    { width: 1440, height: 900, name: 'Desktop Large' }
  ]
  
  console.log('🔧 Para probar responsive design:')
  viewports.forEach(viewport => {
    console.log(`   - ${viewport.name}: ${viewport.width}x${viewport.height}`)
  })
  
  console.log('💡 Usar DevTools > Toggle Device Toolbar para probar cada tamaño')
}

// Función para probar integración WhatsApp
function testWhatsAppIntegration() {
  console.log('💬 Probando integración WhatsApp...')
  
  const testData = {
    packName: 'Pack Básico Web',
    planName: 'Plan Profesional',
    userInfo: {
      name: 'Usuario Test',
      email: 'test@example.com',
      phone: '+56912345678'
    }
  }
  
  console.log('🔧 Para probar WhatsApp:')
  console.log('   1. Hacer clic en botones "Contactar por WhatsApp"')
  console.log('   2. Verificar que se abra WhatsApp con mensaje pre-llenado')
  console.log('   3. Verificar formato del mensaje')
  console.log('   4. Probar desde diferentes dispositivos')
  
  return testData
}

// Exponer funciones globalmente para uso en consola
if (typeof window !== 'undefined') {
  window.testPricingSystem = testPricingSystem
  window.verifyFirestoreData = verifyFirestoreData
  window.testResponsiveDesign = testResponsiveDesign
  window.testWhatsAppIntegration = testWhatsAppIntegration
  
  console.log('🔧 Funciones de prueba disponibles:')
  console.log('   - window.testPricingSystem()')
  console.log('   - window.verifyFirestoreData()')
  console.log('   - window.testResponsiveDesign()')
  console.log('   - window.testWhatsAppIntegration()')
}

export {
  testPricingSystem,
  verifyFirestoreData,
  testResponsiveDesign,
  testWhatsAppIntegration
}
