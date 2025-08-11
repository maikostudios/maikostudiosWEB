<template>
  <div class="landing-menu">
    <!-- CTA Principal WhatsApp -->
    <v-btn
      size="x-large"
      block
      class="mb-4 whatsapp-primary-btn"
      :href="whatsappHref"
      target="_blank"
      rel="noopener"
      aria-label="Hablar por WhatsApp"
    >
      <v-icon start size="24">mdi-whatsapp</v-icon>
      <span class="cta-text">Hablar por WhatsApp</span>
    </v-btn>

    <!-- CTAs secundarios en grid -->
    <div class="secondary-ctas-grid">
      <v-btn
        variant="outlined"
        color="primary"
        size="large"
        class="secondary-btn"
        :href="agendaHref"
        target="_blank"
        rel="noopener"
        aria-label="Agendar reunión"
      >
        <v-icon start>mdi-calendar-clock</v-icon>
        <span class="btn-text">Agendar reunión</span>
      </v-btn>

      <v-btn
        variant="outlined"
        color="primary"
        size="large"
        class="secondary-btn"
        :href="mailtoHref"
        aria-label="Enviar correo"
      >
        <v-icon start>mdi-email</v-icon>
        <span class="btn-text">Enviar correo</span>
      </v-btn>
    </div>

    <!-- Navegación interna -->
    <div class="navigation-section">
      <RouterLink :to="serviciosTo" custom v-slot="{ navigate }">
        <v-btn
          variant="text"
          color="secondary"
          size="large"
          block
          class="nav-btn"
          @click="navigate"
          aria-label="Ver servicios"
        >
          <v-icon start>mdi-briefcase</v-icon>
          <span class="btn-text">Servicios</span>
        </v-btn>
      </RouterLink>

      <RouterLink :to="preciosTo" custom v-slot="{ navigate }">
        <v-btn
          variant="text"
          color="secondary"
          size="large"
          block
          class="nav-btn"
          @click="navigate"
          aria-label="Ver precios"
        >
          <v-icon start>mdi-currency-usd</v-icon>
          <span class="btn-text">Precios</span>
        </v-btn>
      </RouterLink>

      <RouterLink :to="homeTo" custom v-slot="{ navigate }">
        <v-btn
          variant="text"
          color="secondary"
          size="large"
          block
          class="nav-btn"
          @click="navigate"
          aria-label="Explorar sitio"
        >
          <v-icon start>mdi-home</v-icon>
          <span class="btn-text">Sitio principal</span>
        </v-btn>
      </RouterLink>
    </div>

    <!-- Acceso al chatbot -->
    <div class="chatbot-section">
      <v-btn
        variant="text"
        color="secondary"
        size="medium"
        block
        class="chatbot-btn"
        @click="abrirChatbot"
        aria-label="Abrir chatbot"
      >
        <v-icon start>mdi-robot</v-icon>
        <span class="btn-text">¿Dudas? Pregúntale a MaikoBot</span>
      </v-btn>
    </div>

    <!-- Botón flotante móvil -->
    <div class="fixed-cta-mobile">
      <v-btn
        :href="whatsappHref"
        target="_blank"
        size="large"
        block
        class="whatsapp-mobile-btn"
        aria-label="WhatsApp"
      >
        <v-icon start size="20">mdi-whatsapp</v-icon>
        <span class="mobile-btn-text">WhatsApp</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const logoSrc = '/logo/logo_maikostudio.png'

const UTM = 'utm_source=landing&utm_medium=qr&utm_campaign=conversion'

const numeroWhatsApp = '56920648446'
const mensajeWA = encodeURIComponent('Hola! Vengo desde el QR de la tarjeta. Me gustaría información para mi negocio (web/marketing/IA).')
const whatsappHref = computed(() => `https://wa.me/${numeroWhatsApp}?text=${mensajeWA}`)

// Google Calendar scheduling url (reusado desde ContactoView)
const agendaBase = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2p9Ze-9NKD-jsYpiuZdc2cWMMqELw4D5lXrsOOjEReUHizC-25JERMy5PdYfX3GAwelQoFSB7_?gv=true'
const agendaHref = computed(() => `${agendaBase}&${UTM}`)

