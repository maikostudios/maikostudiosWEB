<template>
  <BaseLayout>
    <section class="quienes-somos-page">
      <v-container>
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Quiénes Somos</h1>
          <p class="page-subtitle">
            Un equipo multidisciplinario comprometido con la excelencia y la innovación
          </p>
        </div>

        <!-- Misión y Visión -->
        <div class="mision-vision-section">
          <v-row>
            <v-col cols="12" md="6">
              <div class="info-card">
                <v-icon size="48" color="primary" class="mb-4">mdi-target</v-icon>
                <h2>Nuestra Misión</h2>
                <p>
                  Transformar ideas en soluciones digitales innovadoras, combinando tecnología de
                  vanguardia con asesoría legal especializada para impulsar el éxito de nuestros
                  clientes.
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="info-card">
                <v-icon size="48" color="secondary" class="mb-4">mdi-eye</v-icon>
                <h2>Nuestra Visión</h2>
                <p>
                  Ser el referente en soluciones tecnológicas integrales, reconocidos por nuestra
                  capacidad de ofrecer servicios completos que abarcan desde el desarrollo hasta el
                  respaldo legal.
                </p>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Equipo -->
        <div class="team-section">
          <h2 class="section-title">Nuestro Equipo</h2>
          <p class="section-subtitle">
            Profesionales apasionados por la tecnología y el derecho
          </p>

          <div class="team-grid">
            <!-- Michael Sáez -->
            <div class="team-member">
              <div class="member-image-container">
                <img
                  :src="getMemberImage('michael-saez')"
                  alt="Michael Sáez"
                  class="member-image"
                  @error="handleImageError"
                />
                <div class="member-overlay">
                  <div class="member-social">
                    <a
                      href="https://linkedin.com/in/me-saezc"
                      target="_blank"
                      class="social-icon"
                      title="LinkedIn"
                    >
                      <v-icon color="white">mdi-linkedin</v-icon>
                    </a>
                    <a
                      href="https://github.com/maikostudios"
                      target="_blank"
                      class="social-icon"
                      title="GitHub"
                    >
                      <v-icon color="white">mdi-github</v-icon>
                    </a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h3 class="member-name">Michael Sáez</h3>
                <p class="member-role">Founder & CEO | Strategic Product & Technology Lead</p>
                <p class="member-description">
                  Líder de MaikoStudios con enfoque en alinear estrategia de negocio y tecnología
                  para brindar soluciones digitales de alto impacto. Experto en la dirección de
                  productos, integración tecnológica y generación de valor empresarial a través de
                  la innovación digital.
                </p>
                <div class="member-skills">
                  <v-chip size="small" color="primary">Digital Product Strategy</v-chip>
                  <v-chip size="small" color="primary">Technology Leadership</v-chip>
                  <v-chip size="small" color="primary">Business Automation</v-chip>
                  <v-chip size="small" color="primary">AI Integration</v-chip>
                  <v-chip size="small" color="primary">Scalable Web Solutions</v-chip>
                </div>
              </div>
            </div>

            <!-- Christian Calderón -->
            <div class="team-member">
              <div class="member-image-container">
                <img
                  :src="getMemberImage('christian-calderon')"
                  alt="Christian Calderón"
                  class="member-image"
                  @error="handleImageError"
                />
                <div class="member-overlay">
                  <div class="member-social">
                    <a href="#" target="_blank" class="social-icon" title="LinkedIn">
                      <v-icon color="white">mdi-linkedin</v-icon>
                    </a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h3 class="member-name">Christian Calderón</h3>
                <p class="member-role">Chief Technology & Architecture Officer (CTAO) – Partner</p>
                <p class="member-description">
                  Responsable de la estrategia tecnológica y arquitectónica de la compañía,
                  definición de infraestructura, integración de sistemas y estimación técnica de
                  proyectos, alineando tecnología con objetivos de negocio.
                </p>
                <div class="member-skills">
                  <v-chip size="small" color="primary">Arquitectura de Software</v-chip>
                  <v-chip size="small" color="primary">Infraestructura</v-chip>
                  <v-chip size="small" color="primary">Integración de Sistemas</v-chip>
                  <v-chip size="small" color="primary">Estrategia Tecnológica</v-chip>
                </div>
              </div>
            </div>

            <!-- Nataly Denisse Del Pino Ibáñez -->
            <div class="team-member">
              <div class="member-image-container">
                <img
                  :src="getMemberImage('nataly-delpino')"
                  alt="Nataly Del Pino"
                  class="member-image"
                  @error="handleImageError"
                />
                <div class="member-overlay">
                  <div class="member-social">
                    <a href="#" target="_blank" class="social-icon" title="LinkedIn">
                      <v-icon color="white">mdi-linkedin</v-icon>
                    </a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h3 class="member-name">Nataly Denisse Del Pino Ibáñez</h3>
                <p class="member-role">Abogada Consultora | Legal Advisor</p>
                <p class="member-description">
                  Abogada consultora especializada en derecho comercial y contratos tecnológicos.
                  Forma parte de la red de profesionales asociados de MaikoStudios, brindando
                  asesoría legal a clientes que requieren respaldo jurídico en proyectos digitales,
                  acuerdos comerciales y protección de propiedad intelectual.
                </p>
                <div class="member-skills">
                  <v-chip size="small" color="secondary">Tech Contracts</v-chip>
                  <v-chip size="small" color="secondary">Commercial Law</v-chip>
                  <v-chip size="small" color="secondary">Intellectual Property</v-chip>
                  <v-chip size="small" color="secondary">Legal Consulting</v-chip>
                  <v-chip size="small" color="secondary">Digital Business Legal Support</v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Valores -->
        <div class="valores-section">
          <h2 class="section-title">Nuestros Valores</h2>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <div class="valor-card">
                <v-icon size="40" color="primary">mdi-lightbulb-on</v-icon>
                <h3>Innovación</h3>
                <p>Adoptamos las últimas tecnologías para ofrecer soluciones de vanguardia</p>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="valor-card">
                <v-icon size="40" color="primary">mdi-shield-check</v-icon>
                <h3>Confianza</h3>
                <p>Respaldo legal y técnico en cada proyecto que desarrollamos</p>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="valor-card">
                <v-icon size="40" color="primary">mdi-star</v-icon>
                <h3>Excelencia</h3>
                <p>Compromiso con la calidad en cada detalle de nuestro trabajo</p>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="valor-card">
                <v-icon size="40" color="primary">mdi-account-group</v-icon>
                <h3>Colaboración</h3>
                <p>Trabajo en equipo para lograr los mejores resultados</p>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- CTA -->
        <div class="cta-section">
          <h2>¿Listo para trabajar con nosotros?</h2>
          <p>Contáctanos y descubre cómo podemos ayudarte a alcanzar tus objetivos</p>
          <div class="cta-buttons">
            <v-btn color="primary" size="large" to="/contacto">
              <v-icon left>mdi-email</v-icon>
              Contáctanos
            </v-btn>
            <v-btn color="secondary" size="large" variant="outlined" to="/servicios">
              <v-icon left>mdi-briefcase</v-icon>
              Ver Servicios
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue'

