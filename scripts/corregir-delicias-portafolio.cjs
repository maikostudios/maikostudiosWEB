// Script para corregir el proyecto "Delicias Tía Jovy" 
const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc,
  doc,
  query,
  where
} = require("firebase/firestore");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function corregirDeliciasPortafolio() {
  try {
    console.log("🔧 Corrigiendo configuración de 'Delicias Tía Jovy'...\n");
    
    const proyectosRef = collection(db, "proyectos");
    const snapshot = await getDocs(proyectosRef);
    
    if (snapshot.empty) {
      console.log("❌ No hay proyectos en Firestore");
      return;
    }
    
    let proyectoEncontrado = false;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const docId = docSnapshot.id;
      
      // Buscar el proyecto "Delicias Tía Jovy" (no el "App Web Delicias Tia Jovy")
      if (data.titulo === "Delicias Tía Jovy") {
        proyectoEncontrado = true;
        
        console.log(`📁 Proyecto encontrado: ${data.titulo}`);
        console.log(`   ID: ${docId}`);
        console.log(`   Estado actual:`);
        console.log(`   ⭐ esEstrella: ${data.esEstrella}`);
        console.log(`   🏠 mostrarEnHome: ${data.mostrarEnHome}`);
        console.log(`   💼 mostrarEnPortafolio: ${data.mostrarEnPortafolio}`);
        console.log('');
        
        // Según tu descripción, este proyecto NO debería mostrarse en portafolio
        // Solo el "App Web Delicias Tia Jovy" (que es estrella) debería mostrarse
        
        try {
          const docRef = doc(db, "proyectos", docId);
          await updateDoc(docRef, {
            mostrarEnPortafolio: false  // Ocultar de portafolio
          });
          
          console.log(`✅ Proyecto "${data.titulo}" actualizado:`);
          console.log(`   💼 mostrarEnPortafolio: false (OCULTO en portafolio)`);
          console.log(`   📝 Razón: Solo "App Web Delicias Tia Jovy" (estrella) debe mostrarse`);
          
        } catch (error) {
          console.error(`❌ Error actualizando ${data.titulo}:`, error.message);
        }
        
        break;
      }
    }
    
    if (!proyectoEncontrado) {
      console.log("❌ No se encontró el proyecto 'Delicias Tía Jovy'");
      return;
    }
    
    console.log("\n📊 CONFIGURACIÓN RECOMENDADA:");
    console.log("1. 📁 'App Web Delicias Tia Jovy':");
    console.log("   ⭐ esEstrella: true");
    console.log("   🏠 mostrarEnHome: true");
    console.log("   💼 mostrarEnPortafolio: true");
    console.log("   📍 Aparece en: Home (destacado) + Portafolio (proyecto estrella)");
    console.log('');
    console.log("2. 📁 'Delicias Tía Jovy':");
    console.log("   ⭐ esEstrella: false");
    console.log("   🏠 mostrarEnHome: false");
    console.log("   💼 mostrarEnPortafolio: false ← CORREGIDO");
    console.log("   📍 Aparece en: Ninguna sección (evita duplicación)");
    
    console.log("\n💡 EXPLICACIÓN:");
    console.log("- Ambos proyectos apuntan al mismo sitio (deliciastiajovy.cl)");
    console.log("- Solo uno debe mostrarse para evitar confusión");
    console.log("- 'App Web Delicias Tia Jovy' es el principal (estrella)");
    console.log("- 'Delicias Tía Jovy' se mantiene como respaldo/histórico");
    
  } catch (error) {
    console.error("❌ Error al corregir proyecto:", error);
  }
}

// Ejecutar el script
corregirDeliciasPortafolio().then(() => {
  console.log("\n✅ Corrección completada");
  console.log("🔄 Recarga /portafolio para ver los cambios");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en el script:", error);
  process.exit(1);
});
