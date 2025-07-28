// Script para actualizar la plantilla en Firebase con los nuevos estilos CSS
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBJqBqXqBqXqBqXqBqXqBqXqBqXqBqXqBq",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqr"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Nueva plantilla HTML con estilos corregidos
const nuevaPlantillaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; }
    h1, h2, h3, h4, h5, h6 { color: #000; margin-bottom: 10px; }
    h2 { color: #00cccc; margin-bottom: 10px; }
    h3 { color: #000; font-size: 16px; font-weight: bold; margin-bottom: 8px; margin-top: 15px; }
    .entry { margin-bottom: 15px; }
    .entry-title { font-weight: bold; color: #000; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; }
    p { color: #000; }
    a { color: #00cccc; text-decoration: none; }
    header a { color: white; }
  </style>
</head>
<body>
  <header>
    <h1>{{nombre_completo}}</h1>
    <div class="sub-header">{{cargo_principal}}</div>
    <div class="sub-header">{{email}} | {{telefono}} | <a href="{{linkedin}}" style="color:white;">LinkedIn</a></div>
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

async function actualizarPlantilla() {
  console.log('🔄 Actualizando plantilla en Firebase con estilos corregidos...\n');

  try {
    // Buscar plantilla activa
    const q = query(
      collection(db, "plantillas"),
      where("activa", "==", true),
      where("tipo", "==", "cv_profesional")
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ No se encontró plantilla activa');
      return;
    }

    // Actualizar cada documento encontrado
    for (const docSnapshot of snapshot.docs) {
      const docRef = doc(db, "plantillas", docSnapshot.id);
      
      await updateDoc(docRef, {
        plantilla_cv_maiko: nuevaPlantillaHTML,
        fecha_actualizacion: new Date().toISOString(),
        version: "1.1",
        descripcion: "Plantilla con estilos CSS corregidos para evitar texto gris en PDF"
      });
      
      console.log(`✅ Plantilla actualizada: ${docSnapshot.id}`);
      console.log(`📄 Longitud HTML: ${nuevaPlantillaHTML.length} caracteres`);
    }

    console.log('\n🎯 CAMBIOS APLICADOS:');
    console.log('✅ Agregado: h1, h2, h3, h4, h5, h6 { color: #000; }');
    console.log('✅ Agregado: h3 { color: #000; font-size: 16px; font-weight: bold; }');
    console.log('✅ Agregado: .entry-title { color: #000; }');
    console.log('✅ Agregado: p { color: #000; }');
    console.log('✅ Agregado: a { color: #00cccc; }');
    console.log('✅ Agregado: header a { color: white; }');

    console.log('\n🎉 Plantilla actualizada exitosamente!');
    console.log('💡 Ahora todos los textos serán negros en el PDF');

  } catch (error) {
    console.error('❌ Error al actualizar plantilla:', error);
  }
}

// Ejecutar actualización
actualizarPlantilla();
