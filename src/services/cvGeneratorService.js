// Servicio para generación de CVs con MaikoCV Agent
import html2pdf from 'html2pdf.js'

class CVGeneratorService {
  constructor() {
    this.maikoAgentEndpoint = import.meta.env.VITE_MAIKO_CV_AGENT_URL || 'https://api.openai.com/v1/chat/completions'
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
  }

  /**
   * Genera un CV personalizado usando el agente MaikoCV
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} - Resultado con HTML del CV
   */
  async generarCVConMaikoAgent(formData) {
    try {
      // Preparar el prompt para MaikoCV
      const prompt = this.construirPromptMaikoCV(formData)
      
      // Llamar al agente MaikoCV
      const response = await fetch(this.maikoAgentEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Eres MaikoCV, un agente especializado en generar CVs personalizados para Michael Esteban Sáez Contreras. 
              
              INFORMACIÓN DEL CANDIDATO:
              - Desarrollador Full Stack con 5+ años de experiencia
              - Especialista en Vue.js, React, Node.js, Python, Java
              - Experiencia en Firebase, PostgreSQL, MongoDB
              - Mentor tecnológico y facilitador
              - Ubicación: Chile
              
              INSTRUCCIONES:
              1. Usa SIEMPRE el CV Maestro como referencia de diseño y estructura
              2. Personaliza el contenido según los requisitos del puesto
              3. Destaca las habilidades y experiencias más relevantes
              4. Mantén un diseño profesional y legible
              5. Genera HTML estructurado listo para convertir a PDF
              6. Usa estilos CSS inline para mejor compatibilidad con PDF
              
              FORMATO DE RESPUESTA:
              Devuelve ÚNICAMENTE el HTML del CV, sin explicaciones adicionales.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`)
      }

      const data = await response.json()
      const htmlCV = data.choices[0].message.content

      return {
        success: true,
        html: htmlCV,
        timestamp: new Date().toISOString()
      }

    } catch (error) {
      console.error('Error al generar CV con MaikoCV:', error)
      
      // Fallback: generar CV básico si falla la API
      return {
        success: true,
        html: this.generarCVFallback(formData),
        timestamp: new Date().toISOString(),
        fallback: true
      }
    }
  }

  /**
   * Construye el prompt para el agente MaikoCV
   * @param {Object} formData - Datos del formulario
   * @returns {string} - Prompt estructurado
   */
  construirPromptMaikoCV(formData) {
    const { reclutador, requisitos, habilidadesSeleccionadas, descripcionCargo } = formData

    return `
    SOLICITUD DE CV PERSONALIZADO:
    
    INFORMACIÓN DEL RECLUTADOR:
    - Nombre: ${reclutador?.nombre || formData.nombreReclutador}
    - Empresa: ${reclutador?.empresa || formData.empresa}
    - Posición: ${reclutador?.posicion || formData.posicion}
    - Email: ${reclutador?.email || formData.email}
    
    REQUISITOS DEL PUESTO:
    - Habilidades requeridas: ${(habilidadesSeleccionadas || formData.tecnologias || []).join(', ')}
    - Descripción del cargo: ${descripcionCargo || formData.descripcionPuesto || ''}
    - Experiencia requerida: ${formData.experienciaRequerida || 'No especificada'}
    - Modalidad: ${formData.modalidad || 'No especificada'}
    
    INSTRUCCIONES ESPECÍFICAS:
    1. Personaliza el CV de Michael para esta posición específica
    2. Destaca las habilidades que coincidan con los requisitos
    3. Adapta la descripción de experiencias para alinearse con el puesto
    4. Mantén la estructura profesional del CV Maestro
    5. Incluye información de contacto actualizada
    6. Usa un diseño limpio y profesional
    
    Genera el HTML del CV personalizado ahora.
    `
  }

  /**
   * Genera un CV básico como fallback
   * @param {Object} formData - Datos del formulario
   * @returns {string} - HTML del CV básico
   */
  generarCVFallback(formData) {
    const habilidades = formData.habilidadesSeleccionadas || formData.tecnologias || []
    const empresa = formData.empresa || formData.reclutador?.empresa || 'Empresa'
    const posicion = formData.posicion || formData.reclutador?.posicion || 'Desarrollador'

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>CV - Michael Esteban Sáez Contreras</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; }
            .cv-container { max-width: 800px; margin: 0 auto; background: white; }
            .header { background: #2a60c4; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 5px 0; font-size: 16px; }
            .content { padding: 30px; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #2a60c4; border-bottom: 2px solid #2a60c4; padding-bottom: 5px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; }
            .skill { background: #f0f8ff; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
            .highlight { background: #e6f3ff; padding: 10px; border-left: 4px solid #2a60c4; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="cv-container">
            <div class="header">
                <h1>Michael Esteban Sáez Contreras</h1>
                <p>Desarrollador Full Stack</p>
                <p>📧 maikostudios@gmail.com | 📱 +56 9 XXXX XXXX</p>
                <p>🌐 LinkedIn: /in/michael-saez | GitHub: @maikostudios</p>
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>Perfil Profesional</h2>
                    <div class="highlight">
                        <p><strong>CV Personalizado para ${posicion} en ${empresa}</strong></p>
                        <p>Desarrollador Full Stack con más de 5 años de experiencia especializado en las tecnologías que requieren para este puesto. Apasionado por crear soluciones tecnológicas innovadoras y escalables.</p>
                    </div>
                </div>

                <div class="section">
                    <h2>Habilidades Técnicas Relevantes</h2>
                    <div class="skills">
                        ${habilidades.map(skill => `<span class="skill">${skill}</span>`).join('')}
                    </div>
                </div>

                <div class="section">
                    <h2>Experiencia Laboral</h2>
                    <h3>Desarrollador Full Stack Senior | MaikoStudios (2020 - Presente)</h3>
                    <ul>
                        <li>Desarrollo de aplicaciones web modernas con Vue.js y React</li>
                        <li>Implementación de APIs REST con Node.js y Express</li>
                        <li>Gestión de bases de datos PostgreSQL y MongoDB</li>
                        <li>Integración con servicios de Firebase y AWS</li>
                        <li>Mentoría técnica y liderazgo de equipos de desarrollo</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>Educación</h2>
                    <p><strong>Ingeniería en Informática</strong> - Universidad Tecnológica</p>
                    <p>Certificaciones en desarrollo web moderno y arquitecturas cloud</p>
                </div>

                <div class="section">
                    <h2>Información Adicional</h2>
                    <p>CV generado específicamente para la posición de <strong>${posicion}</strong> en <strong>${empresa}</strong></p>
                    <p>Fecha de generación: ${new Date().toLocaleDateString('es-CL')}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
  }

  /**
   * Convierte HTML a PDF usando html2pdf.js
   * @param {string} htmlContent - Contenido HTML del CV
   * @param {string} filename - Nombre del archivo
   * @returns {Promise<Blob>} - Blob del PDF generado
   */
  async convertirHTMLaPDF(htmlContent, filename = 'cv-personalizado.pdf') {
    const options = {
      margin: 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    }

    try {
      const pdf = await html2pdf().set(options).from(htmlContent).toPdf().get('pdf')
      return pdf.output('blob')
    } catch (error) {
      console.error('Error al generar PDF:', error)
      throw error
    }
  }

  /**
   * Renderiza el CV en un contenedor para previsualización
   * @param {string} htmlContent - Contenido HTML del CV
   * @param {string} containerId - ID del contenedor donde renderizar
   */
  renderizarCVEnContenedor(htmlContent, containerId = 'cv-container') {
    const container = document.getElementById(containerId)
    if (container) {
      container.innerHTML = htmlContent
      container.style.display = 'block'
    } else {
      console.error(`Contenedor ${containerId} no encontrado`)
    }
  }

  /**
   * Descarga el PDF generado
   * @param {Blob} pdfBlob - Blob del PDF
   * @param {string} filename - Nombre del archivo
   */
  descargarPDF(pdfBlob, filename = 'cv-personalizado.pdf') {
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export default new CVGeneratorService()
