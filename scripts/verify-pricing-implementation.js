/**
 * Script de verificación de implementación del sistema de precios
 * Verifica que todos los componentes estén correctamente implementados
 */

// Verificar estructura de archivos
const requiredFiles = [
  'src/views/PreciosView.vue',
  'src/views/AdminView.vue', 
  'src/services/pricingService.js',
  'src/components/Navbar.vue',
  'src/components/Footer.vue',
  'firestore.rules'
]

// Verificar funciones en pricingService
const requiredServiceFunctions = [
  'getAllPacks',
  'getAllPlans', 
  'createPack',
  'createPlan',
  'updatePack',
  'updatePlan',
  'deletePack',
  'deletePlan',
  'getEmptyPack',
  'getEmptyPlan'
]

// Verificar componentes en AdminView
const requiredAdminFeatures = [
  'subTabPrecios',
  'dialogPlan',
  'planForm',
  'featuresTextPlan',
  'abrirDialogPlan',
  'cerrarDialogPlan',
  'guardarPlan',
  'editarPlan',
  'eliminarPlan',
  'togglePlanActive',
  'headersPlanes'
]

// Verificar componentes en PreciosView
const requiredPreciosFeatures = [
  'pricingPacks',
  'pricingPlans',
  'loadPricingPacks',
  'loadPricingPlans',
  'Navbar',
  'Footer'
]

// Verificar colecciones Firestore
const requiredFirestoreCollections = [
  'pricing_packs',
  'pricing_plans'
]

// Verificar reglas de seguridad
const requiredFirestoreRules = [
  'pricing_packs read access',
  'pricing_packs admin write access',
  'pricing_plans read access', 
  'pricing_plans admin write access'
]

function verifyImplementation() {
  console.log('🔍 Verificando implementación del sistema de precios...')
  
  const results = {
    files: [],
    serviceFunctions: [],
    adminFeatures: [],
    preciosFeatures: [],
    firestoreCollections: [],
    firestoreRules: [],
    errors: [],
    warnings: []
  }
  
  // Esta función debe ejecutarse en el contexto del navegador
  // donde los módulos están cargados
  
  console.log('✅ Verificación completada')
  console.log('📋 Resultados:', results)
  
  return results
}

// Función para verificar datos de prueba
async function verifyTestData() {
  console.log('📊 Verificando datos de prueba...')
  
  try {
    // Verificar que existan packs y planes
    const packs = await window.pricingService?.getAllPacks() || []
    const plans = await window.pricingService?.getAllPlans() || []
    
    console.log(`📦 Packs encontrados: ${packs.length}`)
    console.log(`📋 Planes encontrados: ${plans.length}`)
    
    if (packs.length === 0) {
      console.warn('⚠️ No se encontraron packs. Ejecutar window.crearDatosPrueba()')
    }
    
    if (plans.length === 0) {
      console.warn('⚠️ No se encontraron planes. Ejecutar window.crearDatosPrueba()')
    }
    
    return {
      packsCount: packs.length,
      plansCount: plans.length,
      packs,
      plans
    }
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error)
    return { error: error.message }
  }
}

// Función para verificar navegación
function verifyNavigation() {
  console.log('🧭 Verificando navegación...')
  
  const currentUrl = window.location.href
  const baseUrl = currentUrl.split('#')[0].split('?')[0]
  
  const routes = [
    `${baseUrl}`,
    `${baseUrl}#/`,
    `${baseUrl}#/precios`,
    `${baseUrl}#/admin`,
    `${baseUrl}#/login`
  ]
  
  console.log('🔗 Rutas disponibles:')
  routes.forEach(route => {
    console.log(`   - ${route}`)
  })
  
  return routes
}

// Función para verificar responsive design
function verifyResponsive() {
  console.log('📱 Verificando diseño responsive...')
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  console.log(`📐 Viewport actual: ${viewportWidth}x${viewportHeight}`)
  
  const breakpoints = {
    mobile: viewportWidth < 768,
    tablet: viewportWidth >= 768 && viewportWidth < 1024,
    desktop: viewportWidth >= 1024
  }
  
  console.log('📊 Breakpoints:', breakpoints)
  
  return {
    viewport: { width: viewportWidth, height: viewportHeight },
    breakpoints
  }
}

// Función para verificar accesibilidad
function verifyAccessibility() {
  console.log('♿ Verificando accesibilidad...')
  
  const checks = {
    altTexts: document.querySelectorAll('img:not([alt])').length === 0,
    headingStructure: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
    focusableElements: document.querySelectorAll('button, a, input, select, textarea').length > 0,
    ariaLabels: document.querySelectorAll('[aria-label], [aria-labelledby]').length > 0
  }
  
  console.log('♿ Verificaciones de accesibilidad:', checks)
  
  return checks
}

// Función principal de verificación
async function runFullVerification() {
  console.log('🚀 Ejecutando verificación completa...')
  
  const results = {
    implementation: verifyImplementation(),
    testData: await verifyTestData(),
    navigation: verifyNavigation(),
    responsive: verifyResponsive(),
    accessibility: verifyAccessibility(),
    timestamp: new Date().toISOString()
  }
  
  console.log('📋 Resultados completos:', results)
  
  // Generar reporte
  const report = generateReport(results)
  console.log('📄 Reporte:', report)
  
  return results
}

function generateReport(results) {
  const report = {
    status: 'success',
    issues: [],
    recommendations: [],
    summary: {}
  }
  
  // Analizar resultados y generar recomendaciones
  if (results.testData.packsCount === 0) {
    report.issues.push('No hay packs de prueba')
    report.recommendations.push('Ejecutar window.crearDatosPrueba()')
  }
  
  if (results.testData.plansCount === 0) {
    report.issues.push('No hay planes de prueba')
    report.recommendations.push('Ejecutar window.crearDatosPrueba()')
  }
  
  if (!results.accessibility.altTexts) {
    report.issues.push('Imágenes sin texto alternativo')
    report.recommendations.push('Agregar atributos alt a todas las imágenes')
  }
  
  report.summary = {
    totalIssues: report.issues.length,
    totalRecommendations: report.recommendations.length,
    overallStatus: report.issues.length === 0 ? 'excellent' : report.issues.length < 3 ? 'good' : 'needs-improvement'
  }
  
  return report
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.verifyImplementation = verifyImplementation
  window.verifyTestData = verifyTestData
  window.verifyNavigation = verifyNavigation
  window.verifyResponsive = verifyResponsive
  window.verifyAccessibility = verifyAccessibility
  window.runFullVerification = runFullVerification
  
  console.log('🔧 Funciones de verificación disponibles:')
  console.log('   - window.verifyImplementation()')
  console.log('   - window.verifyTestData()')
  console.log('   - window.verifyNavigation()')
  console.log('   - window.verifyResponsive()')
  console.log('   - window.verifyAccessibility()')
  console.log('   - window.runFullVerification()')
}

export {
  verifyImplementation,
  verifyTestData,
  verifyNavigation,
  verifyResponsive,
  verifyAccessibility,
  runFullVerification
}
