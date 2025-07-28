// Script para probar Gemini API localmente
const fs = require("fs");

// Configuración de Gemini
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";

async function generarCV(promptSystem, promptUser) {
  // Gemini no soporta rol "system", combinamos en un solo mensaje
  const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: promptCombinado }] }],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error de Gemini:", error);
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return respuesta;
}

async function probarGemini() {
  console.log("🤖 Probando conexión con Gemini API...\n");

  try {
    const promptSystem = "Eres un asistente de prueba.";
    const promptUser = "Responde solo 'OK' si puedes procesar este mensaje.";

    const respuesta = await generarCV(promptSystem, promptUser);

    console.log("✅ Conexión exitosa con Gemini!");
    console.log("📝 Respuesta:", respuesta);
    console.log("🔧 Modelo: gemini-1.5-flash");

    return true;
  } catch (error) {
    console.error("❌ Error conectando con Gemini:");
    console.error("Message:", error.message);
    return false;
  }
}

async function generarCVPrueba() {
  console.log("\n🎨 Probando generación de CV con Gemini...\n");

  const templateHTML = `<!DOCTYPE html>
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
    <div class="sub-header">{{email}} | {{telefono}}</div>
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
    <h2>Habilidades Técnicas</h2>
    {{habilidades_tecnicas}}
  </section>
  <div class="footer">
    Contacto: <a href="mailto:{{email}}">{{email}}</a>
  </div>
</body>
</html>`;

  const cvData = {
    nombre_completo: "Michael Esteban Sáez Contreras",
    cargo_principal: "Desarrollador Full Stack",
    email: "m.saezc@maikostudios.com",
    telefono: "+56983833148",
    ubicacion: "Temuco, IX Región, Chile",
    perfil_profesional:
      "Desarrollador Full Stack con experiencia en Vue.js, Node.js y Firebase",
    experiencia_profesional: [
      {
        cargo: "Fundador y Desarrollador",
        empresa: "Maiko Studios",
        periodo: "2024 - Actualidad",
        descripcion:
          "Creación de plataformas como DeUna Transferencias, automatizaciones con IA",
      },
    ],
    habilidades_tecnicas: {
      frontend: ["Vue.js", "React", "JavaScript", "HTML", "CSS"],
      backend: ["Node.js", "Express", "Python", "Java"],
      databases: ["PostgreSQL", "MongoDB", "Firebase"],
    },
  };

  const promptSystem = `Eres MaikoCV, un agente experto en generación de CVs personalizados para Michael Esteban Sáez Contreras.

Tu tarea es reemplazar únicamente los datos dinámicos dentro de una plantilla HTML predefinida, sin alterar la estructura, diseño, clases ni estilos inline. La plantilla base ya tiene la disposición visual, colores, tipografía y layout deseados.

⚠️ IMPORTANTE:
- No inventes secciones ni reestructures el HTML.
- No agregues estilos nuevos, emojis adicionales ni cambios en las etiquetas existentes.
- No modifiques los nombres de clases ni IDs en el HTML.
- Solo reemplaza los contenidos internos entre etiquetas (ej: \`<p>\`, \`<li>\`, \`<h2>\`, etc.) con la nueva información del candidato.

FORMATO DE RESPUESTA:
Devuelve exclusivamente el HTML completo y corregido, sin explicaciones.`;

  const promptUser = `Este es el contenido de la plantilla HTML maestra para el CV (estructura visual que debes respetar):

${templateHTML}

Estos son los nuevos datos del candidato en formato JSON que debes usar para reemplazar el contenido de la plantilla:

${JSON.stringify(cvData, null, 2)}

⚙️ Tu tarea:
1. Sustituye los textos del CV con la nueva información.
2. Mantén todos los estilos CSS inline y estructura HTML exactamente igual.
3. Respeta el orden, formato, títulos, colores y layout.
4. Usa los datos del JSON de forma precisa. Si hay campos faltantes, deja el contenido actual tal cual.
5. Devuelve el HTML final reemplazado, sin comentarios ni explicaciones.

Cuando termines, el resultado debe ser un CV listo para renderizarse como HTML o exportarse como PDF.`;

  try {
    const htmlGenerado = await generarCV(promptSystem, promptUser);

    console.log("✅ CV generado exitosamente!");
    console.log("📏 Longitud HTML:", htmlGenerado.length, "caracteres");
    console.log("🔧 Modelo: gemini-1.5-flash");

    // Guardar el HTML generado
    fs.writeFileSync("cv-gemini-test.html", htmlGenerado);
    console.log("💾 CV guardado como: cv-gemini-test.html");

    return true;
  } catch (error) {
    console.error("❌ Error generando CV:");
    console.error("Message:", error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Iniciando pruebas de Gemini API\n");
  console.log("🔑 API Key configurada:", API_KEY.substring(0, 20) + "...");
  console.log("🌐 Endpoint:", GEMINI_API_URL);
  console.log("🤖 Modelo: gemini-1.5-flash\n");

  // Verificar si fetch está disponible
  if (typeof fetch === "undefined") {
    console.log("⚠️ Instalando node-fetch para compatibilidad...");
    const { default: fetch } = await import("node-fetch");
    global.fetch = fetch;
  }

  // Prueba 1: Conexión básica
  const conexionOK = await probarGemini();

  if (conexionOK) {
    // Prueba 2: Generación de CV
    await generarCVPrueba();
  }

  console.log("\n✅ Pruebas completadas");
  console.log("\n📋 Próximos pasos:");
  console.log(
    "1. Obtener API key de Gemini en: https://aistudio.google.com/app/apikey"
  );
  console.log("2. Configurar VITE_GEMINI_API_KEY en .env");
  console.log("3. Probar desde la interfaz web");
}

main().catch(console.error);
