// Script para actualizar proyectos existentes con campo mostrarEnPortafolio
const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  getDocs, 
  updateDoc,
  doc
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

async function actualizarProyectos() {
  try {
    console.log("🔄 Actualizando proyectos existentes con campo mostrarEnPortafolio...\n");
    
    const proyectosRef = collection(db, "proyectos");
    const snapshot = await getDocs(proyectosRef);
    
    if (snapshot.empty) {
      console.log("❌ No hay proyectos en Firestore");
      return;
    }
    
    console.log(`📊 Total de proyectos encontrados: ${snapshot.size}\n`);
    
    let actualizados = 0;
    let yaActualizados = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const docId = docSnapshot.id;
      
      // Verificar si ya tiene el campo mostrarEnPortafolio
      if (data.mostrarEnPortafolio !== undefined) {
        console.log(`⏭️  ${data.titulo} - Ya tiene campo mostrarEnPortafolio: ${data.mostrarEnPortafolio}`);
        yaActualizados++;
        continue;
      }
      
      // Determinar valor por defecto para mostrarEnPortafolio
      // Por defecto true, excepto para proyectos que claramente no deberían mostrarse
      let mostrarEnPortafolio = true;
      
      // Si es un proyecto de prueba o demo, no mostrarlo
      if (data.titulo.toLowerCase().includes('demo') || 
          data.titulo.toLowerCase().includes('test') ||
          data.enlaceDemo?.includes('demo')) {
        mostrarEnPortafolio = false;
      }
      
      try {
        const docRef = doc(db, "proyectos", docId);
        await updateDoc(docRef, {
          mostrarEnPortafolio: mostrarEnPortafolio
        });
        
        console.log(`✅ ${data.titulo} - Actualizado con mostrarEnPortafolio: ${mostrarEnPortafolio}`);
        actualizados++;
        
      } catch (error) {
        console.error(`❌ Error actualizando ${data.titulo}:`, error.message);
      }
    }
    
    console.log("\n📈 RESUMEN DE ACTUALIZACIÓN:");
    console.log(`   ✅ Proyectos actualizados: ${actualizados}`);
    console.log(`   ⏭️  Ya actualizados: ${yaActualizados}`);
    console.log(`   📊 Total procesados: ${snapshot.size}`);
    
    if (actualizados > 0) {
      console.log("\n🎉 ¡Actualización completada exitosamente!");
      console.log("💡 Ahora puedes controlar la visibilidad en portafolio desde el panel de administración");
    }
    
  } catch (error) {
    console.error("❌ Error al actualizar proyectos:", error);
  }
}

// Ejecutar el script
actualizarProyectos().then(() => {
  console.log("\n✅ Script completado");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en el script:", error);
  process.exit(1);
});
