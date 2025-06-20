// Script para verificar datos en Firebase Database
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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

async function verificarColecciones() {
  console.log("🔍 Verificando colecciones en Firebase Database...\n");

  const colecciones = [
    "perfil_candidato",
    "plantillas",
    "plantilla_cv_maiko",
    "mensajes_contacto",
    "solicitudes_cv",
    "reclutadores_interesados",
    "visitas"
  ];

  for (const nombreColeccion of colecciones) {
    try {
      console.log(`📁 Colección: ${nombreColeccion}`);
      const snapshot = await getDocs(collection(db, nombreColeccion));
      
      if (snapshot.empty) {
        console.log(`   ❌ Vacía (${snapshot.size} documentos)\n`);
      } else {
        console.log(`   ✅ ${snapshot.size} documento(s) encontrado(s)`);
        
        // Mostrar estructura de los primeros documentos
        snapshot.docs.slice(0, 2).forEach((doc, index) => {
          console.log(`   📄 Documento ${index + 1} (ID: ${doc.id}):`);
          const data = doc.data();
          const keys = Object.keys(data);
          console.log(`      Campos: ${keys.join(', ')}`);
          
          // Mostrar algunos valores de ejemplo
          keys.slice(0, 3).forEach(key => {
            const value = data[key];
            const preview = typeof value === 'string' && value.length > 50 
              ? value.substring(0, 50) + '...' 
              : value;
            console.log(`      ${key}: ${JSON.stringify(preview)}`);
          });
        });
        console.log("");
      }
    } catch (error) {
      console.log(`   ❌ Error al acceder: ${error.message}\n`);
    }
  }
}

async function verificarPerfilCandidato() {
  console.log("👤 Verificando perfil del candidato específicamente...\n");
  
  try {
    const q = query(collection(db, "perfil_candidato"), where("activo", "==", true));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("❌ No se encontró perfil activo del candidato");
      console.log("💡 Sugerencia: Crear documento en colección 'perfil_candidato' con campo 'activo: true'");
    } else {
      console.log("✅ Perfil del candidato encontrado:");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`   ID: ${doc.id}`);
        console.log(`   Nombre: ${data.nombre_completo || 'No definido'}`);
        console.log(`   Email: ${data.email || 'No definido'}`);
        console.log(`   Cargo: ${data.cargo_principal || 'No definido'}`);
        console.log(`   Experiencia: ${data.experiencia_profesional?.length || 0} trabajos`);
        console.log(`   Habilidades: ${data.habilidades_tecnicas ? 'Definidas' : 'No definidas'}`);
      });
    }
  } catch (error) {
    console.error("❌ Error al verificar perfil:", error.message);
  }
  
  console.log("");
}

async function verificarPlantillas() {
  console.log("📄 Verificando plantillas de CV...\n");
  
  const coleccionesPlantillas = ["plantillas", "plantilla_cv_maiko"];
  
  for (const coleccion of coleccionesPlantillas) {
    try {
      const snapshot = await getDocs(collection(db, coleccion));
      
      if (snapshot.empty) {
        console.log(`❌ Colección '${coleccion}' vacía`);
      } else {
        console.log(`✅ Colección '${coleccion}' - ${snapshot.size} documento(s):`);
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`   📄 ID: ${doc.id}`);
          if (data.plantilla_cv_maiko) {
            console.log(`      Plantilla HTML: ${data.plantilla_cv_maiko.length} caracteres`);
          }
          if (data.html) {
            console.log(`      HTML: ${data.html.length} caracteres`);
          }
          console.log(`      Campos: ${Object.keys(data).join(', ')}`);
        });
      }
    } catch (error) {
      console.log(`❌ Error en colección '${coleccion}': ${error.message}`);
    }
  }
  
  console.log("");
}

// Ejecutar verificaciones
async function main() {
  console.log("🚀 Iniciando verificación de Firebase Database\n");
  console.log("📊 Proyecto: maikostudios-dev");
  console.log("🔗 URL: https://console.firebase.google.com/project/maikostudios-dev/firestore\n");
  
  await verificarColecciones();
  await verificarPerfilCandidato();
  await verificarPlantillas();
  
  console.log("✅ Verificación completada");
  process.exit(0);
}

main().catch(console.error);
