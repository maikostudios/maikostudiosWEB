/**
 * Servicio Mock para DeepSeek AI - Para pruebas sin API key
 * Simula la funcionalidad de DeepSeek para desarrollo
 */

class DeepSeekMockService {
  constructor() {
    this.isDemo = true
  }

  /**
   * Simula la generación de CV con DeepSeek
   * @param {string} userPrompt - Prompt del usuario
   * @returns {Promise<Object>} - Resultado simulado
   */
  async generarCVPersonalizado(userPrompt = '') {
    try {
      console.log('🤖 [DEMO] Simulando generación con DeepSeek...', { userPrompt })

      // Simular delay de API
      await this.delay(2000)

      const htmlGenerado = this.generarHTMLDemo(userPrompt)

      const resultado = {
        success: true,
        html: htmlGenerado,
        metadata: {
          candidato: 'Michael Esteban Sáez Contreras',
          modelo: 'deepseek-chat (DEMO)',
          timestamp: new Date().toISOString(),
          plantilla: 'cv_michael_saez_completo',
          prompt: userPrompt,
          demo: true
        },
        provider: 'deepseek-mock'
      }

      console.log('✅ [DEMO] CV generado exitosamente', resultado.metadata)
      return resultado

    } catch (error) {
      console.error('❌ [DEMO] Error en simulación:', error)
      return {
        success: false,
        error: 'Error en simulación de DeepSeek',
        provider: 'deepseek-mock'
      }
    }
  }

  /**
   * Simula la prueba de conexión
   * @returns {Promise<Object>} - Estado simulado
   */
  async probarConexion() {
    try {
      console.log('🔍 [DEMO] Simulando conexión con DeepSeek...')
      
      await this.delay(1000)

      return {
        success: true,
        message: 'Conexión simulada exitosa (DEMO)',
        response: 'OK - DeepSeek Mock Service',
        demo: true
      }

    } catch (error) {
      return {
        success: false,
        error: 'Error en simulación de conexión',
        demo: true
      }
    }
  }