// Mailto
const correo = 'contacto@maikostudios.com'
const subject = encodeURIComponent('Consulta desde Landing QR')
const body = encodeURIComponent('Hola MaikoStudios,\n\nVi su landing desde el código QR y me interesa conversar.\n\n— Enviado con UTM: landing/qr/conversion')
const mailtoHref = computed(() => `mailto:${correo}?subject=${subject}&body=${body}`)

// Internal routes with UTM appended as query
const serviciosTo = computed(() => ({ name: 'Servicios', query: { utm_source: 'landing', utm_medium: 'qr', utm_campaign: 'conversion' } }))
const preciosTo = computed(() => ({ name: 'Precios', query: { utm_source: 'landing', utm_medium: 'qr', utm_campaign: 'conversion' } }))
const homeTo = computed(() => ({ name: 'Home', query: { utm_source: 'landing', utm_medium: 'qr', utm_campaign: 'conversion' } }))

const abrirChatbot = () => {
  const btn = document.querySelector('.chat-toggle-btn')
  if (btn && typeof (btn).click === 'function') {
    btn.click()
  }
}
</script>

<style scoped>
.landing-menu {
  max-width: 400px;
  margin: 0 auto;
  padding: 0 1rem;
  background: transparent;
}

/* CTA Principal WhatsApp */
.whatsapp-primary-btn {
  background: linear-gradient(135deg, #25D366 0%, #075E54 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
  height: 56px !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3) !important;
  transition: all 0.3s ease !important;
  text-transform: none !important;
}

.whatsapp-primary-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 32px rgba(37, 211, 102, 0.4) !important;
}

.whatsapp-primary-btn .cta-text {
  font-size: 1rem;
  font-weight: 600;
}

/* CTAs secundarios */
.secondary-ctas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(0, 102, 255, 0.3) !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  height: 48px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  text-transform: none !important;
}

.secondary-btn:hover {
  background: rgba(0, 102, 255, 0.1) !important;
  border-color: rgba(0, 102, 255, 0.5) !important;
  transform: translateY(-1px) !important;
}

.secondary-btn .btn-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Navegación interna */
.navigation-section {
  margin-bottom: 1.5rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.03) !important;
  color: #00cccc !important;
  font-weight: 500 !important;
  height: 44px !important;
  margin-bottom: 0.5rem !important;
  border-radius: 6px !important;
  transition: all 0.3s ease !important;
  text-transform: none !important;
}

.nav-btn:hover {
  background: rgba(0, 204, 204, 0.1) !important;
  color: #ffffff !important;
}

.nav-btn .btn-text {
  font-size: 0.9rem;
}

/* Chatbot */
.chatbot-section {
  margin-bottom: 2rem;
}

.chatbot-btn {
  background: transparent !important;
  color: #00cccc !important;
  font-weight: 400 !important;
  height: 40px !important;
  border-radius: 6px !important;
  text-transform: none !important;
  opacity: 0.8;
}

.chatbot-btn:hover {
  background: rgba(0, 204, 204, 0.05) !important;
  opacity: 1;
}

.chatbot-btn .btn-text {
  font-size: 0.85rem;
}

/* Botón flotante móvil */
.fixed-cta-mobile {
  position: fixed;
  left: 16px;
  right: calc(16px + 84px);
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 50;
  display: none;
}

.whatsapp-mobile-btn {
  background: linear-gradient(135deg, #25D366 0%, #075E54 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  height: 48px !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4) !important;
  text-transform: none !important;
}

.mobile-btn-text {
  font-size: 0.95rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 600px) {
  .landing-menu {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }

  .fixed-cta-mobile {
    display: block;
  }

  .secondary-ctas-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .secondary-btn {
    height: 44px !important;
  }

  .secondary-btn .btn-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .landing-menu {
    padding: 0 0.75rem calc(80px + env(safe-area-inset-bottom)) 0.75rem;
  }

  .whatsapp-primary-btn {
    height: 52px !important;
    font-size: 1rem !important;
  }

  .whatsapp-primary-btn .cta-text {
    font-size: 0.95rem;
  }
}

/* Evitar overflow horizontal */
* {
  box-sizing: border-box;
}

.landing-menu * {
  max-width: 100%;
  word-wrap: break-word;
}
</style>

