// Script para verificar proyectos en Firestore
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

async function verificarProyectos() {
  try {
    console.log("🔍 Verificando proyectos en Firestore...\n");
    
    const proyectosRef = collection(db, "proyectos");
    const q = query(proyectosRef, orderBy("fechaCreacion", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("❌ No hay proyectos en Firestore");
      return;
    }
    
    console.log(`📊 Total de proyectos encontrados: ${snapshot.size}\n`);
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. 📁 ${data.titulo}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   🔗 Demo: ${data.enlaceDemo || 'No definido'}`);
      console.log(`   🐙 GitHub: ${data.enlaceGithub || 'No definido'}`);
      console.log(`   ⭐ Estrella: ${data.esEstrella ? 'Sí' : 'No'}`);
      console.log(`   🏠 Home: ${data.mostrarEnHome ? 'Sí' : 'No'}`);
      console.log(`   ✅ Activo: ${data.activo ? 'Sí' : 'No'}`);
      console.log(`   📅 Creado: ${data.fechaCreacion?.toDate?.() || 'No definido'}`);
      console.log('');
    });
    
    // Verificar específicamente Delicias Tía Jovy
    const deliciasProyectos = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.titulo.toLowerCase().includes('delicias') || data.titulo.toLowerCase().includes('jovy')) {
        deliciasProyectos.push({ id: doc.id, ...data });
      }
    });
    
    if (deliciasProyectos.length > 0) {
      console.log("🍽️ PROYECTOS DELICIAS TÍA JOVY ENCONTRADOS:");
      deliciasProyectos.forEach((proyecto, index) => {
        console.log(`\n${index + 1}. ${proyecto.titulo}`);
        console.log(`   🔗 Enlace Demo: ${proyecto.enlaceDemo}`);
        console.log(`   ✅ Enlace correcto: ${proyecto.enlaceDemo === 'https://deliciastiajovy.cl' ? 'SÍ' : 'NO'}`);
        console.log(`   ⭐ Es estrella: ${proyecto.esEstrella ? 'SÍ' : 'NO'}`);
        console.log(`   🏠 Mostrar en Home: ${proyecto.mostrarEnHome ? 'SÍ' : 'NO'}`);
      });
    } else {
      console.log("❌ No se encontró proyecto Delicias Tía Jovy");
    }
    
    // Resumen
    const proyectosEstrella = [];
    const proyectosHome = [];
    const proyectosActivos = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.esEstrella) proyectosEstrella.push(data.titulo);
      if (data.mostrarEnHome) proyectosHome.push(data.titulo);
      if (data.activo) proyectosActivos.push(data.titulo);
    });
    
    console.log("\n📈 RESUMEN:");
    console.log(`   ⭐ Proyectos estrella (${proyectosEstrella.length}): ${proyectosEstrella.join(', ')}`);
    console.log(`   🏠 Proyectos en Home (${proyectosHome.length}): ${proyectosHome.join(', ')}`);
    console.log(`   ✅ Proyectos activos: ${proyectosActivos.length}/${snapshot.size}`);
    
  } catch (error) {
    console.error("❌ Error al verificar proyectos:", error);
  }
}

// Ejecutar el script
verificarProyectos().then(() => {
  console.log("\n✅ Verificación completada");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en la verificación:", error);
  process.exit(1);
});
