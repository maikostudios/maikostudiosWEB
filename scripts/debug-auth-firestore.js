/**
 * Script para debuggear problemas de autenticación y Firestore
 * Ejecutar desde la consola del navegador en /admin
 */

async function debugAuthAndFirestore() {
  console.log('🔍 Iniciando debug de autenticación y Firestore...')
  
  try {
    // 1. Verificar Firebase Auth
    console.log('👤 1. Verificando autenticación...')
    const { auth } = await import('../src/firebase/config.js')
    
    if (!auth) {
      console.error('❌ Firebase Auth no está inicializado')
      return
    }
    
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado')
      return
    }
    
    console.log('✅ Usuario autenticado:', {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified
    })
    
    // 2. Verificar token de autenticación
    console.log('🔑 2. Verificando token...')
    const token = await currentUser.getIdToken(true)
    const tokenResult = await currentUser.getIdTokenResult()
    
    console.log('✅ Token obtenido:', {
      claims: tokenResult.claims,
      authTime: tokenResult.authTime,
      issuedAtTime: tokenResult.issuedAtTime,
      expirationTime: tokenResult.expirationTime
    })
    
    // 3. Verificar permisos de admin
    console.log('🔐 3. Verificando permisos de admin...')
    const adminEmails = ['maikostudios@gmail.com', 'm.esteban.saez@gmail.com']
    const isAdmin = adminEmails.includes(currentUser.email)
    
    console.log('✅ Verificación de admin:', {
      email: currentUser.email,
      isAdmin,
      adminEmails
    })
    
    // 4. Probar acceso a Firestore
    console.log('🔥 4. Probando acceso a Firestore...')
    const { db } = await import('../src/firebase/config.js')
    const { collection, getDocs, addDoc } = await import('firebase/firestore')
    
    if (!db) {
      console.error('❌ Firestore no está inicializado')
      return
    }
    
    // Probar lectura de colección existente
    try {
      const proyectosSnapshot = await getDocs(collection(db, 'proyectos'))
      console.log('✅ Lectura de proyectos exitosa:', proyectosSnapshot.size, 'documentos')
    } catch (error) {
      console.error('❌ Error leyendo proyectos:', error)
    }
    
    // Probar lectura de pricing_packs
    try {
      const packsSnapshot = await getDocs(collection(db, 'pricing_packs'))
      console.log('✅ Lectura de pricing_packs exitosa:', packsSnapshot.size, 'documentos')
    } catch (error) {
      console.error('❌ Error leyendo pricing_packs:', error)
    }
    
    // Probar lectura de pricing_plans
    try {
      const plansSnapshot = await getDocs(collection(db, 'pricing_plans'))
      console.log('✅ Lectura de pricing_plans exitosa:', plansSnapshot.size, 'documentos')
    } catch (error) {
      console.error('❌ Error leyendo pricing_plans:', error)
    }
    
    // 5. Probar escritura (solo si es admin)
    if (isAdmin) {
      console.log('✍️ 5. Probando escritura en Firestore...')
      
      try {
        const testDoc = {
          name: 'Test Pack',
          price: { monthly: 100000, annual: 1000000, currency: 'CLP' },
          features: ['Test feature'],
          active: true,
          createdAt: new Date(),
          type: 'pack'
        }
        
        const docRef = await addDoc(collection(db, 'pricing_packs'), testDoc)
        console.log('✅ Escritura exitosa, documento creado:', docRef.id)
        
        // Eliminar el documento de prueba
        const { deleteDoc, doc } = await import('firebase/firestore')
        await deleteDoc(doc(db, 'pricing_packs', docRef.id))
        console.log('✅ Documento de prueba eliminado')
        
      } catch (error) {
        console.error('❌ Error en escritura:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack
        })
      }
    } else {
      console.log('⚠️ Usuario no es admin, saltando prueba de escritura')
    }
    
    console.log('✅ Debug completado')
    
  } catch (error) {
    console.error('❌ Error en debug:', error)
  }
}

// Función para verificar configuración de Firebase
async function debugFirebaseConfig() {
  console.log('⚙️ Verificando configuración de Firebase...')
  
  try {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    }
    
    console.log('📋 Configuración actual:', config)
    
    // Verificar que no hay valores demo
    const hasDemoValues = Object.values(config).some(value => 
      value && (value.includes('demo') || value.includes('123456'))
    )
    
    if (hasDemoValues) {
      console.warn('⚠️ Se detectaron valores demo en la configuración')
    } else {
      console.log('✅ Configuración parece válida')
    }
    
  } catch (error) {
    console.error('❌ Error verificando configuración:', error)
  }
}

// Función para verificar reglas de Firestore
function debugFirestoreRules() {
  console.log('📜 Información sobre reglas de Firestore:')
  console.log('Las reglas actuales deberían incluir:')
  console.log('- pricing_packs: lectura pública, escritura solo admin')
  console.log('- pricing_plans: lectura pública, escritura solo admin')
  console.log('- Función isAdmin() que verifica emails autorizados')
  console.log('')
  console.log('Para verificar reglas en Firebase Console:')
  console.log('https://console.firebase.google.com/project/maikostudios-a9162/firestore/rules')
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.debugAuthAndFirestore = debugAuthAndFirestore
  window.debugFirebaseConfig = debugFirebaseConfig
  window.debugFirestoreRules = debugFirestoreRules
  
  console.log('🔧 Funciones de debug disponibles:')
  console.log('   - window.debugAuthAndFirestore()')
  console.log('   - window.debugFirebaseConfig()')
  console.log('   - window.debugFirestoreRules()')
}

export {
  debugAuthAndFirestore,
  debugFirebaseConfig,
  debugFirestoreRules
}
