<template>
  <footer class="footer">
    <v-container>
      <div class="footer-content">
        <div class="footer-brand">
          <img src="/logo/logo_maikostudio.png" alt="Maiko Studios Logo" class="footer-logo" />
          <p class="tagline">Aprende, crea y digitaliza tu mundo</p>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Navegación</h4>
            <router-link to="/">Inicio</router-link>
            <router-link to="/sobre-mi">Sobre Mí</router-link>
            <router-link to="/servicios">Servicios</router-link>
            <router-link to="/portafolio">Portafolio</router-link>
            <router-link to="/contacto">Contacto</router-link>
          </div>

          <div class="link-group">
            <h4>Servicios</h4>
            <a href="#servicios">Desarrollo Web</a>
            <a href="#servicios">Consultoría</a>
            <a href="#servicios">Mentoría</a>
            <a href="#servicios">Soporte Técnico</a>
          </div>

          <div class="link-group">
            <h4>Conecta</h4>
            <a href="https://github.com/maikostudios" target="_blank">GitHub</a>
            <a href="https://linkedin.com/in/me-saezc" target="_blank">LinkedIn</a>
            <a href="https://wa.me/56949475207" target="_blank">WhatsApp</a>
            <a href="mailto:m.esteban.saez@gmail.com">Email</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Maiko Studios. Todos los derechos reservados.</p>
      </div>
    </v-container>
  </footer>
</template>

<style scoped>
.footer {
  background: #0a0a0a;
  padding: 4rem 0 2rem;
  color: var(--color-text);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  text-align: center;
}

.footer-logo {
  width: 120px;
  margin-bottom: 1rem;
}

.tagline {
  color: #cccccc;
  font-size: 1rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h4 {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.link-group a {
  display: block;
  color: #cccccc;
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .link-group {
    margin-bottom: 2rem;
  }
}
</style>