/**
 * Script para probar la configuración de producción
 * Verifica conexiones con Firebase y crea usuario administrador
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';

// Configuración de Firebase (producción)
const firebaseConfig = {
  apiKey: "AIzaSyBqK3gpZUzjUYulGE6yu6GwGyRavUFOKAo",
  authDomain: "maikostudios-a9162.firebaseapp.com",
  projectId: "maikostudios-a9162",
  storageBucket: "maikostudios-a9162.firebasestorage.app",
  messagingSenderId: "798896348759",
  appId: "1:798896348759:web:a4c6bf6911bc107aa38d12"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🔥 Iniciando pruebas de configuración de producción...\n');

// Función para crear usuario administrador
async function crearUsuarioAdmin() {
  try {
    console.log('👤 Creando usuario administrador...');
    
    const adminCredentials = {
      email: 'maikostudios@gmail.com',
      password: '123456'
    };

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminCredentials.email,
      adminCredentials.password
    );

    console.log('✅ Usuario administrador creado:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Usuario administrador ya existe');
      return { success: true, message: 'Usuario ya existe' };
    } else {
      console.error('❌ Error creando usuario:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// Función para probar autenticación
async function probarAutenticacion() {
  try {
    console.log('🔐 Probando autenticación...');
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'maikostudios@gmail.com',
      '123456'
    );

    console.log('✅ Autenticación exitosa:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    return { success: false, error: error.message };
  }
}

// Función para probar Firestore
async function probarFirestore() {
  try {
    console.log('🗄️ Probando conexión con Firestore...');
    
    // Probar escritura
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Test de conexión de producción'
    };

    const docRef = await addDoc(collection(db, 'logs'), testDoc);
    console.log('✅ Escritura en Firestore exitosa. Doc ID:', docRef.id);

    // Probar lectura
    const logsQuery = query(
      collection(db, 'logs'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(logsQuery);
    console.log('✅ Lectura de Firestore exitosa. Docs encontrados:', querySnapshot.size);

    return { success: true };
  } catch (error) {
    console.error('❌ Error en Firestore:', error.message);
    return { success: false, error: error.message };
  }
}

// Función para probar sistema de precios
async function probarSistemaPrecios() {
  try {
    console.log('💰 Probando sistema de precios...');
    
    // Probar lectura de packs
    const packsQuery = query(
      collection(db, 'pricing_packs'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    
    const packsSnapshot = await getDocs(packsQuery);
    console.log('✅ Packs de precios encontrados:', packsSnapshot.size);

    // Probar lectura de planes
    const plansQuery = query(
      collection(db, 'pricing_plans'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );
    
    const plansSnapshot = await getDocs(plansQuery);
    console.log('✅ Planes de precios encontrados:', plansSnapshot.size);

    return { success: true, packs: packsSnapshot.size, plans: plansSnapshot.size };
  } catch (error) {
    console.error('❌ Error en sistema de precios:', error.message);
    return { success: false, error: error.message };
  }
}

// Función para probar colecciones principales
async function probarColecciones() {
  try {
    console.log('📚 Probando colecciones principales...');
    
    const colecciones = [
      'proyectos',
      'mensajes_contacto',
      'cv_solicitudes',
      'plantillas',
      'perfil_candidato',
      'conversaciones_chatbot'
    ];

    const resultados = {};

    for (const coleccion of colecciones) {
      try {
        const snapshot = await getDocs(collection(db, coleccion));
        resultados[coleccion] = snapshot.size;
        console.log(`✅ ${coleccion}: ${snapshot.size} documentos`);
      } catch (error) {
        resultados[coleccion] = `Error: ${error.message}`;
        console.log(`❌ ${coleccion}: Error - ${error.message}`);
      }
    }

    return { success: true, resultados };
  } catch (error) {
    console.error('❌ Error probando colecciones:', error.message);
    return { success: false, error: error.message };
  }
}

// Función principal
async function ejecutarPruebas() {
  console.log('🚀 Ejecutando pruebas de configuración de producción...\n');

  const resultados = {
    usuario: await crearUsuarioAdmin(),
    autenticacion: await probarAutenticacion(),
    firestore: await probarFirestore(),
    precios: await probarSistemaPrecios(),
    colecciones: await probarColecciones()
  };

  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('========================');
  console.log('Usuario Admin:', resultados.usuario.success ? '✅' : '❌');
  console.log('Autenticación:', resultados.autenticacion.success ? '✅' : '❌');
  console.log('Firestore:', resultados.firestore.success ? '✅' : '❌');
  console.log('Sistema Precios:', resultados.precios.success ? '✅' : '❌');
  console.log('Colecciones:', resultados.colecciones.success ? '✅' : '❌');

  if (resultados.precios.success) {
    console.log(`  - Packs: ${resultados.precios.packs}`);
    console.log(`  - Planes: ${resultados.precios.plans}`);
  }

  console.log('\n🎯 Configuración de producción:', 
    Object.values(resultados).every(r => r.success) ? 'EXITOSA ✅' : 'CON ERRORES ❌'
  );

  return resultados;
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  ejecutarPruebas().catch(console.error);
}

export { ejecutarPruebas, crearUsuarioAdmin, probarAutenticacion, probarFirestore };
