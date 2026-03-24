<template>
  <section id="servicios" class="servicios-section">
    <v-container>
      <h2 class="section-title">Servicios</h2>

      <!-- Servicios Empresariales -->
      <div class="servicios-grid">
        <div class="servicio-card empresarial">
          <div class="card-header">
            <img src="/maiko_icons/svg/soluciones_empresariales.svg" alt="Para Empresas" class="service-icon-svg" />
            <h3>Para Empresas</h3>
          </div>
          <ul class="servicios-list">
            <li v-for="servicio in serviciosEmpresariales.filter(s => !s.hideInLanding)" :key="servicio.id">
              <strong>
                <img :src="servicio.icon" alt="" class="inline-icon-svg" /> 
                {{ servicio.title }}
              </strong>
              <p>{{ servicio.description }}</p>
              <v-chip 
                v-for="(tag, index) in servicio.tags" 
                :key="index" 
                size="x-small" 
                :color="tag.color" 
                class="mt-1 mr-1">
                {{ tag.text }}
              </v-chip>
            </li>
          </ul>
          <v-btn color="primary" variant="outlined" block to="/servicios">
            Ver Todos los Servicios
          </v-btn>
        </div>

        <!-- Servicios Freelance -->
        <div class="servicio-card freelance">
          <div class="card-header">
            <img src="/maiko_icons/svg/mentoria_tecnologica.svg" alt="Para Particulares" class="service-icon-svg" />
            <h3>Para Particulares</h3>
          </div>
          <ul class="servicios-list">
            <li v-for="servicio in serviciosParticulares.filter(s => !s.hideInLanding)" :key="servicio.id">
              <strong>
                <img :src="servicio.icon" alt="" class="inline-icon-svg" /> 
                {{ servicio.title }}
              </strong>
              <p>{{ servicio.description }}</p>
              <v-chip 
                v-for="(tag, index) in servicio.tags" 
                :key="index" 
                size="x-small" 
                :color="tag.color" 
                class="mt-1 mr-1">
                {{ tag.text }}
              </v-chip>
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

<script setup>
import { serviciosEmpresariales, serviciosParticulares } from '@/data/servicios.js'
</script>


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

.service-icon-svg {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(0, 204, 204, 0.3));
}

.inline-icon-svg {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  margin-right: 0.25rem;
  filter: drop-shadow(0 0 3px rgba(0, 204, 204, 0.2));
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