<template>
  <section id="servicios" class="servicios-section">
    <v-container>
      <h2 class="section-title">Servicios</h2>

      <!-- Servicios Empresariales -->
      <div class="servicios-grid">
        <div class="servicio-card empresarial">
          <div class="card-header">
            <v-icon size="32" color="primary">mdi-office-building</v-icon>
            <h3>Para Empresas</h3>
          </div>
          <ul class="servicios-list">
            <li>
              <strong>🤖 Agentes de IA Personalizados</strong>
              <p>Asistentes virtuales con ChatGPT y Gemini adaptados a tu negocio</p>
              <v-chip size="x-small" color="primary" class="mt-1">DESTACADO</v-chip>
            </li>
            <li>
              <strong>🌐 Desarrollo Web a Medida</strong>
              <p>Aplicaciones web escalables con Vue.js, React y Node.js</p>
            </li>
            <li>
              <strong>📊 Consultoría Tecnológica + Analytics</strong>
              <p>Estrategia digital y configuración de Google Analytics 4</p>
            </li>
            <li>
              <strong>💬 Automatización de Marketing</strong>
              <p>WhatsApp Business, redes sociales y generación de leads</p>
              <v-chip size="x-small" color="primary" class="mt-1">NUEVO</v-chip>
            </li>
            <li>
              <strong>📱 Campañas en Redes Sociales</strong>
              <p>Facebook Ads, Instagram Ads, LinkedIn Ads y Google Ads</p>
              <v-chip size="x-small" color="primary" class="mt-1">NUEVO</v-chip>
            </li>
            <li>
              <strong>⚖️ Asesoría Legal Empresarial</strong>
              <p>Derecho comercial, contratos tecnológicos y propiedad intelectual</p>
              <v-chip size="x-small" color="secondary" class="mt-1">NUEVO</v-chip>
            </li>
          </ul>
          <v-btn color="primary" variant="outlined" block to="/servicios">
            Ver Todos los Servicios
          </v-btn>
        </div>

        <!-- Servicios Freelance -->
        <div class="servicio-card freelance">
          <div class="card-header">
            <v-icon size="32" color="secondary">mdi-account-group</v-icon>
            <h3>Para Particulares</h3>
          </div>
          <ul class="servicios-list">
            <li>
              <strong>🎨 Diseño Web para Emprendedores</strong>
              <p>Sitios web profesionales y landing pages responsive</p>
            </li>
            <li>
              <strong>🤖 Asistente Virtual con IA</strong>
              <p>ChatGPT y Gemini Gems personalizados para tu negocio</p>
              <v-chip size="x-small" color="secondary" class="mt-1">DESTACADO</v-chip>
            </li>
            <li>
              <strong>🎓 Mentoría Tecnológica</strong>
              <p>Aprende desarrollo web con sesiones personalizadas</p>
            </li>
            <li>
              <strong>📈 Configuración de Analytics</strong>
              <p>Google Analytics 4, Tag Manager y dashboards</p>
              <v-chip size="x-small" color="secondary" class="mt-1">NUEVO</v-chip>
            </li>
            <li>
              <strong>💬 Automatización de Contacto</strong>
              <p>WhatsApp Business, chatbots y formularios inteligentes</p>
              <v-chip size="x-small" color="secondary" class="mt-1">NUEVO</v-chip>
            </li>
            <li>
              <strong>⚖️ Asesoría Legal para Emprendedores</strong>
              <p>Contratos, constitución de empresas y protección legal</p>
              <v-chip size="x-small" color="primary" class="mt-1">NUEVO</v-chip>
            </li>
            <li>
              <strong>🛠️ Soporte Técnico</strong>
              <p>Mantenimiento y actualizaciones de tus proyectos digitales</p>
            </li>
            <li>
              <strong>🎮 Armado de PC Gamers</strong>
              <p>Configuraciones personalizadas para gaming y trabajo profesional</p>
            </li>
          </ul>
          <v-btn color="secondary" variant="outlined" block to="/contacto">
            Solicitar Cotización
          </v-btn>
        </div>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.servicios-section {
  padding: 6rem 0;
  background: transparent;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 4rem;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.servicio-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.servicio-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-header h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
}

.servicios-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.servicios-list li {
  margin-bottom: 1.5rem;
}

.servicios-list strong {
  display: block;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.servicios-list p {
  color: #cccccc;
  margin: 0;
}

.mt-1 {
  margin-top: 0.25rem;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .servicios-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .servicios-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .servicio-card {
    padding: 1.5rem;
  }

  .card-header h3 {
    font-size: 1.3rem;
  }

  .servicios-list li {
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .servicios-section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }

  .servicio-card {
    padding: 1rem;
  }

  .card-header {
    margin-bottom: 1.5rem;
  }

  .card-header h3 {
    font-size: 1.2rem;
  }

  .servicios-list {
    margin-bottom: 1.5rem;
  }
}
</style>