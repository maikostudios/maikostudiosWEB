// Script para probar el nuevo prompt optimizado de RRHH técnico
const fs = require('fs')

// Configuración de Gemini
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
const API_KEY = "AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU"

async function generarCV(promptCombinado) {
  const body = {
    contents: [
      { role: "user", parts: [{ text: promptCombinado }] }
    ]
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("Error de Gemini:", error)
    throw new Error(error.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  return respuesta
}

async function probarNuevoPrompt() {
  console.log('🚀 PROBANDO NUEVO PROMPT OPTIMIZADO PARA RRHH TÉCNICO\n')
  console.log('=' .repeat(80))

  // NUEVO PROMPT SISTEMA (RRHH Técnico)
  const promptSystem = `Eres MaikoCV, un agente experto en Recursos Humanos del sector TI y Generación de CVs Profesionales para Michael Esteban Sáez Contreras.

📌 Tu objetivo es generar un CV completamente personalizado, optimizado para superar filtros automatizados (ATS) y ser atractivo para reclutadores técnicos y no técnicos del área TI.

🎯 ESTRUCTURA DE TRABAJO:

1. Recibirás:
   - Una plantilla HTML con variables tipo {{variable}} que **NO debes modificar en estructura ni diseño**.
   - Datos personales, profesionales, técnicos y académicos del candidato en formato JSON.
   - Una posible descripción de oferta laboral o puesto objetivo.

2. Analiza cuidadosamente:
   - Las coincidencias entre habilidades, experiencia y lo que solicita el puesto.
   - Qué información puede ser omitida si no aporta al perfil buscado.
   - Cómo mejorar la redacción para destacar logros, impacto, tecnologías, resultados y métricas concretas.

3. Adaptación del contenido:
   - Reordena, resalta o personaliza la información **respetando la plantilla HTML**.
   - Omite experiencias o cursos no alineados al rol, a menos que puedas reformularlos para añadir valor.
   - Redacta en español profesional y neutro.
   - Ordena cronológicamente de lo más reciente a lo más antiguo.

4. Validación final (Autoevaluación):
   - Antes de entregar el HTML, realiza una evaluación interna:
     - ¿Es coherente y relevante el contenido?
     - ¿Refleja un perfil técnico moderno y competitivo?
     - ¿Está adaptado al puesto objetivo?
     - ¿Contiene suficientes palabras clave técnicas para sistemas ATS?
     - ¿Tiene un nivel profesional "10 de 10"?

   - Si alguna de las respuestas es "no", vuelve a optimizar el contenido **hasta que todas las respuestas sean afirmativas**.

⚠️ REGLAS OBLIGATORIAS:
- No modifiques el layout, clases CSS, etiquetas HTML ni la semántica.
- No generes texto fuera del HTML (no uses Markdown, JSON ni explicaciones).
- Devuelve exclusivamente el HTML con las variables reemplazadas.

💡 TU MISIÓN:
Entregar un CV altamente profesional, adaptado y atractivo tanto para filtros automáticos (ATS) como para reclutadores humanos en tecnología, utilizando al máximo los datos proporcionados y tu experiencia en el área de RRHH técnico.`

  // PLANTILLA HTML
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

  // DATOS JSON COMPLETOS
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
    "habilidades_blandas": "Liderazgo de equipos, Comunicación efectiva, Resolución de problemas, Adaptabilidad, Trabajo en equipo, Mentoría técnica"
  }

  // NUEVO PROMPT USUARIO (Optimizado)
  const userPrompt = "CV optimizado para Tech Lead en startup tecnológica, destacar Vue.js, liderazgo técnico y experiencia en mentoría"

  const promptUser = `📄 PLANTILLA HTML MAESTRA (NO MODIFICAR ESTRUCTURA):
La siguiente plantilla contiene variables {{variable}} que debes reemplazar con los datos del JSON:

${plantillaHTML}

👤 DATOS DEL CANDIDATO (FUENTE: Firebase Database):
Utiliza estos datos reales para reemplazar las variables {{}} en la plantilla:

${JSON.stringify(datosJSON, null, 2)}

🔍 VARIABLES A REEMPLAZAR:
- {{nombre_completo}} → Usar campo "nombre_completo" del JSON
- {{cargo_principal}} → Usar campo "cargo_principal" del JSON  
- {{email}} → Usar campo "email" del JSON
- {{telefono}} → Usar campo "telefono" del JSON
- {{ubicacion}} → Usar campo "ubicacion" del JSON
- {{linkedin}} → Usar campo "linkedin" del JSON
- {{perfil_profesional}} → Usar campo "perfil_profesional" del JSON
- {{experiencia_profesional}} → Convertir array "experiencia_profesional" a HTML estructurado
- {{educacion}} → Convertir array "educacion" a HTML estructurado
- {{habilidades_tecnicas}} → Convertir objeto "habilidades_tecnicas" a HTML organizado por categorías
- {{habilidades_blandas}} → Usar campo "habilidades_blandas" del JSON
- {{idiomas}} → Convertir array "idiomas" a formato legible

⚙️ INSTRUCCIONES ESPECÍFICAS:
1. Para arrays (experiencia, educación): Crea HTML con estructura <div class="entry"> para cada elemento
2. Para habilidades técnicas: Organiza por categorías (Frontend, Backend, Databases, etc.)
3. Mantén colores exactos: header #121212, títulos #00cccc, footer #f0f0f0
4. Ordena cronológicamente de más reciente a más antiguo
5. Optimiza descripciones para ATS con palabras clave técnicas
6. Devuelve SOLO el HTML final, sin explicaciones

🎯 PERSONALIZACIÓN PARA PUESTO ESPECÍFICO:
"${userPrompt}"

Aplica esta personalización:
- Destaca habilidades y experiencias relevantes al puesto
- Ajusta descripciones para incluir palabras clave del sector
- Reordena información por relevancia al rol objetivo
- Mantén estructura HTML base intacta

✅ RESULTADO ESPERADO:
HTML completo con todas las variables {{}} reemplazadas, optimizado para ATS y reclutadores técnicos, listo para renderizar o convertir a PDF.`

  // PROMPT COMBINADO
  const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`

  console.log('📊 ESTADÍSTICAS DEL NUEVO PROMPT:')
  console.log(`🔤 Longitud prompt sistema: ${promptSystem.length} caracteres`)
  console.log(`🔤 Longitud prompt usuario: ${promptUser.length} caracteres`)
  console.log(`🔤 Longitud prompt combinado: ${promptCombinado.length} caracteres`)
  console.log(`🎯 Personalización: "${userPrompt}"`)

  try {
    console.log('\n🤖 Generando CV con nuevo prompt optimizado...')
    
    const htmlGenerado = await generarCV(promptCombinado)

    console.log('\n✅ CV generado exitosamente!')
    console.log(`📏 Longitud HTML: ${htmlGenerado.length} caracteres`)
    
    // Guardar el HTML generado
    fs.writeFileSync('cv-nuevo-prompt-test.html', htmlGenerado)
    console.log('💾 CV guardado como: cv-nuevo-prompt-test.html')

    // Guardar el prompt completo para análisis
    fs.writeFileSync('nuevo-prompt-completo.txt', promptCombinado)
    console.log('💾 Prompt guardado como: nuevo-prompt-completo.txt')

    console.log('\n🎯 MEJORAS DEL NUEVO PROMPT:')
    console.log('✅ Enfoque en RRHH técnico y ATS')
    console.log('✅ Instrucciones específicas para variables')
    console.log('✅ Validación interna con autoevaluación')
    console.log('✅ Optimización para palabras clave técnicas')
    console.log('✅ Personalización orientada a puesto específico')

    return true

  } catch (error) {
    console.error('\n❌ Error generando CV:')
    console.error('Message:', error.message)
    return false
  }
}

// Verificar si fetch está disponible
async function main() {
  if (typeof fetch === 'undefined') {
    const { default: fetch } = await import('node-fetch')
    global.fetch = fetch
  }

  await probarNuevoPrompt()
  console.log('\n✅ Prueba del nuevo prompt completada')
}

main().catch(console.error)
