<template>
  <section class="landing-menu">
    <v-container class="py-8">
      <!-- Logo + Intro -->
      <div class="text-center mb-6">
        <img
          v-if="logoSrc"
          :src="logoSrc"
          alt="MaikoStudios"
          class="mx-auto mb-3 landing-logo"
          width="120"
          height="120"
          loading="eager"
        />
        <h1 class="landing-title">Impulsa tu negocio digital</h1>
        <p class="landing-subtitle">Desarrollo web, marketing digital y automatización con IA</p>
      </div>

      <!-- CTA Principal -->
      <v-btn
        color="secondary"
        size="x-large"
        block
        class="mb-3 cta-shadow"
        :href="whatsappHref"
        target="_blank"
        rel="noopener"
        aria-label="Hablar por WhatsApp"
      >
        <v-icon start>mdi-whatsapp</v-icon>
        Hablar por WhatsApp — respondemos en minutos
      </v-btn>

      <!-- CTAs secundarios -->
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-btn
            color="primary"
            size="large"
            block
            class="mb-3"
            :href="agendaHref"
            target="_blank"
            rel="noopener"
            aria-label="Agendar una reunión"
          >
            <v-icon start>mdi-calendar-clock</v-icon>
            Agendar una reunión
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            color="primary"
            size="large"
            block
            class="mb-3"
            :href="mailtoHref"
            aria-label="Enviar correo"
          >
            <v-icon start>mdi-email</v-icon>
            Enviar correo (sin compromiso)
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <RouterLink :to="serviciosTo" custom v-slot="{ navigate }">
            <v-btn color="surface" size="large" block class="mb-3" @click="navigate" aria-label="Ver servicios">
              <v-icon start>mdi-briefcase</v-icon>
              Servicios
            </v-btn>
          </RouterLink>
        </v-col>
        <v-col cols="12" sm="6">
          <RouterLink :to="preciosTo" custom v-slot="{ navigate }">
            <v-btn color="surface" size="large" block class="mb-3" @click="navigate" aria-label="Ver precios">
              <v-icon start>mdi-currency-usd</v-icon>
              Precios y planes
            </v-btn>
          </RouterLink>
        </v-col>
        <v-col cols="12">
          <RouterLink :to="homeTo" custom v-slot="{ navigate }">
            <v-btn color="surface" size="large" block class="mb-3" @click="navigate" aria-label="Explorar sitio">
              <v-icon start>mdi-home</v-icon>
              Explorar sitio principal
            </v-btn>
          </RouterLink>
        </v-col>
      </v-row>

      <!-- Acceso directo al chatbot -->
      <div class="text-center mt-4">
        <v-btn variant="text" color="secondary" @click="abrirChatbot" aria-label="Abrir chatbot">
          <v-icon start>mdi-robot</v-icon>
          ¿Tienes dudas? Pregúntale a MaikoBot
        </v-btn>
      </div>

      <!-- Resumen opcional -->
      <div class="mt-8 landing-summary">
        <h3 class="mb-2">Soluciones para PYMEs y emprendedores</h3>
        <ul>
          <li>Desarrollo web y e-commerce</li>
          <li>Marketing digital y publicidad online</li>
          <li>Automatización de procesos con IA</li>
          <li>Relatorías y cursos</li>
          <li>Sublimación y personalización</li>
        </ul>
      </div>
    </v-container>

    <!-- Botón flotante solo móvil -->
    <div class="fixed-cta-mobile">
      <v-btn :href="whatsappHref" target="_blank" color="secondary" size="large" block rounded="lg" class="cta-shadow">
        <v-icon start>mdi-whatsapp</v-icon>
        WhatsApp
      </v-btn>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const logoSrc = '/logo_maikostudios_light.svg'

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
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(0, 204, 204, 0.12) 0%, rgba(10, 10, 10, 0.92) 100%);
}
.landing-logo { filter: drop-shadow(0 0 12px rgba(0,204,204,0.25)); }
.landing-title { font-weight: 700; font-size: 1.6rem; }
.landing-subtitle { color: #a8b3c1; }
.cta-shadow { box-shadow: 0 12px 32px rgba(0, 204, 204, 0.25); }
.landing-summary { color: #d9e2ec; opacity: .9; font-size: .95rem; }
.landing-summary ul { margin: 0; padding-left: 1.2rem; }

/* Fixed CTA for mobile */
.fixed-cta-mobile { position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 50; display: none; }
@media (max-width: 600px) {
  .fixed-cta-mobile { display: block; }
}
</style>