  /**
   * Genera HTML demo basado en el prompt
   * @param {string} userPrompt - Prompt del usuario
   * @returns {string} - HTML generado
   */
  generarHTMLDemo(userPrompt) {
    const tipoDetectado = this.detectarTipoCV(userPrompt)
    const perfilPersonalizado = this.generarPerfilPersonalizado(tipoDetectado, userPrompt)
    const habilidadesDestacadas = this.generarHabilidadesDestacadas(tipoDetectado)

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - Michael Esteban Sáez Contreras</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; line-height: 1.6; }
    header { background-color: #121212; color: white; text-align: center; padding: 20px 10px; }
    .sub-header { font-size: 14px; margin-top: 5px; }
    .divider { height: 5px; background-color: #00cccc; }
    section { padding: 20px; }
    h2 { color: #00cccc; margin-bottom: 10px; border-bottom: 2px solid #00cccc; padding-bottom: 5px; }
    .entry { margin-bottom: 15px; }
    .entry-title { font-weight: bold; color: #121212; }
    .entry-company { color: #00cccc; font-weight: bold; }
    .entry-period { color: #666; font-style: italic; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .skill-tag { background: #00cccc; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .footer { background-color: #f0f0f0; text-align: center; font-size: 12px; padding: 10px; }
    .demo-badge { background: #9c27b0; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
  </style>
</head>
<body>
  <header>
    <h1>Michael Esteban Sáez Contreras</h1>
    <div class="sub-header">Desarrollador Full Stack <span class="demo-badge">GENERADO CON DEEPSEEK DEMO</span></div>
    <div class="sub-header">m.saezc@maikostudios.com | +56983833148 | <a href="https://www.linkedin.com/in/me-saezc/" style="color:white;">LinkedIn</a> | <a href="https://maikostudios.com/" style="color:white;">maikostudios.com</a></div>
    <div class="sub-header">Temuco, IX Región, Chile</div>
  </header>
  <div class="divider"></div>

  <section>
    <h2>Perfil Profesional</h2>
    <p>${perfilPersonalizado}</p>
    <p><em>Prompt utilizado: "${userPrompt}"</em></p>
  </section>

  <section>
    <h2>Experiencia Profesional</h2>
    <div class="entry">
      <div class="entry-title">Fundador y Desarrollador</div>
      <div class="entry-company">Maiko Studios</div>
      <div class="entry-period">2024 - Actualidad</div>
      <p>Creación de plataformas como DeUna Transferencias, automatizaciones con IA, digitalización para PYMEs y asesorías tecnológicas. ${this.generarDescripcionPersonalizada(tipoDetectado)}</p>
    </div>
    
    <div class="entry">
      <div class="entry-title">Facilitador/Docente Bootcamp Front End</div>
      <div class="entry-company">Desafío Latam</div>
      <div class="entry-period">Ago 2024 – Dic 2024</div>
      <p>Enseñanza de HTML, CSS, BOOTSTRAP, JAVASCRIPT, y VUE JS en el Programa Talento Digital para Chile.</p>
    </div>

    <div class="entry">
      <div class="entry-title">Developer Full Stack & Soporte TI</div>
      <div class="entry-company">Tata Consultancy Services – Metlife Chile</div>
      <div class="entry-period">Jul 2021 – Dic 2023</div>
      <p>Desarrollos para área Direct Marketing. Soporte a aplicaciones y resolución de tickets.</p>
    </div>
  </section>

  <section>
    <h2>Educación</h2>
    <p><strong>Ingeniería en Informática</strong> - Universidad Católica de Temuco (2017-2021)</p>
    <p><strong>Técnico en Programación</strong> - Instituto AIEP (2015-2017)</p>
  </section>

  <section>
    <h2>Habilidades Técnicas</h2>
    <div class="skills-grid">
      ${habilidadesDestacadas.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
    </div>
  </section>

  <section>
    <h2>Habilidades Blandas</h2>
    <p>Liderazgo de equipos, Comunicación efectiva, Resolución de problemas, Adaptabilidad, Trabajo en equipo, Mentoría técnica</p>
  </section>

  <section>
    <h2>Idiomas</h2>
    <p>Español (Nativo), Inglés (Intermedio)</p>
  </section>

  <div class="footer">
    <p>CV generado con DeepSeek AI (DEMO) - ${new Date().toLocaleString()}</p>
    <p>Contacto: <a href="mailto:m.saezc@maikostudios.com">m.saezc@maikostudios.com</a> | <a href="https://www.linkedin.com/in/me-saezc/">LinkedIn</a> | <a href="https://maikostudios.com/">maikostudios.com</a></p>
  </div>
</body>
</html>`
  }

  /**
   * Detecta el tipo de CV basado en el prompt
   */
  detectarTipoCV(prompt) {
    const palabrasClave = {
      frontend: ['frontend', 'vue', 'react', 'angular', 'ui', 'ux'],
      backend: ['backend', 'api', 'servidor', 'base de datos'],
      fullstack: ['full stack', 'fullstack', 'completo'],
      lider: ['líder', 'lead', 'senior', 'arquitecto'],
      docente: ['profesor', 'facilitador', 'docente', 'enseñanza']
    }

    for (const [tipo, palabras] of Object.entries(palabrasClave)) {
      if (palabras.some(palabra => prompt.toLowerCase().includes(palabra))) {
        return tipo
      }
    }
    return 'general'
  }

  /**
   * Genera perfil personalizado según el tipo
   */
  generarPerfilPersonalizado(tipo, prompt) {
    const perfiles = {
      frontend: 'Desarrollador Frontend especializado en Vue.js y React, con experiencia en crear interfaces de usuario modernas y responsivas. Enfocado en UX/UI y optimización de rendimiento.',
      backend: 'Desarrollador Backend experto en Node.js, Express y bases de datos. Especializado en arquitectura de APIs REST, microservicios y optimización de sistemas.',
      fullstack: 'Desarrollador Full Stack con dominio completo del ciclo de desarrollo. Experiencia en frontend (Vue.js, React) y backend (Node.js, Python), con enfoque en soluciones integrales.',
      lider: 'Tech Lead con experiencia en liderazgo de equipos de desarrollo. Especializado en arquitectura de software, mentoría técnica y gestión de proyectos complejos.',
      docente: 'Facilitador técnico con experiencia comprobada en enseñanza de tecnologías web. Especializado en transmitir conocimientos complejos de manera clara y práctica.',
      general: 'Desarrollador Full Stack versátil con experiencia en múltiples tecnologías y metodologías ágiles. Enfocado en crear soluciones innovadoras y escalables.'
    }

    return perfiles[tipo] || perfiles.general
  }

  /**
   * Genera habilidades destacadas según el tipo
   */
  generarHabilidadesDestacadas(tipo) {
    const habilidades = {
      frontend: ['Vue.js', 'React', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Vuetify', 'Responsive Design'],
      backend: ['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'MongoDB', 'Firebase', 'REST APIs', 'Microservicios'],
      fullstack: ['Vue.js', 'Node.js', 'JavaScript', 'Python', 'PostgreSQL', 'Firebase', 'Git', 'Docker'],
      lider: ['Arquitectura de Software', 'Liderazgo de Equipos', 'Scrum', 'Kanban', 'Mentoría', 'Code Review'],
      docente: ['Facilitación', 'Vue.js', 'JavaScript', 'HTML/CSS', 'Metodologías Ágiles', 'Comunicación'],
      general: ['Vue.js', 'JavaScript', 'Node.js', 'Python', 'PostgreSQL', 'Firebase', 'Git', 'Scrum']
    }

    return habilidades[tipo] || habilidades.general
  }

  /**
   * Genera descripción personalizada para experiencia
   */
  generarDescripcionPersonalizada(tipo) {
    const descripciones = {
      frontend: 'Especialización en desarrollo de interfaces modernas con Vue.js y optimización de experiencia de usuario.',
      backend: 'Enfoque en arquitectura de APIs robustas y optimización de bases de datos para alta concurrencia.',
      fullstack: 'Desarrollo integral desde frontend hasta backend, incluyendo integración con servicios cloud.',
      lider: 'Liderazgo técnico en proyectos complejos y mentoría de desarrolladores junior.',
      docente: 'Desarrollo de material educativo y facilitación de workshops técnicos.',
      general: 'Implementación de soluciones tecnológicas completas con enfoque en calidad y escalabilidad.'
    }

    return descripciones[tipo] || descripciones.general
  }

  /**
   * Simula delay de red
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Exportar instancia única
export default new DeepSeekMockService()
