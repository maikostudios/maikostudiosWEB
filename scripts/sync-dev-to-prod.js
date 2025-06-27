#!/usr/bin/env node

/**
 * Script para sincronizar datos de Firebase Development a Production
 * 
 * IMPORTANTE: Este script debe ejecutarse con mucho cuidado ya que
 * sobrescribirá los datos de producción con los de desarrollo.
 * 
 * Uso: node scripts/sync-dev-to-prod.js
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  writeBatch 
} from 'firebase/firestore';

// Configuración Firebase Development
const devConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d"
};

// Configuración Firebase Production
const prodConfig = {
  apiKey: "AIzaSyBqK3gpZUzjUYulGE6yu6GwGyRavUFOKAo",
  authDomain: "maikostudios-a9162.firebaseapp.com",
  projectId: "maikostudios-a9162",
  storageBucket: "maikostudios-a9162.firebasestorage.app",
  messagingSenderId: "798896348759",
  appId: "1:798896348759:web:a4c6bf6911bc107aa38d12"
};

// Inicializar apps
const devApp = initializeApp(devConfig, 'development');
const prodApp = initializeApp(prodConfig, 'production');

const devDb = getFirestore(devApp);
const prodDb = getFirestore(prodApp);

// Colecciones a sincronizar
const COLLECTIONS_TO_SYNC = [
  'proyectos',
  'mensajes_contacto',
  'reclutadores_interesados', 
  'cv_solicitudes',
  'plantillas',
  'perfil_candidato',
  'conversaciones_chatbot'
];

/**
 * Crear backup de una colección antes de sincronizar
 */
async function createBackup(collectionName) {
  console.log(`📦 Creando backup de ${collectionName}...`);
  
  try {
    const snapshot = await getDocs(collection(prodDb, collectionName));
    const backupData = [];
    
    snapshot.forEach(doc => {
      backupData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    // Guardar backup en colección especial
    const backupCollectionName = `${collectionName}_backup_${Date.now()}`;
    const batch = writeBatch(prodDb);
    
    backupData.forEach(item => {
      const docRef = doc(prodDb, backupCollectionName, item.id);
      batch.set(docRef, item.data);
    });
    
    await batch.commit();
    console.log(`✅ Backup creado: ${backupCollectionName} (${backupData.length} documentos)`);
    
    return backupCollectionName;
  } catch (error) {
    console.error(`❌ Error creando backup de ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Sincronizar una colección específica
 */
async function syncCollection(collectionName) {
  console.log(`🔄 Sincronizando colección: ${collectionName}`);
  
  try {
    // 1. Crear backup de producción
    const backupName = await createBackup(collectionName);
    
    // 2. Obtener datos de desarrollo
    const devSnapshot = await getDocs(collection(devDb, collectionName));
    const devData = [];
    
    devSnapshot.forEach(doc => {
      devData.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    console.log(`📊 Documentos en desarrollo: ${devData.length}`);
    
    // 3. Limpiar colección de producción
    const prodSnapshot = await getDocs(collection(prodDb, collectionName));
    const deletePromises = [];
    
    prodSnapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`🗑️ Limpieza completada: ${deletePromises.length} documentos eliminados`);
    
    // 4. Insertar datos de desarrollo en producción
    const batch = writeBatch(prodDb);
    
    devData.forEach(item => {
      const docRef = doc(prodDb, collectionName, item.id);
      batch.set(docRef, item.data);
    });
    
    await batch.commit();
    console.log(`✅ Sincronización completada: ${devData.length} documentos copiados`);
    
    return {
      collection: collectionName,
      backup: backupName,
      synced: devData.length
    };
    
  } catch (error) {
    console.error(`❌ Error sincronizando ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 INICIANDO SINCRONIZACIÓN DEV → PROD');
  console.log('=====================================');
  console.log(`📅 Fecha: ${new Date().toISOString()}`);
  console.log(`🔄 Colecciones a sincronizar: ${COLLECTIONS_TO_SYNC.length}`);
  console.log('');
  
  // Confirmación de seguridad
  console.log('⚠️  ADVERTENCIA: Este proceso sobrescribirá TODOS los datos de producción');
  console.log('⚠️  Se crearán backups automáticamente antes de cada sincronización');
  console.log('');
  
  const results = [];
  
  try {
    for (const collectionName of COLLECTIONS_TO_SYNC) {
      console.log(`\n--- Procesando: ${collectionName} ---`);
      const result = await syncCollection(collectionName);
      results.push(result);
      console.log(`✅ ${collectionName} completado\n`);
    }
    
    // Resumen final
    console.log('\n🎉 SINCRONIZACIÓN COMPLETADA');
    console.log('============================');
    results.forEach(result => {
      console.log(`✅ ${result.collection}: ${result.synced} documentos`);
      console.log(`   📦 Backup: ${result.backup}`);
    });
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Verificar que los datos se muestren correctamente en producción');
    console.log('2. Probar todas las funcionalidades críticas');
    console.log('3. Si hay problemas, usar los backups para restaurar');
    console.log('\n🌐 URL Producción: https://maikostudios-a9162.web.app');
    
  } catch (error) {
    console.error('\n💥 ERROR EN SINCRONIZACIÓN:', error);
    console.log('\n🔧 ACCIONES RECOMENDADAS:');
    console.log('1. Verificar conexión a Firebase');
    console.log('2. Verificar permisos de las bases de datos');
    console.log('3. Revisar logs de error detallados');
    console.log('4. Contactar al administrador si persiste el problema');
    process.exit(1);
  }
}

// Ejecutar script
main().catch(console.error);
