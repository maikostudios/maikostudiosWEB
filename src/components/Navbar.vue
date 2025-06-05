<template>
  <v-app-bar app color="background" class="navbar" elevation="0">
    <v-container class="d-flex align-center px-4">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand">
        <img src="/logo/logo_maikostudio.png" alt="Maiko Studios Logo" class="navbar-logo" />
      </RouterLink>

      <!-- Mobile Menu Button -->
      <v-btn
        icon
        class="d-md-none ml-auto"
        @click="mobileMenu = !mobileMenu"
      >
        <v-icon>{{ mobileMenu ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>

      <!-- Desktop Navigation -->
      <nav class="navbar-nav d-none d-md-flex ml-auto">
        <v-btn to="/" text>Inicio</v-btn>
        <v-btn to="/sobre-mi" text>Sobre Mí</v-btn>
        <v-btn to="/servicios" text>Servicios</v-btn>
        <v-btn to="/portafolio" text>Portafolio</v-btn>
        <v-btn to="/cv" text>CV</v-btn>
        <v-btn to="/contacto" text color="primary">Contacto</v-btn>
      </nav>
    </v-container>

    <!-- Mobile Navigation Menu -->
    <v-navigation-drawer
      v-model="mobileMenu"
      location="right"
      temporary
      class="mobile-menu"
    >
      <v-list>
        <v-list-item to="/" @click="mobileMenu = false">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item to="/sobre-mi" @click="mobileMenu = false">
          <v-list-item-title>Sobre Mí</v-list-item-title>
        </v-list-item>
        <v-list-item to="/servicios" @click="mobileMenu = false">
          <v-list-item-title>Servicios</v-list-item-title>
        </v-list-item>
        <v-list-item to="/portafolio" @click="mobileMenu = false">
          <v-list-item-title>Portafolio</v-list-item-title>
        </v-list-item>
        <v-list-item to="/cv" @click="mobileMenu = false">
          <v-list-item-title>CV</v-list-item-title>
        </v-list-item>
        <v-list-item to="/contacto" @click="mobileMenu = false">
          <v-list-item-title>Contacto</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Social Links in Mobile Menu -->
      <div class="mobile-social-links pa-4">
        <v-btn
          href="https://github.com/maikostudios"
          target="_blank"
          icon="mdi-github"
          variant="text"
        />
        <v-btn
          href="https://linkedin.com/in/me-saezc"
          target="_blank"
          icon="mdi-linkedin"
          variant="text"
        />
        <v-btn
          href="https://wa.me/56949475207"
          target="_blank"
          icon="mdi-whatsapp"
          variant="text"
          color="success"
        />
      </div>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenu = ref(false)
</script>

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
  background: rgba(10, 10, 10, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 40px;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: scale(1.05);
}

.navbar-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Mobile Menu Styles */
.mobile-menu {
  background: var(--color-background) !important;
}

.mobile-social-links {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .navbar-logo {
    height: 32px;
  }
}
</style>