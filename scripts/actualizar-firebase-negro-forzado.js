// Script para actualizar Firebase con estilos negro forzados (!important)
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

// Plantilla HTML con estilos negro FORZADOS
const plantillaNegroForzado = `<!DOCTYPE html>
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
  <div class="footer">
    Contacto: <a href="mailto:{{email}}">{{email}}</a> | <a href="{{linkedin}}">LinkedIn</a>
  </div>
</body>
</html>`;

async function actualizarFirebaseNegroForzado() {
  console.log('🎨 ACTUALIZANDO FIREBASE CON ESTILOS NEGRO FORZADOS (!important)\n');
  console.log('=' .repeat(80));

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
        plantilla_cv_maiko: plantillaNegroForzado,
        fecha_actualizacion: new Date().toISOString(),
        version: "1.2",
        descripcion: "Plantilla con estilos CSS negro FORZADOS (!important) para garantizar texto negro en PDF"
      });
      
      console.log(`✅ Plantilla actualizada: ${docSnapshot.id}`);
      console.log(`📄 Longitud HTML: ${plantillaNegroForzado.length} caracteres`);
    }

    console.log('\n🎯 ESTILOS FORZADOS APLICADOS:');
    console.log('✅ body { color: #000 !important; }');
    console.log('✅ section { color: #000 !important; }');
    console.log('✅ h1, h2, h3, h4, h5, h6 { color: #000 !important; }');
    console.log('✅ .entry { color: #000 !important; }');
    console.log('✅ .entry-title { color: #000 !important; }');
    console.log('✅ .entry-subtitle { color: #000 !important; }');
    console.log('✅ .footer { color: #000 !important; }');
    console.log('✅ p { color: #000 !important; }');
    console.log('✅ div { color: #000 !important; }');
    console.log('✅ span { color: #000 !important; }');
    console.log('✅ * { color: #000 !important; } - SELECTOR UNIVERSAL');

    console.log('\n🔧 EXCEPCIONES PARA HEADER:');
    console.log('✅ header *, header h1, header .sub-header { color: white !important; }');
    console.log('✅ h2 { color: #00cccc !important; } - Títulos turquesa');

    console.log('\n🎉 Firebase actualizado exitosamente!');
    console.log('💡 Ahora TODOS los textos serán negros en el PDF');
    console.log('🚀 Listo para probar en la aplicación');

  } catch (error) {
    console.error('❌ Error al actualizar Firebase:', error);
  }
}

// Ejecutar actualización
actualizarFirebaseNegroForzado();
