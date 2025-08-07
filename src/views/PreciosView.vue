<template>
  <div class="precios-view">
    <Navbar />
    <SpotlightEffect />

    <!-- Hero Section -->
    <section class="hero-section">
      <v-container>
        <div class="text-center py-16">
          <h1 class="display-1 font-weight-bold mb-4 text-white">
            Elige tu Pack, Escala con Nuestros Planes
          </h1>
          <p class="headline mb-6 text-grey-lighten-1">
            Formaliza, digitaliza y crece con Maiko Studios. Soluciones a medida para tu negocio, desde la constitución
            hasta el acompañamiento continuo.
          </p>

          <!-- CTAs Hero -->
          <div class="d-flex justify-center gap-4 flex-wrap">
            <v-btn color="success" size="large" variant="elevated" prepend-icon="mdi-whatsapp" @click="abrirWhatsApp"
              class="px-8">
              Hablar por WhatsApp
            </v-btn>
            <v-btn color="primary" size="large" variant="outlined" prepend-icon="mdi-email" @click="abrirContacto"
              class="px-8">
              Contáctanos
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Sección Packs (Pago Único) -->
    <section class="packs-section py-16">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="display-2 font-weight-bold mb-4 text-white">
            Packs (Pago Único)
          </h2>
          <p class="title text-grey-lighten-1 mb-8">
            Impulsa tu negocio desde el inicio con nuestros packs de pago único, diseñados para formalizar y digitalizar
            tu empresa de forma rápida y eficiente.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4 text-grey-lighten-1">Cargando packs...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <v-icon color="error" size="48">mdi-alert-circle</v-icon>
          <p class="error-text text-red">{{ error }}</p>
          <v-btn @click="loadPricingPacks" color="primary" variant="outlined" class="mt-4">
            Reintentar
          </v-btn>
        </div>

        <!-- Packs Grid -->
        <v-row v-else-if="hasPacksData" class="justify-center">
          <v-col v-for="(pack, index) in activePacks" :key="pack.id" cols="12" sm="6" md="4" lg="4" xl="4"
            class="d-flex">
            <v-card class="pricing-card h-100 transparent-card" :class="{ 'highlighted': pack.styling?.highlighted }"
              color="transparent" variant="outlined" elevation="0">
              <!-- Badge -->
              <div v-if="pack.badge?.show" class="pack-badge">
                <v-chip :color="pack.badge.color" size="small" variant="elevated" class="ma-2">
                  {{ pack.badge.text }}
                </v-chip>
              </div>

              <v-card-text class="pa-6">
                <!-- Título y Subtítulo -->
                <div class="text-center mb-6">
                  <h3 class="text-h4 font-weight-bold mb-2">{{ pack.name }}</h3>
                  <p v-if="pack.subtitle" class="text-body-1 text-grey-lighten-1">{{ pack.subtitle }}</p>
                </div>

                <!-- Precio -->
                <div class="text-center mb-6">
                  <div class="price-container">
                    <span class="currency">{{ pack.price.currency === 'USD' ? '$' : pack.price.currency }}</span>
                    <span class="price">{{ formatPrice(pack.price.monthly) }}</span>
                    <span class="period">/único</span>
                  </div>
                  <p v-if="pack.price.annual && pack.price.annual !== pack.price.monthly"
                    class="text-caption text-grey">
                    Ahorra {{ calculateSavings(pack.price.monthly, pack.price.annual) }}% con pago anual
                  </p>
                </div>

                <!-- Features -->
                <div class="features-list mb-6">
                  <div v-for="feature in pack.features" :key="feature" class="feature-item d-flex align-center mb-2">
                    <v-icon color="success" size="small" class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2">{{ feature }}</span>
                  </div>
                </div>
              </v-card-text>

              <!-- CTA -->
              <v-card-actions class="pa-6 pt-0">
                <v-btn color="green" variant="elevated" size="large" block @click="contactarPack(pack)"
                  class="whatsapp-btn">
                  <v-icon class="mr-2">mdi-whatsapp</v-icon>
                  {{ pack.cta?.text || 'Contactar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Sección Planes (Suscripción) -->
    <section class="planes-section py-16 bg-grey-darken-4">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="display-2 font-weight-bold mb-4 text-white">
            Planes (Acompañamiento Continuo)
          </h2>
          <p class="title text-grey-lighten-1 mb-8">
            Escala tu negocio con nuestros planes de acompañamiento mensual. Soporte continuo, actualizaciones y
            crecimiento sostenido.
          </p>
        </div>

        <!-- Loading state para planes -->
        <div v-if="loadingPlans" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="text-white mt-4">Cargando planes...</p>
        </div>

        <!-- Error state para planes -->
        <div v-else-if="errorPlans" class="text-center py-8">
          <v-icon color="error" size="64">mdi-alert-circle</v-icon>
          <p class="text-error mt-4">{{ errorPlans }}</p>
          <v-btn color="primary" @click="loadPricingPlans" class="mt-4">
            Reintentar
          </v-btn>
        </div>

        <!-- Planes dinámicos -->
        <v-row v-else-if="pricingPlans.length > 0" class="justify-center">
          <v-col v-for="(plan, index) in pricingPlans" :key="plan.id" cols="12" sm="6" md="4" lg="4" xl="4"
            class="d-flex">
            <v-card class="pricing-card h-100 transparent-card" :class="{ 'highlighted': plan.highlighted }"
              color="transparent" variant="outlined" elevation="0">
              <!-- Badge Más Popular -->
              <div v-if="plan.highlighted" class="plan-badge">
                <v-chip color="success" size="small" variant="elevated" class="ma-2">
                  Más Popular
                </v-chip>
              </div>

              <v-card-text class="pa-6">
                <!-- Título -->
                <div class="text-center mb-6">
                  <h3 class="text-h4 font-weight-bold mb-2">{{ plan.name }}</h3>
                  <p class="text-body-1 text-grey-lighten-1">{{ plan.description }}</p>
                </div>

                <!-- Precio -->
                <div class="text-center mb-6">
                  <div class="price-container">
                    <span class="currency">$</span>
                    <span class="price">{{ plan.monthlyPrice }}</span>
                    <span class="period">/mes</span>
                  </div>
                  <p class="text-caption text-grey">
                    ${{ plan.annualPrice }}/año (ahorra {{ Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12))
                      * 100) }}%)
                  </p>
                </div>

                <!-- Features -->
                <div class="features-list mb-6">
                  <div v-for="feature in plan.features" :key="feature" class="feature-item d-flex align-center mb-2">
                    <v-icon color="success" size="small" class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2">{{ feature }}</span>
                  </div>
                </div>
              </v-card-text>

              <!-- CTA -->
              <v-card-actions class="pa-6 pt-0">
                <v-btn color="green" variant="elevated" size="large" block @click="contactarPlan(plan)"
                  class="whatsapp-btn">
                  <v-icon class="mr-2">mdi-whatsapp</v-icon>
                  Comenzar Plan
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty state para planes -->
        <div v-else class="text-center py-8">
          <v-icon color="primary" size="64">mdi-calendar-month</v-icon>
          <h3 class="text-white mt-4">No hay planes disponibles</h3>
          <p class="text-grey-lighten-1">Los planes de suscripción se están preparando. Vuelve pronto.</p>
          <v-btn @click="abrirWhatsApp" color="primary" size="large" class="mt-4">
            Consultar por WhatsApp
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- Sección FAQ -->
    <section class="faq-section py-16">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="display-2 font-weight-bold mb-4 text-white">
            Preguntas Frecuentes
          </h2>
          <p class="title text-grey-lighten-1">
            Resolvemos tus dudas sobre nuestros packs y planes
          </p>
        </div>

        <div class="row justify-center">
          <div class="col-lg-8">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel v-for="(faq, index) in faqData" :key="index">
                <v-expansion-panel-title class="text-h6 font-weight-medium">
                  {{ faq.question }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p class="text-body-1">{{ faq.answer }}</p>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Sección de Contacto Final -->
    <section class="contact-final-section py-16 bg-primary">
      <v-container>
        <div class="text-center">
          <h2 class="display-2 font-weight-bold mb-4 text-white">
            ¿Listo para Comenzar?
          </h2>
          <p class="title mb-8 text-white">
            Contáctanos y comencemos a hacer realidad tu proyecto digital
          </p>

          <div class="d-flex justify-center gap-4 flex-wrap">
            <v-btn color="success" size="x-large" variant="elevated" prepend-icon="mdi-whatsapp" @click="abrirWhatsApp"
              class="px-8">
              Hablar por WhatsApp
            </v-btn>
            <v-btn color="white" size="x-large" variant="outlined" prepend-icon="mdi-email" @click="abrirContacto"
              class="px-8">
              Formulario de Contacto
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { pricingService } from '@/services/pricingService'
import SpotlightEffect from '@/components/SpotlightEffect.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

// Reactive data
const pricingPacks = ref([])
const pricingPlans = ref([])
const loading = ref(true)
const loadingPlans = ref(true)
const error = ref(null)
const errorPlans = ref(null)

// Datos FAQ
const faqData = ref([
  {
    question: '¿Cuál es la diferencia entre Packs y Planes?',
    answer: 'Los Packs son servicios de pago único ideales para proyectos específicos como crear una página web o formalizar tu empresa. Los Planes son servicios de suscripción mensual para acompañamiento continuo, actualizaciones y soporte.'
  },
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación y te notificaremos sobre cualquier diferencia de precio.'
  },
  {
    question: '¿Ofrecen garantía de satisfacción?',
    answer: 'Absolutamente. Ofrecemos garantía de satisfacción de 30 días en todos nuestros servicios. Si no estás completamente satisfecho, te devolvemos tu dinero.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias, tarjetas de crédito/débito, PayPal y pagos en efectivo. Para planes anuales ofrecemos descuentos especiales.'
  },
  {
    question: '¿Incluyen hosting y dominio?',
    answer: 'Sí, todos nuestros packs web incluyen hosting por 1 año y registro de dominio .com o .cl. Los planes de suscripción incluyen hosting ilimitado.'
  },
  {
    question: '¿Hacen proyectos personalizados?',
    answer: 'Por supuesto. Si ninguno de nuestros packs se ajusta a tus necesidades, creamos soluciones completamente personalizadas. Contáctanos para una cotización.'
  }
])

