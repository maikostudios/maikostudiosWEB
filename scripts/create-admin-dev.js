/**
 * Script para crear usuario admin en proyecto de desarrollo
 * Ejecutar con: node scripts/create-admin-dev.js
 */

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

// Configuración del proyecto de desarrollo
const firebaseConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function createAdminUser() {
  console.log('🔧 Creando usuario admin en proyecto de desarrollo...')
  
  const adminEmail = 'maikostudios@gmail.com'
  const adminPassword = '123456'
  
  try {
    // Intentar crear el usuario
    console.log('👤 Creando usuario:', adminEmail)
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user
    
    console.log('✅ Usuario admin creado exitosamente:')
    console.log('   - UID:', user.uid)
    console.log('   - Email:', user.email)
    console.log('   - Proyecto: maikostudios-dev')
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Usuario ya existe, intentando login...')
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
        const user = userCredential.user
        
        console.log('✅ Login exitoso:')
        console.log('   - UID:', user.uid)
        console.log('   - Email:', user.email)
        console.log('   - Proyecto: maikostudios-dev')
        
      } catch (loginError) {
        console.error('❌ Error en login:', loginError.message)
        
        if (loginError.code === 'auth/wrong-password') {
          console.log('⚠️ La contraseña puede ser diferente.')
          console.log('   Puedes resetear la contraseña desde Firebase Console:')
          console.log('   https://console.firebase.google.com/project/maikostudios-dev/authentication/users')
        }
      }
    } else {
      console.error('❌ Error creando usuario:', error.message)
    }
  }
  
  console.log('\n🔗 Enlaces útiles:')
  console.log('   - Firebase Console: https://console.firebase.google.com/project/maikostudios-dev')
  console.log('   - Authentication: https://console.firebase.google.com/project/maikostudios-dev/authentication/users')
  console.log('   - Firestore: https://console.firebase.google.com/project/maikostudios-dev/firestore')
  
  process.exit(0)
}

createAdminUser().catch(console.error)
