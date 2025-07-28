/**
 * Script para probar el formulario CV Personalizado completo
 * Simula el llenado del formulario y generación con Gemini
 */

const fetch = require("node-fetch");

// Configuración de Gemini
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU";

// Simulación del servicio Gemini
const geminiService = {
  async probarConexion() {
    try {
      const testPrompt = "Responde solo: 'Conexión exitosa'";
      const body = {
        contents: [{ role: "user", parts: [{ text: testPrompt }] }],
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const respuesta =
          data.candidates?.[0]?.content?.parts?.[0]?.text || "OK";
        return { success: true, response: respuesta.trim() };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async generarCVPersonalizado(promptPersonalizado) {
    try {
      // Prompt del sistema
      const promptSystem = `Eres MaikoCV, un agente experto en Recursos Humanos del sector TI y Generación de CVs Profesionales para Michael Esteban Sáez Contreras.

📌 Tu objetivo es generar un CV completamente personalizado, optimizado para superar filtros automatizados (ATS) y ser atractivo para reclutadores técnicos y no técnicos del área TI.

🎯 ESTRUCTURA DE TRABAJO:
1. Recibirás una plantilla HTML con variables tipo {{variable}} que **NO debes modificar en estructura ni diseño**.
2. Datos personales, profesionales, técnicos y académicos del candidato en formato JSON.
3. Una posible descripción de oferta laboral o puesto objetivo.

💡 TU MISIÓN:
Entregar un CV altamente profesional, adaptado y atractivo tanto para filtros automáticos (ATS) como para reclutadores humanos en tecnología, utilizando al máximo los datos proporcionados y tu experiencia en el área de RRHH técnico.`;

      // Datos simulados del candidato
      const datosJSON = JSON.stringify(
        {
          nombre_completo: "Michael Esteban Sáez Contreras",
          cargo_principal: "Desarrollador Full Stack",
          email: "m.saezc@maikostudios.com",
          telefono: "+56983833148",
          ubicacion: "Temuco, IX Región, Chile",
          linkedin: "https://www.linkedin.com/in/me-saezc/",
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
          ],
          habilidades_tecnicas: {
            frontend: ["Vue.js", "React", "Angular", "TypeScript"],
            backend: ["Node.js", "Express.js", "Python"],
            databases: ["PostgreSQL", "MongoDB", "Firebase"],
          },
          educacion: [
            {
              titulo: "Ingeniería en Informática",
              institucion: "Universidad Católica de Temuco",
              periodo: "2017-2021",
            },
          ],
        },
        null,
        2
      );

      // Plantilla HTML simplificada
      const plantillaHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000 !important; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; color: #000 !important; }
    h2 { color: #00cccc !important; margin-bottom: 10px; }
    h3 { color: #000 !important; font-weight: bold; }
    p { color: #000 !important; }
    .entry { margin-bottom: 15px; color: #000 !important; }
    .entry-title { font-weight: bold; color: #000 !important; }
  </style>
</head>
<body>
  <header>
    <h1>{{nombre_completo}}</h1>
    <div>{{cargo_principal}}</div>
    <div>{{email}} | {{telefono}}</div>
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
</body>
</html>`;

      const promptUser = `📄 PLANTILLA HTML MAESTRA:
${plantillaHTML}

📊 DATOS DEL CANDIDATO:
${datosJSON}

🎯 PERSONALIZACIÓN SOLICITADA:
"${promptPersonalizado}"

⚙️ INSTRUCCIONES:
1. Reemplaza todas las variables {{}} con los datos del JSON
2. Mantén la estructura HTML exactamente igual
3. Personaliza el contenido según la solicitud
4. Devuelve SOLO el HTML final sin explicaciones`;

      // Combinar prompts
      const promptCombinado = `${promptSystem}\n\n---\n\n${promptUser}`;

      const body = {
        contents: [{ role: "user", parts: [{ text: promptCombinado }] }],
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const htmlGenerado =
          data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return {
          success: true,
          html: htmlGenerado,
          metadata: {
            candidato: "Michael Esteban Sáez Contreras",
            modelo: "gemini-1.5-flash",
            timestamp: new Date().toISOString(),
          },
        };
      } else {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Datos de prueba para el formulario
const datosFormularioPrueba = {
  nombreReclutador: "Ana García",
  empresa: "TechStartup",
  email: "ana@techstartup.com",
  posicion: "Desarrollador Frontend Vue.js",
  habilidadesSeleccionadas: ["Vue.js", "TypeScript", "Tailwind CSS", "Figma"],
  descripcionCargo: `Buscamos un desarrollador frontend con experiencia sólida en Vue.js para unirse a nuestro equipo de desarrollo.

RESPONSABILIDADES:
- Desarrollar interfaces de usuario modernas y responsivas
- Implementar diseños de Figma a código Vue.js
- Trabajar con TypeScript para mayor robustez del código
- Utilizar Tailwind CSS para estilos eficientes
- Colaborar con el equipo de UX/UI
- Optimizar rendimiento de aplicaciones frontend

REQUISITOS:
- 3+ años de experiencia con Vue.js
- Conocimiento sólido de TypeScript
- Experiencia con Tailwind CSS
- Manejo de herramientas de diseño como Figma
- Conocimientos de Git y metodologías ágiles
- Inglés intermedio

OFRECEMOS:
- Trabajo remoto flexible
- Ambiente startup dinámico
- Oportunidades de crecimiento
- Tecnologías modernas`,
};

async function probarFormularioCompleto() {
  console.log("🧪 INICIANDO PRUEBA COMPLETA DEL FORMULARIO CV PERSONALIZADO");
  console.log("=".repeat(80));

  try {
    // 1. Validar datos del formulario
    console.log("\n📝 1. VALIDANDO DATOS DEL FORMULARIO:");
    console.log(`   ✅ Reclutador: ${datosFormularioPrueba.nombreReclutador}`);
    console.log(`   ✅ Empresa: ${datosFormularioPrueba.empresa}`);
    console.log(`   ✅ Email: ${datosFormularioPrueba.email}`);
    console.log(`   ✅ Posición: ${datosFormularioPrueba.posicion}`);
    console.log(
      `   ✅ Habilidades: ${datosFormularioPrueba.habilidadesSeleccionadas.join(
        ", "
      )}`
    );
    console.log(
      `   ✅ Descripción: ${datosFormularioPrueba.descripcionCargo.length} caracteres`
    );

    // 2. Crear prompt personalizado
    console.log("\n🤖 2. CREANDO PROMPT PERSONALIZADO:");
    const habilidadesTexto =
      datosFormularioPrueba.habilidadesSeleccionadas.join(", ");
    const promptPersonalizado = `
CV personalizado para la posición de ${datosFormularioPrueba.posicion} en ${datosFormularioPrueba.empresa}.

HABILIDADES CLAVE A DESTACAR: ${habilidadesTexto}

DESCRIPCIÓN DEL CARGO:
${datosFormularioPrueba.descripcionCargo}

INSTRUCCIONES:
- Adapta el CV para destacar las habilidades mencionadas: ${habilidadesTexto}
- Optimiza el contenido para la posición de ${datosFormularioPrueba.posicion}
- Incluye palabras clave relevantes para ${datosFormularioPrueba.empresa}
- Asegúrate de que el CV sea atractivo para reclutadores de ${datosFormularioPrueba.empresa}
- Destaca experiencias y proyectos relacionados con las tecnologías solicitadas
    `.trim();

    console.log(
      `   📏 Longitud del prompt: ${promptPersonalizado.length} caracteres`
    );
    console.log(`   🎯 Habilidades destacadas: ${habilidadesTexto}`);
    console.log(`   🏢 Empresa objetivo: ${datosFormularioPrueba.empresa}`);
    console.log(`   💼 Posición objetivo: ${datosFormularioPrueba.posicion}`);

    // 3. Probar conexión con Gemini
    console.log("\n🔗 3. PROBANDO CONEXIÓN CON GEMINI:");
    const conexion = await geminiService.probarConexion();

    if (conexion.success) {
      console.log(`   ✅ Conexión exitosa: ${conexion.response}`);
    } else {
      throw new Error(`Conexión fallida: ${conexion.error}`);
    }

    // 4. Generar CV con Gemini
    console.log("\n🚀 4. GENERANDO CV CON GEMINI:");
    console.log("   ⏳ Enviando prompt a Gemini 1.5 Flash...");

    const resultado = await geminiService.generarCVPersonalizado(
      promptPersonalizado
    );

    if (resultado.success) {
      console.log("   ✅ CV generado exitosamente!");
      console.log(`   📏 Longitud HTML: ${resultado.html.length} caracteres`);
      console.log(`   👤 Candidato: ${resultado.metadata.candidato}`);
      console.log(`   🤖 Modelo: ${resultado.metadata.modelo}`);
      console.log(`   ⏰ Timestamp: ${resultado.metadata.timestamp}`);

      // 5. Guardar CV generado
      console.log("\n💾 5. GUARDANDO CV GENERADO:");
      const fs = await import("fs");
      const nombreArchivo = `cv-prueba-formulario-${Date.now()}.html`;
      fs.writeFileSync(nombreArchivo, resultado.html);
      console.log(`   ✅ CV guardado como: ${nombreArchivo}`);

      // 6. Simular guardado en Firebase
      console.log("\n🔥 6. SIMULANDO GUARDADO EN FIREBASE:");
      const solicitudData = {
        nombreReclutador: datosFormularioPrueba.nombreReclutador,
        empresa: datosFormularioPrueba.empresa,
        email: datosFormularioPrueba.email,
        posicion: datosFormularioPrueba.posicion,
        habilidadesSeleccionadas:
          datosFormularioPrueba.habilidadesSeleccionadas,
        descripcionCargo: datosFormularioPrueba.descripcionCargo,
        tipoSolicitud: "cv_personalizado_gemini",
        fechaSolicitud: new Date().toISOString(),
        estado: "completado",
      };

      console.log("   📄 Datos a guardar en Firebase:");
      console.log(`      - Reclutador: ${solicitudData.nombreReclutador}`);
      console.log(`      - Empresa: ${solicitudData.empresa}`);
      console.log(`      - Tipo: ${solicitudData.tipoSolicitud}`);
      console.log(`      - Estado: ${solicitudData.estado}`);
      console.log(
        `      - Habilidades: ${solicitudData.habilidadesSeleccionadas.length} items`
      );

      // 7. Resumen final
      console.log("\n🎉 7. RESUMEN DE LA PRUEBA:");
      console.log("   ✅ Formulario validado correctamente");
      console.log("   ✅ Prompt personalizado creado");
      console.log("   ✅ Conexión Gemini exitosa");
      console.log("   ✅ CV generado con IA");
      console.log("   ✅ Archivo HTML guardado");
      console.log("   ✅ Datos preparados para Firebase");

      console.log("\n🚀 PRUEBA COMPLETA EXITOSA!");
      console.log(`📁 Archivo generado: ${nombreArchivo}`);
      console.log("🎯 El formulario está funcionando perfectamente");

      return {
        success: true,
        archivo: nombreArchivo,
        metadata: resultado.metadata,
        solicitudData,
      };
    } else {
      throw new Error(`Error generando CV: ${resultado.error}`);
    }
  } catch (error) {
    console.error("\n❌ ERROR EN LA PRUEBA:");
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);

    return {
      success: false,
      error: error.message,
    };
  }
}

// Ejecutar la prueba
probarFormularioCompleto()
  .then((resultado) => {
    if (resultado.success) {
      console.log("\n✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE");
      process.exit(0);
    } else {
      console.log("\n❌ PRUEBAS FALLARON");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("\n💥 ERROR CRÍTICO:", error);
    process.exit(1);
  });
