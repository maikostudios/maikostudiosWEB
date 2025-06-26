// Script para debuggear el problema de mostrarEnPortafolio
const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  getDocs, 
  query,
  orderBy
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

async function debugPortafolio() {
  try {
    console.log("🔍 DEBUG: Analizando filtros de portafolio...\n");
    
    const proyectosRef = collection(db, "proyectos");
    const q = query(proyectosRef, orderBy("fechaCreacion", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("❌ No hay proyectos en Firestore");
      return;
    }
    
    console.log(`📊 Total de proyectos en Firestore: ${snapshot.size}\n`);
    
    const proyectos = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      proyectos.push({
        id: doc.id,
        titulo: data.titulo,
        esEstrella: data.esEstrella,
        mostrarEnHome: data.mostrarEnHome,
        mostrarEnPortafolio: data.mostrarEnPortafolio,
        activo: data.activo
      });
    });
    
    console.log("📋 TODOS LOS PROYECTOS CON CAMPOS DE CONTROL:");
    proyectos.forEach((proyecto, index) => {
      console.log(`${index + 1}. 📁 ${proyecto.titulo}`);
      console.log(`   ID: ${proyecto.id}`);
      console.log(`   ⭐ esEstrella: ${proyecto.esEstrella || false}`);
      console.log(`   🏠 mostrarEnHome: ${proyecto.mostrarEnHome || false}`);
      console.log(`   💼 mostrarEnPortafolio: ${proyecto.mostrarEnPortafolio !== undefined ? proyecto.mostrarEnPortafolio : 'UNDEFINED'}`);
      console.log(`   ✅ activo: ${proyecto.activo !== false}`);
      console.log('');
    });
    
    // Simular filtros de PortafolioView
    console.log("🔍 SIMULANDO FILTROS DE PORTAFOLIO:\n");
    
    // Filtro para proyecto estrella
    const proyectoEstrella = proyectos.find(proyecto => 
      proyecto.esEstrella && proyecto.activo !== false
    );
    
    console.log("⭐ PROYECTO ESTRELLA:");
    if (proyectoEstrella) {
      console.log(`   ✅ ${proyectoEstrella.titulo} (ID: ${proyectoEstrella.id})`);
    } else {
      console.log("   ❌ No hay proyecto estrella");
    }
    console.log('');
    
    // Filtro para otros proyectos (ACTUAL - CON PROBLEMA)
    const otrosProyectosActual = proyectos.filter(proyecto =>
      !proyecto.esEstrella && 
      proyecto.activo !== false && 
      proyecto.mostrarEnPortafolio !== false
    );
    
    console.log("📂 OTROS PROYECTOS (FILTRO ACTUAL - CON PROBLEMA):");
    if (otrosProyectosActual.length > 0) {
      otrosProyectosActual.forEach((proyecto, index) => {
        console.log(`   ${index + 1}. ${proyecto.titulo}`);
        console.log(`      💼 mostrarEnPortafolio: ${proyecto.mostrarEnPortafolio}`);
        console.log(`      🤔 ¿Por qué aparece?: ${proyecto.mostrarEnPortafolio !== false ? 'mostrarEnPortafolio !== false es TRUE' : 'No debería aparecer'}`);
      });
    } else {
      console.log("   ❌ No hay otros proyectos");
    }
    console.log('');
    
    // Filtro corregido
    const otrosProyectosCorregido = proyectos.filter(proyecto =>
      !proyecto.esEstrella && 
      proyecto.activo !== false && 
      proyecto.mostrarEnPortafolio === true
    );
    
    console.log("📂 OTROS PROYECTOS (FILTRO CORREGIDO):");
    if (otrosProyectosCorregido.length > 0) {
      otrosProyectosCorregido.forEach((proyecto, index) => {
        console.log(`   ${index + 1}. ${proyecto.titulo}`);
        console.log(`      💼 mostrarEnPortafolio: ${proyecto.mostrarEnPortafolio}`);
      });
    } else {
      console.log("   ❌ No hay otros proyectos con mostrarEnPortafolio === true");
    }
    console.log('');
    
    // Análisis del problema
    console.log("🐛 ANÁLISIS DEL PROBLEMA:");
    const problemProjects = proyectos.filter(p => 
      !p.esEstrella && 
      p.activo !== false && 
      p.mostrarEnPortafolio !== false &&
      p.mostrarEnPortafolio !== true
    );
    
    if (problemProjects.length > 0) {
      console.log("❌ Proyectos con mostrarEnPortafolio undefined/null que pasan el filtro:");
      problemProjects.forEach(p => {
        console.log(`   - ${p.titulo}: mostrarEnPortafolio = ${p.mostrarEnPortafolio}`);
        console.log(`     🔍 ${p.mostrarEnPortafolio} !== false = ${p.mostrarEnPortafolio !== false}`);
      });
    } else {
      console.log("✅ No hay proyectos con valores problemáticos");
    }
    
  } catch (error) {
    console.error("❌ Error en debug:", error);
  }
}

// Ejecutar el script
debugPortafolio().then(() => {
  console.log("\n✅ Debug completado");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en el debug:", error);
  process.exit(1);
});
