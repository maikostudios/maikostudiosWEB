/**
 * Script para probar la creación de packs paso a paso
 * Ejecutar desde la consola del navegador en /admin
 */

async function testPackCreationStepByStep() {
  console.log('🧪 Iniciando prueba paso a paso de creación de pack...')
  
  try {
    // 1. Verificar autenticación
    console.log('👤 1. Verificando autenticación...')
    const { auth } = await import('../src/firebase/config.js')
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado')
      return { error: 'No authenticated user' }
    }
    
    console.log('✅ Usuario autenticado:', currentUser.email)
    
    // 2. Verificar permisos
    console.log('🔐 2. Verificando permisos...')
    const adminEmails = ['maikostudios@gmail.com', 'm.esteban.saez@gmail.com']
    const isAdmin = adminEmails.includes(currentUser.email)
    
    if (!isAdmin) {
      console.error('❌ Usuario no es admin')
      return { error: 'User is not admin' }
    }
    
    console.log('✅ Usuario es admin')
    
    // 3. Verificar conexión a Firestore
    console.log('🔥 3. Verificando conexión a Firestore...')
    const { db } = await import('../src/firebase/config.js')
    const { collection, getDocs } = await import('firebase/firestore')
    
    if (!db) {
      console.error('❌ Firestore no está inicializado')
      return { error: 'Firestore not initialized' }
    }
    
    console.log('✅ Firestore conectado')
    
    // 4. Probar lectura de colección
    console.log('📖 4. Probando lectura de pricing_packs...')
    try {
      const packsSnapshot = await getDocs(collection(db, 'pricing_packs'))
      console.log('✅ Lectura exitosa:', packsSnapshot.size, 'documentos')
    } catch (readError) {
      console.error('❌ Error leyendo pricing_packs:', readError)
      return { error: 'Read error', details: readError.message }
    }
    
    // 5. Probar creación de pack simple
    console.log('📦 5. Probando creación de pack...')
    const { addDoc } = await import('firebase/firestore')
    
    const testPack = {
      name: 'Pack de Prueba ' + Date.now(),
      subtitle: 'Prueba automática',
      price: {
        monthly: 50000,
        annual: 500000,
        currency: 'CLP'
      },
      features: ['Característica 1', 'Característica 2'],
      active: true,
      order: 1,
      type: 'pack',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    }
    
    try {
      const docRef = await addDoc(collection(db, 'pricing_packs'), testPack)
      console.log('✅ Pack creado exitosamente con ID:', docRef.id)
      
      // 6. Verificar que se creó
      console.log('🔍 6. Verificando pack creado...')
      const verifySnapshot = await getDocs(collection(db, 'pricing_packs'))
      console.log('✅ Total de packs después de creación:', verifySnapshot.size)
      
      return {
        success: true,
        packId: docRef.id,
        totalPacks: verifySnapshot.size,
        testPack
      }
      
    } catch (createError) {
      console.error('❌ Error creando pack:', createError)
      console.error('Código de error:', createError.code)
      console.error('Mensaje:', createError.message)
      
      return { 
        error: 'Create error', 
        code: createError.code,
        message: createError.message,
        details: createError
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
    return { error: 'General error', details: error.message }
  }
}

async function testPricingService() {
  console.log('🧪 Probando pricingService...')
  
  try {
    const { default: pricingService } = await import('../src/services/pricingService.js')
    
    const packData = {
      name: 'Pack Service Test ' + Date.now(),
      subtitle: 'Prueba con servicio',
      price: {
        monthly: 75000,
        annual: 750000,
        currency: 'CLP'
      },
      features: ['Feature 1', 'Feature 2'],
      active: true
    }
    
    console.log('📦 Creando pack con pricingService...')
    const result = await pricingService.createPack(packData)
    
    console.log('✅ Pack creado con servicio:', result)
    return result
    
  } catch (error) {
    console.error('❌ Error con pricingService:', error)
    return { error: error.message }
  }
}

async function runFullTest() {
  console.log('🚀 Ejecutando prueba completa...')
  
  const results = {
    stepByStep: await testPackCreationStepByStep(),
    pricingService: await testPricingService()
  }
  
  console.log('📊 Resultados completos:', results)
  return results
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.testPackCreationStepByStep = testPackCreationStepByStep
  window.testPricingService = testPricingService
  window.runFullTest = runFullTest
  
  console.log('🔧 Funciones de prueba de creación disponibles:')
  console.log('   - window.testPackCreationStepByStep()')
  console.log('   - window.testPricingService()')
  console.log('   - window.runFullTest()')
}

export {
  testPackCreationStepByStep,
  testPricingService,
  runFullTest
}
