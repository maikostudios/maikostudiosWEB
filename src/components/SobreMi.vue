<template>
  <section id="sobre-mi" class="sobre-mi-section">
    <v-container>
      <div class="content-wrapper">
        <div class="section-header">
          <h2 class="section-title">Sobre Mí</h2>
          <p class="section-subtitle">Conoce más sobre mi trayectoria y pasión por la tecnología</p>
        </div>
        <div class="profile-content">
          <div class="profile-image">
            <img src="https://avatars.githubusercontent.com/u/68249859?v=4" alt="Michael Sáez" class="avatar" />
          </div>
          <div class="profile-text">
            <p class="lead-text">
              Desarrollador Full Stack apasionado por crear soluciones tecnológicas que impulsen el éxito de empresas y
              emprendedores.
            </p>
            <p class="description">
              Con más de 5 años de experiencia en desarrollo web y consultoría tecnológica, me especializo en crear
              aplicaciones web modernas y eficientes. Mi enfoque combina expertise técnico con una comprensión profunda
              de las necesidades empresariales.
            </p>
            <div class="tech-stack">
              <h3>Tecnologías Principales</h3>
              <div class="tech-tags">
                <span class="tech-tag">Vue.js</span>
                <span class="tech-tag">React</span>
                <span class="tech-tag">Node.js</span>
                <span class="tech-tag">Python</span>
                <span class="tech-tag">Java</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.sobre-mi-section {
  padding: 6rem 0;
  background: transparent;
  position: relative;
  z-index: 2;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--color-secondary);
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: center;
}

.profile-image {
  text-align: center;
}

.avatar {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  border: 4px solid var(--color-primary);
}

.profile-text {
  color: var(--color-text);
}

.lead-text {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.tech-stack h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-secondary);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tech-tag {
  background: rgba(0, 102, 255, 0.1);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--color-primary);
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .avatar {
    width: 200px;
    height: 200px;
    margin-bottom: 2rem;
  }

  .tech-tags {
    justify-content: center;
  }
}
</style>