// Computed properties
const activePacks = computed(() => {
  return pricingPacks.value.filter(pack => pack.active)
})

const hasPacksData = computed(() => {
  return activePacks.value.length > 0
})

// Métodos
const loadPricingPacks = async () => {
  try {
    loading.value = true
    error.value = null
    const packs = await pricingService.getAllPacks()
    pricingPacks.value = packs
  } catch (err) {
    error.value = 'Error al cargar los packs. Por favor, intenta nuevamente.'
    console.error('Error loading pricing packs:', err)
  } finally {
    loading.value = false
  }
}

const loadPricingPlans = async () => {
  try {
    loadingPlans.value = true
    errorPlans.value = null
    const plans = await pricingService.getAllPlans()
    pricingPlans.value = plans
  } catch (err) {
    errorPlans.value = 'Error al cargar los planes. Por favor, intenta nuevamente.'
    console.error('Error loading pricing plans:', err)
  } finally {
    loadingPlans.value = false
  }
}

// Funciones de utilidad
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL').format(price)
}

const calculateSavings = (monthly, annual) => {
  if (!annual || !monthly) return 0
  const monthlyCost = monthly * 12
  return Math.round(((monthlyCost - annual) / monthlyCost) * 100)
}

// Funciones de contacto
const abrirWhatsApp = () => {
  const mensaje = encodeURIComponent(
    '¡Hola! Me interesa conocer más sobre los servicios de MaikoStudios. ¿Podrían ayudarme a elegir el mejor pack o plan para mi proyecto?'
  )
  const numeroWhatsApp = '56912345678' // Reemplazar con el número real
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
}

