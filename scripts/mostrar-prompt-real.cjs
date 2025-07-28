// Script para mostrar el prompt EXACTO que se envía a Gemini
const fs = require('fs')

function mostrarPromptReal() {
  console.log('🎯 PROMPT EXACTO ENVIADO A GEMINI 1.5 FLASH')
  console.log('=' .repeat(80))
  console.log('📡 Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent')
  console.log('🔑 API Key: AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU')
  console.log('📦 Método: POST')
  console.log('📋 Content-Type: application/json\n')

  // PROMPT DEL SISTEMA
  const promptSystem = `Eres MaikoCV, un agente experto en generación de CVs personalizados para Michael Esteban Sáez Contreras.

Tu tarea es reemplazar únicamente los datos dinámicos dentro de una plantilla HTML predefinida, sin alterar la estructura, diseño, clases ni estilos inline. La plantilla base ya tiene la disposición visual, colores, tipografía y layout deseados.

⚠️ IMPORTANTE:
- No inventes secciones ni reestructures el HTML.
- No agregues estilos nuevos, emojis adicionales ni cambios en las etiquetas existentes.
- No modifiques los nombres de clases ni IDs en el HTML.
- Solo reemplaza los contenidos internos entre etiquetas (ej: \`<p>\`, \`<li>\`, \`<h2>\`, etc.) con la nueva información del candidato.

FORMATO DE RESPUESTA:
Devuelve exclusivamente el HTML completo y corregido, sin explicaciones.`

  // PLANTILLA HTML (la que está en Firebase)
  const plantillaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; }
    h2 { color: #00cccc; margin-bottom: 10px; }
    .entry { margin-bottom: 15px; }
    .entry-title { font-weight: bold; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; }
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
</html>`

  // DATOS JSON (los que están en Firebase)
  const datosJSON = {
    "nombre_completo": "Michael Esteban Sáez Contreras",
    "cargo_principal": "Desarrollador Full Stack",
    "email": "m.saezc@maikostudios.com",
    "telefono": "+56983833148",
    "ubicacion": "Temuco, IX Región, Chile",
    "linkedin": "https://www.linkedin.com/in/me-saezc/",
    "web": "https://maikostudios.com/",
    "perfil_profesional": "Desarrollador Full Stack con experiencia en Vue.js, Node.js y Firebase. Especializado en crear soluciones web completas y escalables.",
    "experiencia_profesional": [
      {
        "cargo": "Fundador y Desarrollador",
        "empresa": "Maiko Studios",
        "periodo": "2024 - Actualidad",
        "descripcion": "Creación de plataformas como DeUna Transferencias, automatizaciones con IA, digitalización para PYMEs y asesorías tecnológicas."
      },
      {
        "cargo": "Facilitador/Docente Bootcamp Front End",
        "empresa": "Desafío Latam",
        "periodo": "Ago 2024 – Dic 2024",
        "descripcion": "Enseñanza de HTML, CSS, BOOTSTRAP, JAVASCRIPT, y VUE JS en el Programa Talento Digital para Chile."
      },
      {
        "cargo": "Developer Full Stack & Soporte TI",
        "empresa": "Tata Consultancy Services – Metlife Chile",
        "periodo": "Jul 2021 – Dic 2023",
        "descripcion": "Desarrollos para área Direct Marketing. Soporte a aplicaciones y resolución de tickets."
      }
    ],
    "habilidades_tecnicas": {
      "lenguajes": ["JavaScript", "Python", "Java", "HTML", "CSS"],
      "frontend": ["Vue.js", "React", "Angular", "Bootstrap", "Vuetify"],
      "backend": ["Node.js", "Express.js", "Spring Boot", "FastAPI"],
      "databases": ["PostgreSQL", "MongoDB", "Firebase", "MySQL"],
      "cloud": ["Firebase", "AWS", "Google Cloud"],
      "tools": ["Git", "Docker", "VS Code", "Figma"]
    },
    "educacion": [
      {
        "titulo": "Ingeniería en Informática",
        "institucion": "Universidad Católica de Temuco",
        "periodo": "2017-2021"
      },
      {
        "titulo": "Técnico en Programación",
        "institucion": "Instituto AIEP",
        "periodo": "2015-2017"
      }
    ],
    "idiomas": [
      { "idioma": "Español", "nivel": "Nativo" },
      { "idioma": "Inglés", "nivel": "Intermedio" }
    ],
    "habilidades_blandas": "Liderazgo de equipos, Comunicación efectiva, Resolución de problemas, Adaptabilidad, Trabajo en equipo, Mentoría técnica",
    "activo": true
  }

  // PERSONALIZACIÓN DEL USUARIO
  const userPrompt = "CV para desarrollador Full Stack, destacar Vue.js y experiencia en startups"

  // PROMPT DEL USUARIO
  const promptUser = `Este es el contenido de la plantilla HTML maestra para el CV (estructura visual que debes respetar):

${plantillaHTML}

Estos son los nuevos datos del candidato en formato JSON que debes usar para reemplazar el contenido de la plantilla:

${JSON.stringify(datosJSON, null, 2)}

⚙️ Tu tarea:
1. Sustituye los textos del CV con la nueva información.
2. Mantén todos los estilos CSS inline y estructura HTML exactamente igual.
3. Respeta el orden, formato, títulos, colores y layout.
4. Usa los datos del JSON de forma precisa. Si hay campos faltantes, deja el contenido actual tal cual.
5. Devuelve el HTML final reemplazado, sin comentarios ni explicaciones.

📝 PERSONALIZACIÓN ADICIONAL SOLICITADA:
"${userPrompt}"

Aplica esta personalización manteniendo la estructura HTML base.

Cuando termines, el resultado debe ser un CV listo para renderizarse como HTML o exportarse como PDF.`

  // PROMPT COMBINADO (como se envía a Gemini)
  const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`

  // BODY DE LA REQUEST
  const requestBody = {
    contents: [
      { role: "user", parts: [{ text: promptCombinado }] }
    ]
  }

  console.log('📨 CUERPO DE LA REQUEST (JSON):')
  console.log('-'.repeat(80))
  console.log(JSON.stringify(requestBody, null, 2))
  
  console.log('\n📏 ESTADÍSTICAS DEL PROMPT:')
  console.log('-'.repeat(80))
  console.log(`🔤 Longitud prompt sistema: ${promptSystem.length} caracteres`)
  console.log(`🔤 Longitud prompt usuario: ${promptUser.length} caracteres`)
  console.log(`🔤 Longitud prompt combinado: ${promptCombinado.length} caracteres`)
  console.log(`📊 Longitud JSON datos: ${JSON.stringify(datosJSON).length} caracteres`)
  console.log(`📄 Longitud plantilla HTML: ${plantillaHTML.length} caracteres`)
  console.log(`🎨 Personalización: "${userPrompt}"`)

  console.log('\n🔍 VARIABLES EN LA PLANTILLA:')
  console.log('-'.repeat(80))
  const variables = plantillaHTML.match(/\{\{([^}]+)\}\}/g)
  variables.forEach((variable, index) => {
    console.log(`${index + 1}. ${variable}`)
  })

  console.log('\n💾 GUARDANDO PROMPT COMPLETO...')
  fs.writeFileSync('prompt-completo-gemini.txt', promptCombinado)
  fs.writeFileSync('request-body-gemini.json', JSON.stringify(requestBody, null, 2))
  console.log('✅ Archivos guardados:')
  console.log('   - prompt-completo-gemini.txt (prompt completo)')
  console.log('   - request-body-gemini.json (cuerpo de la request)')

  console.log('\n🎯 RESUMEN:')
  console.log('=' .repeat(80))
  console.log('1. 📄 Plantilla HTML con 15 variables {{}} desde Firebase')
  console.log('2. 👤 Datos completos de Michael desde Firebase (15 campos)')
  console.log('3. 🤖 Prompt sistema define comportamiento MaikoCV')
  console.log('4. 👨‍💻 Prompt usuario incluye plantilla + datos + personalización')
  console.log('5. 🔗 Se combinan (Gemini no soporta rol system)')
  console.log('6. 📡 Se envía a Gemini 1.5 Flash')
  console.log('7. ✨ Gemini devuelve HTML con variables reemplazadas')
  console.log('8. 📱 Usuario descarga PDF del CV personalizado')

  console.log('\n✅ ANÁLISIS COMPLETO DEL PROMPT REAL')
}

// Ejecutar
mostrarPromptReal()
