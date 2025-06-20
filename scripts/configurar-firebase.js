// Script para configurar datos faltantes en Firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
} from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Template HTML del CV tipo
const templateHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000 !important; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; color: white; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; color: #000 !important; }
    h1, h2, h3, h4, h5, h6 { color: #000 !important; margin-bottom: 10px; }
    h2 { color: #00cccc !important; margin-bottom: 10px; }
    h3 { color: #000 !important; font-size: 16px; font-weight: bold; margin-bottom: 8px; margin-top: 15px; }
    .entry { margin-bottom: 15px; color: #000 !important; }
    .entry-title { font-weight: bold; color: #000 !important; }
    .entry-subtitle { color: #000 !important; font-style: italic; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; color: #000 !important; }
    p { color: #000 !important; }
    div { color: #000 !important; }
    span { color: #000 !important; }
    a { color: #00cccc; text-decoration: none; }
    header a { color: white !important; }
    * { color: #000 !important; }
    header *, header h1, header .sub-header { color: white !important; }
    h2 { color: #00cccc !important; }
  </style>
</head>
<body>
  <header>
    <h1>{{nombre_completo}}</h1>
    <div class="sub-header">{{cargo_principal}}</div>
    <div class="sub-header">{{email}} | {{telefono}} | <a href="{{linkedin}}" style="color:white;">LinkedIn</a> | <a href="{{web}}" style="color:white;">maikostudios.com</a></div>
    <div class="sub-header">{{ubicacion}}</div>
  </header>
  <div class="divider"></div>

  <section>
    <h2>Perfil Profesional</h2>
    <p>{{perfil_profesional}}</p>
  </section>

  <section>
    <h2>Experiencia Profesional</h2>
    {{experiencia_profesional}}
  </section>

  <section>
    <h2>Educación</h2>
    {{educacion}}
  </section>

  <section>
    <h2>Certificaciones</h2>
    <p>{{certificaciones}}</p>
  </section>

  <section>
    <h2>Habilidades Técnicas</h2>
    {{habilidades_tecnicas}}
  </section>

  <section>
    <h2>Habilidades Blandas</h2>
    <p>{{habilidades_blandas}}</p>
  </section>

  <section>
    <h2>Idiomas</h2>
    <p>{{idiomas}}</p>
  </section>

  <section>
    <h2>Información Adicional</h2>
    <p>{{info_adicional}}</p>
  </section>

  <div class="footer">
    Contacto: <a href="mailto:{{email}}">{{email}}</a> | <a href="{{linkedin}}">LinkedIn</a> | <a href="{{web}}">maikostudios.com</a>
  </div>
</body>
</html>`;

async function arreglarPerfilCandidato() {
  console.log("👤 Agregando campo 'activo: true' al perfil del candidato...");

  try {
    const perfilRef = doc(db, "perfil_candidato", "michael_saez");
    await updateDoc(perfilRef, {
      activo: true,
      fecha_actualizacion: new Date(),
    });
    console.log("✅ Perfil del candidato actualizado correctamente");
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error.message);
  }
}

async function guardarPlantillaCV() {
  console.log("📄 Guardando plantilla HTML del CV en Firebase...");

  try {
    const plantillaData = {
      nombre: "cv_michael_saez_completo",
      tipo: "cv_profesional",
      plantilla_cv_maiko: templateHTML,
      descripcion:
        "Plantilla oficial del CV de Michael Sáez con estructura exacta",
      version: "1.0",
      activa: true,
      fecha_creacion: new Date(),
      campos_variables: [
        "nombre_completo",
        "cargo_principal",
        "email",
        "telefono",
        "linkedin",
        "web",
        "ubicacion",
        "perfil_profesional",
        "experiencia_profesional",
        "educacion",
        "certificaciones",
        "habilidades_tecnicas",
        "habilidades_blandas",
        "idiomas",
        "info_adicional",
      ],
    };

    const docRef = await addDoc(collection(db, "plantillas"), plantillaData);
    console.log("✅ Plantilla guardada con ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error al guardar plantilla:", error.message);
  }
}

async function main() {
  console.log("🔧 Configurando datos faltantes en Firebase...\n");

  await arreglarPerfilCandidato();
  console.log("");
  await guardarPlantillaCV();

  console.log("\n✅ Configuración completada");
  console.log(
    "🔗 Verificar en: https://console.firebase.google.com/project/maikostudios-dev/firestore"
  );

  process.exit(0);
}

main().catch(console.error);