const abrirContacto = () => {
  // Navegar al formulario de contacto o abrir modal
  window.location.href = '#contacto'
}

const contactarPack = (pack) => {
  const mensaje = encodeURIComponent(
    `¡Hola! Me interesa el pack "${pack.name}" de $${formatPrice(pack.price.monthly)}. ¿Podrían darme más información?`
  )
  const numeroWhatsApp = '56912345678' // Reemplazar con el número real
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
}

const contactarPlan = (plan) => {
  const mensaje = encodeURIComponent(
    `¡Hola! Me interesa el "${plan.name}" de $${plan.monthlyPrice}/mes. ¿Podrían darme más información sobre el acompañamiento continuo?`
  )
  const numeroWhatsApp = '56912345678' // Reemplazar con el número real
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
}

// Lifecycle
onMounted(() => {
  loadPricingPacks()
  loadPricingPlans()
})
</script>

<style scoped>
.precios-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
  position: relative;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(0, 204, 204, 0.1) 0%, rgba(18, 18, 18, 0.9) 100%);
  position: relative;
  z-index: 2;
}

/* Pricing Cards */
.pricing-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 204, 204, 0.2);
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 204, 204, 0.2) !important;
  border-color: rgba(0, 204, 204, 0.4);
}

.pricing-card.highlighted {
  border: 2px solid #00cccc;
  box-shadow: 0 0 30px rgba(0, 204, 204, 0.3);
}

