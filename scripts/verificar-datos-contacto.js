/**
 * Script para verificar y corregir datos de contacto en Firebase
 * Busca y corrige:
 * - m.saezc@maikostudioscom (sin punto)
 * - DesarrolladorFull Stack (sin espacio)
 * - Temucą (con ą)
 * - Footer con errores
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

// Configuración de Firebase (desarrollo)
const firebaseConfig = {
  apiKey: "AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verificarYCorregirDatos() {
  console.log('🔍 VERIFICANDO DATOS DE CONTACTO EN FIREBASE...\n');

  // 1. Verificar colección perfil_candidato
  console.log('👤 1. VERIFICANDO PERFIL_CANDIDATO:');
  try {
    const perfilSnapshot = await getDocs(collection(db, 'perfil_candidato'));
    
    if (perfilSnapshot.empty) {
      console.log('❌ Colección perfil_candidato vacía');
    } else {
      for (const docSnapshot of perfilSnapshot.docs) {
        const data = docSnapshot.data();
        console.log(`📄 Documento: ${docSnapshot.id}`);
        console.log(`   Email: ${data.email || 'No definido'}`);
        console.log(`   Cargo: ${data.cargo_principal || 'No definido'}`);
        console.log(`   Ubicación: ${data.ubicacion || 'No definido'}`);
        
        // Verificar errores
        let necesitaCorreccion = false;
        const correcciones = {};
        
        if (data.email && data.email.includes('maikostudioscom')) {
          console.log('   ❌ Email sin punto detectado');
          correcciones.email = data.email.replace('maikostudioscom', 'maikostudios.com');
          necesitaCorreccion = true;
        }
        
        if (data.cargo_principal && data.cargo_principal.includes('DesarrolladorFull Stack')) {
          console.log('   ❌ Cargo sin espacio detectado');
          correcciones.cargo_principal = data.cargo_principal.replace('DesarrolladorFull Stack', 'Desarrollador Full Stack');
          necesitaCorreccion = true;
        }
        
        if (data.ubicacion && data.ubicacion.includes('Temucą')) {
          console.log('   ❌ Ubicación con ą detectada');
          correcciones.ubicacion = data.ubicacion.replace('Temucą', 'Temuco');
          necesitaCorreccion = true;
        }
        
        if (necesitaCorreccion) {
          console.log('   🔧 Aplicando correcciones...');
          const docRef = doc(db, 'perfil_candidato', docSnapshot.id);
          await updateDoc(docRef, correcciones);
          console.log('   ✅ Correcciones aplicadas');
        } else {
          console.log('   ✅ Datos correctos');
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error en perfil_candidato: ${error.message}`);
  }

  console.log('\n📄 2. VERIFICANDO PLANTILLAS:');
  try {
    const plantillasSnapshot = await getDocs(collection(db, 'plantillas'));
    
    if (plantillasSnapshot.empty) {
      console.log('❌ Colección plantillas vacía');
    } else {
      for (const docSnapshot of plantillasSnapshot.docs) {
        const data = docSnapshot.data();
        console.log(`📄 Documento: ${docSnapshot.id}`);
        
        if (data.plantilla_cv_maiko) {
          const plantilla = data.plantilla_cv_maiko;
          
          // Verificar errores en plantilla
          let necesitaCorreccion = false;
          let plantillaCorregida = plantilla;
          
          if (plantilla.includes('maikostudioscom')) {
            console.log('   ❌ Email sin punto en plantilla detectado');
            plantillaCorregida = plantillaCorregida.replace(/maikostudioscom/g, 'maikostudios.com');
            necesitaCorreccion = true;
          }
          
          if (plantilla.includes('DesarrolladorFull Stack')) {
            console.log('   ❌ Cargo sin espacio en plantilla detectado');
            plantillaCorregida = plantillaCorregida.replace(/DesarrolladorFull Stack/g, 'Desarrollador Full Stack');
            necesitaCorreccion = true;
          }
          
          if (plantilla.includes('Temucą')) {
            console.log('   ❌ Ubicación con ą en plantilla detectada');
            plantillaCorregida = plantillaCorregida.replace(/Temucą/g, 'Temuco');
            necesitaCorreccion = true;
          }
          
          // Verificar footer específico
          if (plantilla.includes('Contacto: m.saezc@maikostudioscom | LinkedIn| maikostudioscom')) {
            console.log('   ❌ Footer con errores detectado');
            plantillaCorregida = plantillaCorregida.replace(
              'Contacto: m.saezc@maikostudioscom | LinkedIn| maikostudioscom',
              'Contacto: m.saezc@maikostudios.com | LinkedIn| maikostudios.com'
            );
            necesitaCorreccion = true;
          }
          
          if (necesitaCorreccion) {
            console.log('   🔧 Aplicando correcciones a plantilla...');
            const docRef = doc(db, 'plantillas', docSnapshot.id);
            await updateDoc(docRef, {
              plantilla_cv_maiko: plantillaCorregida,
              fecha_actualizacion: new Date().toISOString(),
              version: "1.3",
              descripcion: "Plantilla con datos de contacto corregidos"
            });
            console.log('   ✅ Plantilla corregida');
          } else {
            console.log('   ✅ Plantilla correcta');
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error en plantillas: ${error.message}`);
  }

  console.log('\n🎉 VERIFICACIÓN COMPLETA!');
}

// Ejecutar verificación
verificarYCorregirDatos().catch(console.error);