// Función para obtener la imagen del miembro o usar placeholder
const getMemberImage = (memberName) => {
  try {
    // Intentar cargar la imagen desde public/team
    return `/team/${memberName}.jpg`
  } catch (error) {
    // Si no existe, usar placeholder
    return getPlaceholder(memberName)
  }
}

// Generar placeholder personalizado según el miembro
const getPlaceholder = (memberName) => {
  const placeholders = {
    'michael-saez': 'https://ui-avatars.com/api/?name=Michael+Saez&size=400&background=121212&color=00cccc&bold=true&font-size=0.4',
    'christian-calderon': 'https://ui-avatars.com/api/?name=Christian+Calderon&size=400&background=121212&color=00cccc&bold=true&font-size=0.4',
    'nataly-delpino': 'https://ui-avatars.com/api/?name=Nataly+Del+Pino&size=400&background=121212&color=00cccc&bold=true&font-size=0.4'
  }
  return placeholders[memberName] || 'https://ui-avatars.com/api/?name=MaikoStudios&size=400&background=121212&color=00cccc&bold=true'
}

const handleImageError = (event) => {
  // Si falla la carga de la imagen, usar placeholder
  const memberName = event.target.alt.toLowerCase().replace(/\s+/g, '-')
  event.target.src = getPlaceholder(memberName)
}
</script>

<style scoped>
.quienes-somos-page {
  padding: 4rem 0;
  color: var(--color-text);
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--color-secondary);
  max-width: 700px;
  margin: 0 auto;
}

/* Misión y Visión */
.mision-vision-section {
  margin-bottom: 6rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  height: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 204, 204, 0.2);
}

.info-card h2 {
  color: var(--color-text);
  margin: 1rem 0;
  font-size: 1.8rem;
}

.info-card p {
  color: #cccccc;
  line-height: 1.8;
  font-size: 1.1rem;
}

/* Equipo */
.team-section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 1rem;
}

.section-subtitle {
  text-align: center;
  color: var(--color-secondary);
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.team-member {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 32px rgba(0, 204, 204, 0.3);
}

.member-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
}

.member-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-member:hover .member-image {
  transform: scale(1.1);
}

.member-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.team-member:hover .member-overlay {
  opacity: 1;
}

.member-social {
  display: flex;
  gap: 1rem;
}

.social-icon {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: var(--color-primary);
  transform: scale(1.1);
}

.member-info {
  padding: 2rem;
}

.member-name {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.member-role {
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-weight: 600;
}

.member-description {
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Valores */
.valores-section {
  margin-bottom: 6rem;
}

.valor-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  height: 100%;
  transition: transform 0.3s ease;
}

.valor-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
}

.valor-card h3 {
  color: var(--color-text);
  margin: 1rem 0;
  font-size: 1.3rem;
}

.valor-card p {
  color: #cccccc;
  line-height: 1.6;
}

/* CTA */
.cta-section {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(0, 204, 204, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(0, 204, 204, 0.2);
}

.cta-section h2 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.cta-section p {
  color: #cccccc;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .member-image-container {
    height: 350px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-buttons .v-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 2rem;
  }

  .info-card,
  .valor-card {
    padding: 1.5rem;
  }

  .member-info {
    padding: 1.5rem;
  }

  .member-image-container {
    height: 300px;
  }
}
</style>

