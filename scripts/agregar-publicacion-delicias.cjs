// Script para agregar estado de publicación al proyecto "App Web Delicias Tia Jovy"
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

async function agregarPublicacionDelicias() {
  try {
    console.log("🍰 Agregando estado de publicación a 'App Web Delicias Tia Jovy'...\n");
    
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
      
      // Buscar el proyecto "App Web Delicias Tia Jovy" (el proyecto estrella)
      if (data.titulo === "App Web Delicias Tia Jovy") {
        proyectoEncontrado = true;
        
        console.log(`📁 Proyecto encontrado: ${data.titulo}`);
        console.log(`   ID: ${docId}`);
        console.log(`   Estado actual:`);
        console.log(`   ⭐ esEstrella: ${data.esEstrella}`);
        console.log(`   🏠 mostrarEnHome: ${data.mostrarEnHome}`);
        console.log(`   💼 mostrarEnPortafolio: ${data.mostrarEnPortafolio}`);
        console.log(`   🍰 estaPublicado: ${data.estaPublicado || 'undefined'}`);
        console.log(`   📝 mensajePublicacion: ${data.mensajePublicacion || 'undefined'}`);
        console.log('');
        
        try {
          const docRef = doc(db, "proyectos", docId);
          await updateDoc(docRef, {
            estaPublicado: true,
            mensajePublicacion: "🍰 ¡Publicado y funcionando! 🧁"
          });
          
          console.log(`✅ Proyecto "${data.titulo}" actualizado:`);
          console.log(`   🍰 estaPublicado: true`);
          console.log(`   📝 mensajePublicacion: "🍰 ¡Publicado y funcionando! 🧁"`);
          console.log(`   🎯 Efecto: Badge verde aparecerá en las tarjetas del proyecto`);
          
        } catch (error) {
          console.error(`❌ Error actualizando ${data.titulo}:`, error.message);
        }
        
        break;
      }
    }
    
    if (!proyectoEncontrado) {
      console.log("❌ No se encontró el proyecto 'App Web Delicias Tia Jovy'");
      return;
    }
    
    console.log("\n🎨 DISEÑO DEL BADGE:");
    console.log("📍 Posición: Esquina superior derecha de la imagen");
    console.log("🎨 Color: Verde (success) con sombra");
    console.log("✨ Animación: Pulso suave para llamar la atención");
    console.log("📱 Responsive: Tamaño adaptativo según la card");
    
    console.log("\n📍 DÓNDE APARECERÁ:");
    console.log("🏠 Home: En la card del proyecto (badge pequeño)");
    console.log("💼 Portafolio: En el proyecto estrella (badge mediano)");
    console.log("📋 Admin: Control desde formulario de edición");
    
    console.log("\n💡 BENEFICIOS UX:");
    console.log("✅ Genera confianza - Proyecto real vs demo");
    console.log("✅ Diferenciación visual - Destaca proyectos operativos");
    console.log("✅ Marketing efectivo - Muestra experiencia real");
    console.log("✅ Control granular - Personalizable desde admin");
    
  } catch (error) {
    console.error("❌ Error al agregar publicación:", error);
  }
}

// Ejecutar el script
agregarPublicacionDelicias().then(() => {
  console.log("\n✅ Actualización completada");
  console.log("🔄 Recarga /home y /portafolio para ver el badge");
  console.log("⚙️ Edita el proyecto desde /admin para personalizar el mensaje");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en el script:", error);
  process.exit(1);
});
