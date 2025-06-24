/**
 * Script para probar el prompt corregido de Gemini
 * Verifica que genere el formato correcto de contacto
 */

import fs from 'fs';

// Configuración de Gemini
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU";

// Plantilla HTML de prueba
const plantillaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000 !important; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; color: white; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; color: #000 !important; }
    h2 { color: #00cccc !important; margin-bottom: 10px; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; color: #000 !important; }
    a { color: #00cccc; text-decoration: none; }
    header a { color: white !important; }
  </style>
</head>
<body>
  <header>
    <h1>{{nombre_completo}}</h1>
    <div class="sub-header">{{cargo_principal}}</div>
    <div class="sub-header">{{email}} | {{telefono}} | <a href="{{linkedin}}" style="color:white;">LinkedIn</a></div>
    <div class="sub-header">{{ubicacion}} | <a href="{{web}}" style="color:white;">maikostudios.com</a></div>
  </header>
  <div class="divider"></div>
  <section>
    <h2>Perfil Profesional</h2>
    <p>{{perfil_profesional}}</p>
  </section>
  <div class="footer">
    Contacto: <a href="mailto:{{email}}">{{email}}</a> | <a href="{{linkedin}}">LinkedIn</a> | <a href="{{web}}">maikostudios.com</a>
  </div>
</body>
</html>`;

// Datos JSON de prueba
const datosJSON = {
  "nombre_completo": "Michael Esteban Sáez Contreras",
  "cargo_principal": "Desarrollador Full Stack",
  "email": "m.saezc@maikostudios.com",
  "telefono": "+56983833148",
  "ubicacion": "Temuco, IX Región, Chile",
  "linkedin": "https://www.linkedin.com/in/me-saezc/",
  "web": "https://maikostudios.com/",
  "perfil_profesional": "Desarrollador Full Stack con experiencia en Vue.js, Node.js y Firebase. Especializado en crear soluciones web completas y escalables."
};

// Prompt del sistema actualizado
const promptSystem = `Eres MaikoCV, un agente experto en Recursos Humanos del sector TI y Generación de CVs Profesionales para Michael Esteban Sáez Contreras.

📌 Tu objetivo es generar un CV completamente personalizado, optimizado para superar filtros automatizados (ATS) y ser atractivo para reclutadores técnicos y no técnicos del área TI.

⚠️ REGLAS OBLIGATORIAS:
- No modifiques el layout, clases CSS, etiquetas HTML ni la semántica.
- No generes texto fuera del HTML (no uses Markdown, JSON ni explicaciones).
- Devuelve exclusivamente el HTML con las variables reemplazadas.

🔧 CORRECCIONES OBLIGATORIAS DE FORMATO:
- HEADER debe mostrar: "Desarrollador Full Stack" (CON espacio, no "DesarrolladorFull Stack")
- HEADER debe mostrar: "m.saezc@maikostudios.com | +56983833148 | LinkedIn"
- HEADER debe mostrar: "Chile | maikostudios.com" (NO "Temucą IX Región Chile")
- FOOTER debe mostrar: "Contacto: m.saezc@maikostudios.com | LinkedIn | maikostudios.com"
- SIEMPRE incluir el punto en "maikostudios.com" (NUNCA "maikostudioscom")
- SIEMPRE usar "Chile" (NUNCA "Temucą" con ą)

💡 TU MISIÓN:
Entregar un CV altamente profesional con el formato de contacto EXACTO especificado arriba.`;

// Prompt del usuario
const promptUser = `📄 PLANTILLA HTML MAESTRA (NO MODIFICAR ESTRUCTURA):
La siguiente plantilla contiene variables {{variable}} que debes reemplazar con los datos del JSON:

${plantillaHTML}

👤 DATOS DEL CANDIDATO (FUENTE: Firebase Database):
Utiliza estos datos reales para reemplazar las variables {{}} en la plantilla:

${JSON.stringify(datosJSON, null, 2)}

🎯 FORMATO ESPECÍFICO REQUERIDO:
- Header línea 2: "Desarrollador Full Stack" (con espacio)
- Header línea 3: "m.saezc@maikostudios.com | +56983833148 | LinkedIn"
- Header línea 4: "Chile | maikostudios.com"
- Footer: "Contacto: m.saezc@maikostudios.com | LinkedIn | maikostudios.com"

✅ RESULTADO ESPERADO:
HTML completo con todas las variables {{}} reemplazadas y el formato de contacto EXACTO especificado.`;

async function generarCV(promptSystem, promptUser) {
  const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`;
  
  const body = {
    contents: [{ role: "user", parts: [{ text: promptCombinado }] }]
  };

  try {
    console.log('🤖 Llamando a Gemini con prompt corregido...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!respuesta) {
      throw new Error('Gemini no devolvió contenido válido');
    }

    return respuesta;
  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    throw error;
  }
}

async function probarPromptCorregido() {
  console.log('🧪 PROBANDO PROMPT CORREGIDO PARA FORMATO DE CONTACTO\n');

  try {
    const htmlGenerado = await generarCV(promptSystem, promptUser);
    
    console.log('✅ CV generado exitosamente!');
    console.log(`📏 Longitud HTML: ${htmlGenerado.length} caracteres\n`);
    
    // Guardar el HTML generado
    fs.writeFileSync('cv-formato-corregido.html', htmlGenerado);
    console.log('💾 CV guardado como: cv-formato-corregido.html\n');
    
    // Verificar formato correcto
    console.log('🔍 VERIFICANDO FORMATO:');
    
    const tieneEspacioEnCargo = htmlGenerado.includes('Desarrollador Full Stack');
    const tienePuntoEnEmail = htmlGenerado.includes('maikostudios.com');
    const noTieneEmailSinPunto = !htmlGenerado.includes('maikostudioscom');
    const noTieneCargoSinEspacio = !htmlGenerado.includes('DesarrolladorFull Stack');
    const noTieneTemucaConA = !htmlGenerado.includes('Temucą');
    const tieneChile = htmlGenerado.includes('Chile');
    
    console.log(`   ${tieneEspacioEnCargo ? '✅' : '❌'} Cargo con espacio: "Desarrollador Full Stack"`);
    console.log(`   ${tienePuntoEnEmail ? '✅' : '❌'} Email con punto: "maikostudios.com"`);
    console.log(`   ${noTieneEmailSinPunto ? '✅' : '❌'} Sin email sin punto`);
    console.log(`   ${noTieneCargoSinEspacio ? '✅' : '❌'} Sin cargo sin espacio`);
    console.log(`   ${noTieneTemucaConA ? '✅' : '❌'} Sin Temucą con ą`);
    console.log(`   ${tieneChile ? '✅' : '❌'} Contiene "Chile"`);
    
    const todosCorrecto = tieneEspacioEnCargo && tienePuntoEnEmail && noTieneEmailSinPunto && 
                         noTieneCargoSinEspacio && noTieneTemucaConA && tieneChile;
    
    console.log(`\n🎯 RESULTADO FINAL: ${todosCorrecto ? '✅ FORMATO CORRECTO' : '❌ NECESITA CORRECCIÓN'}`);
    
    if (!todosCorrecto) {
      console.log('\n🔧 PROBLEMAS DETECTADOS - Revisar prompt o datos');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar prueba
probarPromptCorregido();
