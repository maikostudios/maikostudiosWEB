<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand">
        <img src="/logo/logo_maikostudio.png" alt="Maiko Studios Logo" class="navbar-logo" />
      </RouterLink>

      <!-- Desktop Navigation -->
      <div class="nav-links">
        <RouterLink to="/sobre-mi" class="nav-link">Sobre Mí</RouterLink>
        <RouterLink to="/servicios" class="nav-link">Servicios</RouterLink>
        <RouterLink to="/portafolio" class="nav-link">Portafolio</RouterLink>
        <RouterLink to="/cv" class="nav-link">CV</RouterLink>
      </div>

      <!-- Social Links -->
      <div class="social-links">
        <a href="https://github.com/maikostudios" target="_blank" class="social-link" title="GitHub">
          <v-icon>mdi-github</v-icon>
        </a>
        <a href="https://linkedin.com/in/me-saezc" target="_blank" class="social-link" title="LinkedIn">
          <v-icon>mdi-linkedin</v-icon>
        </a>
        <RouterLink to="/contacto" class="contact-button">
          Contacto
        </RouterLink>
      </div>

      <!-- Mobile Menu Button -->
      <button class="menu-button d-md-none" @click="toggleMenu">
        <v-icon>{{ isMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </button>

      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'is-open': isMenuOpen }">
        <RouterLink to="/sobre-mi" class="mobile-link" @click="closeMenu">Sobre Mí</RouterLink>
        <RouterLink to="/servicios" class="mobile-link" @click="closeMenu">Servicios</RouterLink>
        <RouterLink to="/portafolio" class="mobile-link" @click="closeMenu">Portafolio</RouterLink>
        <RouterLink to="/cv" class="mobile-link" @click="closeMenu">CV</RouterLink>
        <RouterLink to="/contacto" class="mobile-link" @click="closeMenu">Contacto</RouterLink>

        <div class="mobile-social-links">
          <a href="https://github.com/maikostudios" target="_blank" class="social-link" title="GitHub">
            <v-icon>mdi-github</v-icon>
          </a>
          <a href="https://linkedin.com/in/me-saezc" target="_blank" class="social-link" title="LinkedIn">
            <v-icon>mdi-linkedin</v-icon>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 40px;
  transition: transform 0.2s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: none;
  align-items: center;
  gap: 1rem;
}

.social-links {
  display: none;
  align-items: center;
  gap: 1rem;
}

.nav-link,
.social-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;
}

.nav-link:hover,
.social-link:hover {
  color: var(--color-primary);
}

.contact-button {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.contact-button:hover {
  background: #0052cc;
}

.menu-button {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  padding: 2rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-menu.is-open {
  transform: translateX(0);
}

.mobile-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.2rem;
  padding: 0.5rem 0;
}

.mobile-social-links {
  margin-top: auto;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Tablet breakpoint */
@media (min-width: 768px) and (max-width: 1023px) {
  .nav-links {
    display: none;
    /* Mantener menú móvil en tablets */
  }

  .social-links {
    display: none;
  }

  .menu-button {
    display: block;
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  .nav-links {
    display: flex;
    margin-left: auto;
  }

  .social-links {
    display: flex;
    margin-left: 2rem;
  }

  .menu-button {
    display: none;
  }

  .mobile-menu {
    display: none;
  }
}

/* Mejoras para mobile */
@media (max-width: 767px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .mobile-menu {
    padding: 1.5rem;
    gap: 1rem;
  }

  .mobile-link {
    font-size: 1.1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-link:last-of-type {
    border-bottom: none;
  }
}
</style>