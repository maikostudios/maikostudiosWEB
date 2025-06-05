<template>
  <div class="background">
    <div class="spotlight" ref="spotlight"></div>
    <nav class="navbar">
      <img src="../public/logo/logo_maikostudio.png" alt="Maiko Studios" class="nav-logo" />
      <div class="nav-links">
        <a href="#servicios">Servicios</a>
        <a href="#proyectos">Proyectos</a>
        <a href="#contacto">Contacto</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <img src="../public/logo/logo_maikostudio.png" alt="Maiko Studios" class="logo" />
        <h1>Transformamos Ideas en Soluciones Digitales</h1>
        <p class="hero-text">Desarrollo web profesional, automatización y educación digital para empresas y particulares</p>
        <div class="cta-buttons">
          <a href="#contacto" class="btn primary">Iniciar Proyecto</a>
          <a href="#servicios" class="btn secondary">Explorar Servicios</a>
        </div>
      </div>
    </section>

    <!-- Servicios Empresariales -->
    <section id="servicios" class="services">
      <div class="container">
        <h2>Servicios Empresariales</h2>
        <div class="services-grid">
          <div class="service-card">
            <h3>Desarrollo Web</h3>
            <p>Sitios y aplicaciones web modernas y escalables</p>
          </div>
          <div class="service-card">
            <h3>Automatización</h3>
            <p>Optimización de procesos y flujos de trabajo</p>
          </div>
          <div class="service-card">
            <h3>Consultoría Tech</h3>
            <p>Asesoría estratégica en transformación digital</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Freelance -->
    <section class="freelance">
      <div class="container">
        <h2>Servicios Freelance</h2>
        <div class="services-grid">
          <div class="service-card">
            <h3>Sitios Web</h3>
            <p>Diseño y desarrollo para emprendedores</p>
          </div>
          <div class="service-card">
            <h3>Educación</h3>
            <p>Clases y mentorías en programación</p>
          </div>
          <div class="service-card">
            <h3>Soporte Tech</h3>
            <p>Asistencia técnica personalizada</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Proyectos -->
    <section id="proyectos" class="projects">
      <div class="container">
        <h2>Proyectos Destacados</h2>
        <div class="projects-grid">
          <div class="project-card">
            <h3>Proyecto 1</h3>
            <p>Descripción del proyecto y tecnologías utilizadas</p>
          </div>
          <div class="project-card">
            <h3>Proyecto 2</h3>
            <p>Descripción del proyecto y tecnologías utilizadas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="contact">
      <div class="container">
        <h2>Iniciemos tu Proyecto</h2>
        <form class="contact-form">
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Cuéntanos sobre tu proyecto" required></textarea>
          <button type="submit" class="btn primary">Enviar Mensaje</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const spotlight = ref(null)
let mouseActive = false
let timeout

function handleMouseMove(e) {
  mouseActive = true
  clearTimeout(timeout)

  spotlight.value.style.opacity = '1'
  spotlight.value.style.top = `${e.clientY}px`
  spotlight.value.style.left = `${e.clientX}px`

  timeout = setTimeout(() => {
    mouseActive = false
    spotlight.value.style.opacity = '0'
  }, 3000)
}

function animateSpotlight() {
  if (!mouseActive) {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    spotlight.value.style.top = `${y}px`
    spotlight.value.style.left = `${x}px`
    spotlight.value.style.opacity = '1'

    setTimeout(() => {
      spotlight.value.style.opacity = '0'
    }, 2000)
  }

  setTimeout(animateSpotlight, 2000)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  animateSpotlight()
})
</script>

<style scoped>
.background {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background);
  overflow: hidden;
}

.spotlight {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.3), transparent 70%);
  filter: blur(50px);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-out;
  z-index: 1;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.nav-logo {
  height: 2.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  text-align: center;
}

.logo {
  width: 100%;
  max-width: 20rem;
  margin-bottom: 2rem;
}

.hero-text {
  font-size: 1.2rem;
  margin: 1.5rem 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn.primary {
  background: var(--color-primary);
  color: white;
}

.btn.secondary {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.services-grid, .projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card, .project-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.service-card:hover, .project-card:hover {
  transform: translateY(-5px);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

input, textarea {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--color-text);
}

textarea {
  min-height: 150px;
  resize: vertical;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-logo {
    height: 2rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .container {
    padding: 1rem;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .hero-text {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .logo {
    max-width: 15rem;
  }
}
</style>