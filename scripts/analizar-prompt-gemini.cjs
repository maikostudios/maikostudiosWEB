// Script para analizar cómo se genera el prompt y qué datos usa Gemini
const fs = require("fs");

// Simulamos la obtención de datos como lo hace el servicio real
async function simularObtencionDatos() {
  console.log("🔍 ANÁLISIS DEL PROCESO DE GENERACIÓN DE PROMPTS\n");
  console.log("=".repeat(60));

  // 1. PLANTILLA HTML (simulando Firebase)
  console.log("\n📄 1. PLANTILLA HTML OBTENIDA DE FIREBASE:");
  console.log("   Colección: plantillas");
  console.log('   Documento: donde activa == true && tipo == "cv_profesional"');
  console.log("   Campo: plantilla_cv_maiko\n");

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
</html>`;

  console.log("   Variables encontradas en la plantilla:");
  const variables = plantillaHTML.match(/\{\{([^}]+)\}\}/g);
  variables.forEach((variable) => {
    console.log(`   - ${variable}`);
  });

  // 2. DATOS DEL PERFIL (simulando Firebase)
  console.log("\n👤 2. DATOS DEL PERFIL OBTENIDOS DE FIREBASE:");
  console.log("   Colección: perfil_candidato");
  console.log("   Documento: donde activo == true");
  console.log("   ID: michael_saez\n");

  const datosJSON = {
    nombre_completo: "Michael Esteban Sáez Contreras",
    cargo_principal: "Desarrollador Full Stack",
    email: "m.saezc@maikostudios.com",
    telefono: "+56983833148",
    ubicacion: "Temuco, IX Región, Chile",
    linkedin: "https://www.linkedin.com/in/me-saezc/",
    web: "https://maikostudios.com/",
    perfil_profesional:
      "Desarrollador Full Stack con experiencia en Vue.js, Node.js y Firebase. Especializado en crear soluciones web completas y escalables.",
    experiencia_profesional: [
      {
        cargo: "Fundador y Desarrollador",
        empresa: "Maiko Studios",
        periodo: "2024 - Actualidad",
        descripcion:
          "Creación de plataformas como DeUna Transferencias, automatizaciones con IA, digitalización para PYMEs y asesorías tecnológicas.",
      },
      {
        cargo: "Facilitador/Docente Bootcamp Front End",
        empresa: "Desafío Latam",
        periodo: "Ago 2024 – Dic 2024",
        descripcion:
          "Enseñanza de HTML, CSS, BOOTSTRAP, JAVASCRIPT, y VUE JS en el Programa Talento Digital para Chile.",
      },
      {
        cargo: "Developer Full Stack & Soporte TI",
        empresa: "Tata Consultancy Services – Metlife Chile",
        periodo: "Jul 2021 – Dic 2023",
        descripcion:
          "Desarrollos para área Direct Marketing. Soporte a aplicaciones y resolución de tickets.",
      },
    ],
    habilidades_tecnicas: {
      lenguajes: ["JavaScript", "Python", "Java", "HTML", "CSS"],
      frontend: ["Vue.js", "React", "Angular", "Bootstrap", "Vuetify"],
      backend: ["Node.js", "Express.js", "Spring Boot", "FastAPI"],
      databases: ["PostgreSQL", "MongoDB", "Firebase", "MySQL"],
      cloud: ["Firebase", "AWS", "Google Cloud"],
      tools: ["Git", "Docker", "VS Code", "Figma"],
    },
    educacion: [
      {
        titulo: "Ingeniería en Informática",
        institucion: "Universidad Católica de Temuco",
        periodo: "2017-2021",
      },
      {
        titulo: "Técnico en Programación",
        institucion: "Instituto AIEP",
        periodo: "2015-2017",
      },
    ],
    idiomas: [
      { idioma: "Español", nivel: "Nativo" },
      { idioma: "Inglés", nivel: "Intermedio" },
    ],
    habilidades_blandas:
      "Liderazgo de equipos, Comunicación efectiva, Resolución de problemas, Adaptabilidad, Trabajo en equipo, Mentoría técnica",
    activo: true,
    fecha_actualizacion: "2024-12-20",
  };

  console.log("   Estructura de datos:");
  console.log(
    `   - Información personal: ${
      Object.keys(datosJSON).filter((k) =>
        ["nombre_completo", "email", "telefono", "ubicacion"].includes(k)
      ).length
    } campos`
  );
  console.log(
    `   - Experiencia profesional: ${datosJSON.experiencia_profesional.length} trabajos`
  );
  console.log(
    `   - Habilidades técnicas: ${
      Object.keys(datosJSON.habilidades_tecnicas).length
    } categorías`
  );
  console.log(`   - Educación: ${datosJSON.educacion.length} títulos`);
  console.log(`   - Idiomas: ${datosJSON.idiomas.length} idiomas`);

  // 3. PROMPT DEL SISTEMA
  console.log("\n🤖 3. PROMPT DEL SISTEMA (ROLE: SYSTEM):");
  console.log("   Función: Definir el comportamiento de MaikoCV\n");

  const promptSystem = `Eres MaikoCV, un agente experto en generación de CVs personalizados para Michael Esteban Sáez Contreras.

Tu tarea es reemplazar únicamente los datos dinámicos dentro de una plantilla HTML predefinida, sin alterar la estructura, diseño, clases ni estilos inline. La plantilla base ya tiene la disposición visual, colores, tipografía y layout deseados.

⚠️ IMPORTANTE:
- No inventes secciones ni reestructures el HTML.
- No agregues estilos nuevos, emojis adicionales ni cambios en las etiquetas existentes.
- No modifiques los nombres de clases ni IDs en el HTML.
- Solo reemplaza los contenidos internos entre etiquetas (ej: \`<p>\`, \`<li>\`, \`<h2>\`, etc.) con la nueva información del candidato.

FORMATO DE RESPUESTA:
Devuelve exclusivamente el HTML completo y corregido, sin explicaciones.`;

  console.log("   Contenido del prompt sistema:");
  console.log("   ✅ Define rol: MaikoCV experto");
  console.log("   ✅ Especifica tarea: reemplazar datos dinámicos");
  console.log("   ✅ Restricciones: no alterar estructura HTML");
  console.log("   ✅ Formato respuesta: solo HTML sin explicaciones");

  // 4. PROMPT DEL USUARIO
  console.log("\n👨‍💻 4. PROMPT DEL USUARIO (ROLE: USER):");
  console.log("   Función: Proporcionar plantilla, datos y personalización\n");

  const userPrompt =
    "CV para desarrollador Full Stack, destacar Vue.js y experiencia en startups";

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

Cuando termines, el resultado debe ser un CV listo para renderizarse como HTML o exportarse como PDF.`;

  console.log("   Componentes del prompt usuario:");
  console.log(`   ✅ Plantilla HTML: ${plantillaHTML.length} caracteres`);
  console.log(
    `   ✅ Datos JSON: ${JSON.stringify(datosJSON).length} caracteres`
  );
  console.log(`   ✅ Personalización: "${userPrompt}"`);
  console.log("   ✅ Instrucciones específicas: 5 pasos detallados");

  // 5. PROMPT COMBINADO (como lo envía Gemini)
  console.log("\n🔗 5. PROMPT COMBINADO ENVIADO A GEMINI:");
  console.log('   Nota: Gemini no soporta rol "system", se combina todo\n');

  const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`;

  console.log("   Estructura del prompt combinado:");
  console.log(`   📏 Longitud total: ${promptCombinado.length} caracteres`);
  console.log('   📋 Formato: [PROMPT_SISTEMA] + "---" + [PROMPT_USUARIO]');
  console.log(`   🎯 Variables a reemplazar: ${variables.length}`);
  console.log(
    `   📊 Datos disponibles: ${
      Object.keys(datosJSON).length
    } campos principales`
  );

  // 6. ANÁLISIS DE VARIABLES
  console.log("\n🔍 6. ANÁLISIS DE MAPEO VARIABLES → DATOS:");
  console.log(
    "   Verificando qué datos están disponibles para cada variable:\n"
  );

  const mapeoVariables = {
    "{{nombre_completo}}": datosJSON.nombre_completo,
    "{{cargo_principal}}": datosJSON.cargo_principal,
    "{{email}}": datosJSON.email,
    "{{telefono}}": datosJSON.telefono,
    "{{ubicacion}}": datosJSON.ubicacion,
    "{{linkedin}}": datosJSON.linkedin,
    "{{perfil_profesional}}": datosJSON.perfil_profesional,
    "{{experiencia_profesional}}": `${datosJSON.experiencia_profesional.length} trabajos`,
    "{{educacion}}": `${datosJSON.educacion.length} títulos`,
    "{{habilidades_tecnicas}}": `${
      Object.keys(datosJSON.habilidades_tecnicas).length
    } categorías`,
    "{{habilidades_blandas}}": datosJSON.habilidades_blandas,
    "{{idiomas}}": `${datosJSON.idiomas.length} idiomas`,
  };

  Object.entries(mapeoVariables).forEach(([variable, valor]) => {
    const estado = valor ? "✅" : "❌";
    console.log(`   ${estado} ${variable} → ${valor || "NO DISPONIBLE"}`);
  });

  // 7. GUARDAR ANÁLISIS
  console.log("\n💾 7. GUARDANDO ANÁLISIS COMPLETO...");

  const analisisCompleto = {
    timestamp: new Date().toISOString(),
    plantilla: {
      fuente: "Firebase - colección plantillas",
      longitud: plantillaHTML.length,
      variables: variables,
    },
    datos: {
      fuente: "Firebase - colección perfil_candidato",
      documento: "michael_saez",
      campos: Object.keys(datosJSON),
      longitud_json: JSON.stringify(datosJSON).length,
    },
    prompts: {
      sistema: {
        longitud: promptSystem.length,
        proposito: "Definir comportamiento MaikoCV",
      },
      usuario: {
        longitud: promptUser.length,
        componentes: [
          "plantilla_html",
          "datos_json",
          "personalizacion",
          "instrucciones",
        ],
      },
      combinado: {
        longitud: promptCombinado.length,
        formato: "sistema + --- + usuario",
      },
    },
    mapeo_variables: mapeoVariables,
    personalizacion_ejemplo: userPrompt,
  };

  fs.writeFileSync(
    "analisis-prompt-gemini.json",
    JSON.stringify(analisisCompleto, null, 2)
  );
  console.log("   ✅ Archivo guardado: analisis-prompt-gemini.json");

  // 8. RESUMEN FINAL
  console.log("\n📋 8. RESUMEN DEL PROCESO:");
  console.log("=".repeat(60));
  console.log(
    "   1️⃣ Obtiene plantilla HTML desde Firebase (con variables {{}})"
  );
  console.log("   2️⃣ Obtiene datos del perfil desde Firebase (JSON completo)");
  console.log("   3️⃣ Crea prompt sistema (define comportamiento MaikoCV)");
  console.log(
    "   4️⃣ Crea prompt usuario (plantilla + datos + personalización)"
  );
  console.log("   5️⃣ Combina prompts (Gemini no soporta rol system)");
  console.log("   6️⃣ Envía a Gemini 1.5 Flash");
  console.log("   7️⃣ Recibe HTML con variables reemplazadas");
  console.log("   8️⃣ Usuario descarga PDF del CV personalizado");

  console.log("\n🎯 DATOS CLAVE:");
  console.log(`   📊 Variables en plantilla: ${variables.length}`);
  console.log(`   📋 Campos de datos: ${Object.keys(datosJSON).length}`);
  console.log(`   📏 Prompt total: ${promptCombinado.length} caracteres`);
  console.log(`   🎨 Personalización: "${userPrompt}"`);

  console.log("\n✅ ANÁLISIS COMPLETADO");
}

// Ejecutar análisis
simularObtencionDatos().catch(console.error);
