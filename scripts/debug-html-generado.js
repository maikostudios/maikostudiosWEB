/**
 * Script para debuggear el HTML generado por Gemini
 * y verificar por qué el PDF sale en blanco
 */

import geminiService from '../src/services/geminiService.js';

async function debugHTMLGenerado() {
  console.log('🔍 DEBUGGEANDO HTML GENERADO POR GEMINI...\n');

  // Datos de prueba (mismos que en admin)
  const datosSolicitud = {
    posicion: 'Consultor Informático',
    habilidades: ['Vue.js', 'Python', 'Java', 'Firebase', 'Cloudflare'],
    descripcionCargo: 'Quiero que generes un CV general con todos los datos de Michael',
    empresa: 'ssaez spa',
    reclutador: 'Muahahah'
  };

  // Crear prompt personalizado (igual que en store)
  const userPrompt = `
🎯 PERSONALIZACIÓN ESPECÍFICA PARA ESTA SOLICITUD:

📋 POSICIÓN OBJETIVO: ${datosSolicitud.posicion}
🏢 EMPRESA: ${datosSolicitud.empresa || 'No especificada'}
👤 RECLUTADOR: ${datosSolicitud.reclutador || 'No especificado'}

🔧 HABILIDADES REQUERIDAS:
${datosSolicitud.habilidades.map(h => `- ${h}`).join('\n')}

📝 DESCRIPCIÓN DEL CARGO:
${datosSolicitud.descripcionCargo}

💡 INSTRUCCIONES DE PERSONALIZACIÓN:
- Adapta el perfil profesional para destacar experiencia relevante para "${datosSolicitud.posicion}"
- Prioriza las habilidades técnicas mencionadas: ${datosSolicitud.habilidades.join(', ')}
- Optimiza las descripciones de experiencia laboral para incluir palabras clave del cargo
- Enfoca el CV hacia las responsabilidades descritas en la oferta laboral
- Mantén un tono profesional y técnico apropiado para el sector IT
- Asegúrate de que el CV sea ATS-friendly con las palabras clave correctas

🎯 OBJETIVO: Crear un CV altamente personalizado que maximice las posibilidades de pasar filtros ATS y captar la atención del reclutador para la posición de "${datosSolicitud.posicion}".
  `;

  try {
    console.log('🤖 Generando CV con Gemini...');
    const resultado = await geminiService.generarCVPersonalizado(userPrompt);

    if (resultado.success) {
      console.log('✅ CV generado exitosamente');
      console.log(`📏 Longitud HTML: ${resultado.html.length} caracteres\n`);

      // Guardar HTML para inspección
      const fs = await import('fs');
      fs.writeFileSync('debug-cv-generado.html', resultado.html);
      console.log('💾 HTML guardado como: debug-cv-generado.html\n');

      // Analizar el HTML
      console.log('🔍 ANÁLISIS DEL HTML GENERADO:');
      console.log('=' .repeat(50));

      // Verificar estructura básica
      const tieneDoctype = resultado.html.includes('<!DOCTYPE html>');
      const tieneHtml = resultado.html.includes('<html');
      const tieneHead = resultado.html.includes('<head>');
      const tieneBody = resultado.html.includes('<body>');
      const tieneEstilos = resultado.html.includes('<style>');

      console.log(`📄 DOCTYPE: ${tieneDoctype ? '✅' : '❌'}`);
      console.log(`🏷️  HTML tag: ${tieneHtml ? '✅' : '❌'}`);
      console.log(`🧠 HEAD tag: ${tieneHead ? '✅' : '❌'}`);
      console.log(`🎨 BODY tag: ${tieneBody ? '✅' : '❌'}`);
      console.log(`💄 STYLES: ${tieneEstilos ? '✅' : '❌'}`);

      // Verificar contenido específico
      const tieneHeader = resultado.html.includes('<header>');
      const tieneNombre = resultado.html.includes('Michael');
      const tieneCargo = resultado.html.includes('Desarrollador');
      const tieneEmail = resultado.html.includes('m.saezc@maikostudios.com');
      const tieneFooter = resultado.html.includes('footer');

      console.log(`\n📋 CONTENIDO ESPECÍFICO:`);
      console.log(`🎯 Header: ${tieneHeader ? '✅' : '❌'}`);
      console.log(`👤 Nombre: ${tieneNombre ? '✅' : '❌'}`);
      console.log(`💼 Cargo: ${tieneCargo ? '✅' : '❌'}`);
      console.log(`📧 Email: ${tieneEmail ? '✅' : '❌'}`);
      console.log(`📄 Footer: ${tieneFooter ? '✅' : '❌'}`);

      // Verificar estilos CSS críticos
      const tieneColorNegro = resultado.html.includes('color: #000') || resultado.html.includes('color:#000');
      const tieneColorTurquesa = resultado.html.includes('#00cccc');
      const tieneHeaderOscuro = resultado.html.includes('#121212');
      const tieneFuenteArial = resultado.html.includes('Arial');

      console.log(`\n🎨 ESTILOS CSS:`);
      console.log(`⚫ Color negro: ${tieneColorNegro ? '✅' : '❌'}`);
      console.log(`🔵 Color turquesa: ${tieneColorTurquesa ? '✅' : '❌'}`);
      console.log(`🖤 Header oscuro: ${tieneHeaderOscuro ? '✅' : '❌'}`);
      console.log(`🔤 Fuente Arial: ${tieneFuenteArial ? '✅' : '❌'}`);

      // Mostrar primeras líneas del HTML
      console.log(`\n📝 PRIMERAS 10 LÍNEAS DEL HTML:`);
      console.log('-' .repeat(50));
      const lineas = resultado.html.split('\n').slice(0, 10);
      lineas.forEach((linea, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}: ${linea}`);
      });

      // Verificar si hay contenido visible
      const bodyContent = resultado.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyContent && bodyContent[1]) {
        const contenidoBody = bodyContent[1].trim();
        console.log(`\n📊 CONTENIDO DEL BODY:`);
        console.log(`📏 Longitud: ${contenidoBody.length} caracteres`);
        console.log(`📄 Vacío: ${contenidoBody.length === 0 ? '❌ SÍ' : '✅ NO'}`);
        
        if (contenidoBody.length > 0) {
          console.log(`🔤 Primeros 200 caracteres:`);
          console.log(contenidoBody.substring(0, 200) + '...');
        }
      }

      console.log(`\n🎯 DIAGNÓSTICO:`);
      if (!tieneBody || !bodyContent || bodyContent[1].trim().length === 0) {
        console.log('❌ PROBLEMA: El HTML no tiene contenido en el body');
        console.log('💡 SOLUCIÓN: Verificar que Gemini esté generando HTML completo');
      } else if (!tieneEstilos) {
        console.log('❌ PROBLEMA: El HTML no tiene estilos CSS');
        console.log('💡 SOLUCIÓN: Verificar que la plantilla incluya estilos');
      } else {
        console.log('✅ HTML parece estar bien estructurado');
        console.log('💡 PROBLEMA POSIBLE: html2pdf.js no puede renderizar el contenido');
      }

    } else {
      console.error('❌ Error al generar CV:', resultado.error);
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Ejecutar debug
debugHTMLGenerado();
