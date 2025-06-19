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
              <strong>Desarrollo Web Empresarial</strong>
              <p>Aplicaciones web escalables con Vue.js, React y Node.js</p>
            </li>
            <li>
              <strong>Automatización de Procesos</strong>
              <p>Optimización de flujos de trabajo con IA y herramientas modernas</p>
            </li>
            <li>
              <strong>Sistemas de Gestión</strong>
              <p>ERP, CRM y plataformas administrativas personalizadas</p>
            </li>
            <li>
              <strong>Integración de APIs</strong>
              <p>Conexión de sistemas existentes con nuevas tecnologías</p>
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
              <strong>Sitios Web Profesionales</strong>
              <p>Landing pages y sitios corporativos responsive</p>
            </li>
            <li>
              <strong>E-commerce y Tiendas Online</strong>
              <p>Plataformas de venta con pasarelas de pago integradas</p>
            </li>
            <li>
              <strong>Capacitación Tecnológica</strong>
              <p>Cursos personalizados de programación y herramientas digitales</p>
            </li>
            <li>
              <strong>Consultoría Digital</strong>
              <p>Estrategias para digitalizar tu emprendimiento</p>
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
  background: linear-gradient(to bottom, #0d0d0d, var(--color-background));
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 4rem;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
}

@media (max-width: 480px) {
  .servicios-section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .servicio-card {
    padding: 1rem;
  }
}
</style>