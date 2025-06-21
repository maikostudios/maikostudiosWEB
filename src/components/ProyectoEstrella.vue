<template>
  <section id="proyectos" class="proyectos-section">
    <v-container>
      <h2 class="section-title">Proyectos Destacados</h2>

      <div class="proyectos-grid">
        <!-- Proyecto 1 -->
        <div class="proyecto-card">
          <div class="proyecto-imagen">
            <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" alt="Proyecto 1"
              loading="lazy" decoding="async" />
          </div>
          <div class="proyecto-info">
            <h3>Sistema de Gestión Empresarial</h3>
            <p>Plataforma integral para la gestión de recursos y procesos empresariales</p>
            <div class="tech-stack">
              <span>Vue.js</span>
              <span>Node.js</span>
              <span>PostgreSQL</span>
            </div>
            <div class="proyecto-links">
              <v-btn color="primary" variant="outlined">
                <v-icon left>mdi-eye</v-icon>
                Ver Proyecto
              </v-btn>
              <v-btn color="secondary" variant="text">
                <v-icon left>mdi-github</v-icon>
                Código
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Proyecto 2 -->
        <div class="proyecto-card">
          <div class="proyecto-imagen">
            <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg" alt="Proyecto 2"
              loading="lazy" decoding="async" />
          </div>
          <div class="proyecto-info">
            <h3>E-commerce Moderno</h3>
            <p>Tienda online con integración de pagos y gestión de inventario</p>
            <div class="tech-stack">
              <span>React</span>
              <span>Express</span>
              <span>MongoDB</span>
            </div>
            <div class="proyecto-links">
              <v-btn color="primary" variant="outlined">
                <v-icon left>mdi-eye</v-icon>
                Ver Proyecto
              </v-btn>
              <v-btn color="secondary" variant="text">
                <v-icon left>mdi-github</v-icon>
                Código
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="ver-mas">
        <v-btn color="primary" size="large" to="/portafolio">
          Ver Todos los Proyectos
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.proyectos-section {
  padding: 6rem 0;
  background: transparent;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 4rem;
}

.proyectos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.proyecto-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.proyecto-card:hover {
  transform: translateY(-5px);
}

.proyecto-imagen {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.proyecto-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.proyecto-card:hover .proyecto-imagen img {
  transform: scale(1.05);
}

.proyecto-info {
  padding: 2rem;
}

.proyecto-info h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.proyecto-info p {
  color: #cccccc;
  margin-bottom: 1.5rem;
}

.tech-stack {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tech-stack span {
  background: rgba(0, 102, 255, 0.1);
  color: var(--color-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.proyecto-links {
  display: flex;
  gap: 1rem;
}

.ver-mas {
  text-align: center;
  margin-top: 4rem;
}

/* Tablet breakpoint */
@media (max-width: 1024px) {
  .proyectos-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .proyectos-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .proyecto-card {
    margin-bottom: 1rem;
  }

  .proyecto-info {
    padding: 1.5rem;
  }

  .proyecto-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .proyectos-section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }

  .proyectos-grid {
    gap: 1.5rem;
  }

  .proyecto-info {
    padding: 1rem;
  }

  .proyecto-info h3 {
    font-size: 1.3rem;
  }

  .tech-stack {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .ver-mas {
    margin-top: 2rem;
  }
}
</style>