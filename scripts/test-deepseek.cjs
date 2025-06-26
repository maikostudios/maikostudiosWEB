// Script para probar DeepSeek API localmente
const axios = require("axios");
const fs = require("fs");

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "YOUR_API_KEY_HERE";

async function probarDeepSeek() {
  console.log("🤖 Probando conexión con DeepSeek API...\n");

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: 'Responde solo "OK" si puedes procesar este mensaje.',
          },
        ],
        max_tokens: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Conexión exitosa con DeepSeek!");
    console.log("📝 Respuesta:", response.data.choices[0].message.content);
    console.log("🔧 Modelo:", response.data.model);
    console.log("📊 Tokens usados:", response.data.usage);

    return true;
  } catch (error) {
    console.error("❌ Error conectando con DeepSeek:");
    console.error("Status:", error.response?.status);
    console.error(
      "Message:",
      error.response?.data?.error?.message || error.message
    );
    return false;
  }
}

async function generarCVPrueba() {
  console.log("\n🎨 Probando generación de CV con DeepSeek...\n");

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

  const systemPrompt = `
Eres MaikoCV, un asistente especializado en generar CVs profesionales en HTML.

REGLAS ESTRICTAS:
1. Usa ÚNICAMENTE estos datos reales del candidato: ${JSON.stringify(cvData)}
2. Reemplaza las variables {{}} en esta plantilla HTML: ${templateHTML}
3. Personaliza para desarrollador Full Stack
4. NUNCA inventes información que no esté en los datos proporcionados
5. Mantén la estructura HTML exacta de la plantilla
6. Conserva todos los estilos CSS inline

INSTRUCCIONES ESPECÍFICAS:
- Para {{experiencia_profesional}}: Genera HTML con estructura .entry y .entry-title
- Para {{habilidades_tecnicas}}: Organiza por categorías (Frontend, Backend, Databases)
- Mantén colores: header #121212, títulos #00cccc, footer #f0f0f0
`;

  const userMessage =
    "Genera mi CV profesional en HTML reemplazando todas las variables {{}} con los datos reales proporcionados.";

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const generatedHTML = response.data.choices[0].message.content;

    console.log("✅ CV generado exitosamente!");
    console.log("📏 Longitud HTML:", generatedHTML.length, "caracteres");
    console.log("🔧 Modelo:", response.data.model);
    console.log("📊 Tokens usados:", response.data.usage);

    // Guardar el HTML generado
    fs.writeFileSync("cv-deepseek-test.html", generatedHTML);
    console.log("💾 CV guardado como: cv-deepseek-test.html");

    return true;
  } catch (error) {
    console.error("❌ Error generando CV:");
    console.error("Status:", error.response?.status);
    console.error(
      "Message:",
      error.response?.data?.error?.message || error.message
    );
    return false;
  }
}

async function main() {
  console.log("🚀 Iniciando pruebas de DeepSeek API\n");
  console.log(
    "🔑 API Key configurada:",
    DEEPSEEK_API_KEY.substring(0, 20) + "..."
  );
  console.log("🌐 Endpoint:", "https://api.deepseek.com/v1/chat/completions\n");

  // Prueba 1: Conexión básica
  const conexionOK = await probarDeepSeek();

  if (conexionOK) {
    // Prueba 2: Generación de CV
    await generarCVPrueba();
  }

  console.log("\n✅ Pruebas completadas");
}

main().catch(console.error);