/* Price Display */
.price-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.currency {
  font-size: 1.2rem;
  font-weight: 600;
  color: #00cccc;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #888;
  font-weight: 500;
}

/* Features List */
.features-list {
  list-style: none;
  padding: 0;
}

.feature-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-item:last-child {
  border-bottom: none;
}

/* Badges */
.pack-badge,
.plan-badge {
  position: absolute;
  top: -8px;
  right: 16px;
  z-index: 2;
}

.pack-badge .v-chip,
.plan-badge .v-chip {
  background: #25D366 !important;
  color: white !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
}
  z-index: 3;
}

/* Sections */
.packs-section {
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
}

.planes-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.faq-section {
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 100%);
}

/* FAQ Panels */
.faq-panels {
  background: transparent;
}

.faq-panels .v-expansion-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 204, 204, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
}

.faq-panels .v-expansion-panel:hover {
  border-color: rgba(0, 204, 204, 0.4);
}

/* Contact Final Section */
.contact-final-section {
  background: linear-gradient(135deg, #00cccc 0%, #008b8b 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .price {
    font-size: 2.5rem;
  }

  .pricing-card {
    margin-bottom: 24px;
  }

  .hero-section .display-1 {
    font-size: 2.5rem !important;
  }

  .hero-section .headline {
    font-size: 1.2rem !important;
  }
}

@media (max-width: 480px) {
  .price {
    font-size: 2rem;
  }

  .hero-section .display-1 {
    font-size: 2rem !important;
  }

  .d-flex.gap-4 {
    flex-direction: column;
    gap: 16px !important;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pricing-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Transparent Card Styles */
.transparent-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;
}

.transparent-card:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(0, 204, 204, 0.3) !important;
  transform: translateY(-4px);
}

.transparent-card.highlighted {
  border-color: rgba(76, 175, 80, 0.5) !important;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.2);
}

/* WhatsApp Button Styles */
.whatsapp-btn {
  background: #25D366 !important;
  color: white !important;
  transition: all 0.3s ease;
}

.whatsapp-btn:hover {
  background: #128C7E !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

/* Utilities */
.gap-4 {
  gap: 1rem;
}

.h-100 {
  height: 100%;
}
</style>
