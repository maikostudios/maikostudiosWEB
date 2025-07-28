<template>
  <section id="contacto" class="contacto-section">
    <v-container>
      <h2 class="section-title">¿Listo para empezar tu proyecto?</h2>

      <div class="contacto-grid">
        <!-- INFORMACIÓN DE CONTACTO -->
        <div class="contacto-info">
          <h3>Conectemos</h3>
          <p class="lead-text">
            Estoy disponible para nuevos proyectos y colaboraciones. ¡Hablemos sobre cómo puedo ayudarte!
          </p>
          <!-- BOTÓN DE AGENDA DE GOOGLE CALENDAR -->

          <h3>Agenda una cita !!</h3>
          <div ref="calendarBtnContainer"></div>


          <div class="contact-methods">
            <a href="mailto:contacto@maikostudios.com" class="contact-method">
              <v-icon color="primary">mdi-email</v-icon>
              <span>contacto@maikostudios.com</span>
            </a>
            <a href="https://wa.me/56949475207" target="_blank" class="contact-method">
              <v-icon color="primary">mdi-whatsapp</v-icon>
              <span>+56 9 4947 5207</span>
            </a>
            <a href="https://linkedin.com/in/me-saezc" target="_blank" class="contact-method">
              <v-icon color="primary">mdi-linkedin</v-icon>
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/maikostudios" target="_blank" class="contact-method">
              <v-icon color="primary">mdi-github</v-icon>
              <span>GitHub</span>
            </a>
          </div>
        </div>



        <!-- FORMULARIO DE CONTACTO -->
        <div class="contacto-form">
          <h3 class="form-title">¿Tienes un proyecto en mente?</h3>
          <p class="form-subtitle">Completa el formulario y conversemos sobre tu idea</p>

          <v-form ref="formRef" v-model="valid" @submit.prevent="enviarFormulario">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.nombre" label="Tu nombre" :rules="[rules.required]" variant="outlined"
                  color="primary" prepend-inner-icon="mdi-account" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.email" label="Tu email" type="email" :rules="[rules.required, rules.email]"
                  variant="outlined" color="primary" prepend-inner-icon="mdi-email" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.telefono" label="Teléfono (opcional)" variant="outlined" color="primary"
                  prepend-inner-icon="mdi-phone" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.empresa" label="Empresa (opcional)" variant="outlined" color="primary"
                  prepend-inner-icon="mdi-office-building" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select v-model="form.tipo" :items="tiposProyecto" label="¿Qué tipo de colaboración buscas?"
                  :rules="[rules.required]" variant="outlined" color="primary" prepend-inner-icon="mdi-briefcase" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field v-model="form.origen" label="¿Cómo me conociste?"
                  placeholder="Ej: LinkedIn, recomendación, búsqueda web..." variant="outlined" color="primary"
                  prepend-inner-icon="mdi-account-search" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea v-model="form.mensaje" label="Tu mensaje" placeholder="Cuéntame en qué puedo ayudarte..."
                  :rules="[rules.required, rules.minLength]" variant="outlined" color="primary" rows="4" counter="500"
                  maxlength="500" prepend-inner-icon="mdi-message-text" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-checkbox v-model="form.aceptaTerminos" :rules="[rules.required]" color="primary">
                  <template #label>
                    <span class="checkbox-label">
                      Acepto que mis datos sean utilizados para responder a mi consulta
                    </span>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>

            <v-btn type="submit" color="primary" size="large" block :loading="enviando" :disabled="!valid">
              <v-icon left>mdi-send</v-icon>
              Enviar Mensaje
            </v-btn>
          </v-form>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'

const store = useMainStore()

// Refs y estado del formulario
const formRef = ref(null)
const valid = ref(false)
const enviando = ref(false)
const calendarBtnContainer = ref(null)

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  empresa: '',
  tipo: '',
  origen: '',
  mensaje: '',
  aceptaTerminos: false
})

const tiposProyecto = [
  'Desarrollo Web a Medida',
  'Aplicación Móvil',
  'Consultoría Tecnológica',
  'Automatización de Procesos',
  'Integración de Sistemas',
  'Mentoría y Capacitación',
  'Soporte Técnico',
  'Transformación Digital',
  'Otro'
]

const rules = {
  required: value => !!value || 'Este campo es obligatorio',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Ingresa un email válido',
  minLength: value => value.length >= 10 || 'El mensaje debe tener al menos 10 caracteres'
}

const enviarFormulario = async () => {
  if (!valid.value) return
  enviando.value = true
  try {
    const datos = {
      nombre: form.value.nombre,
      email: form.value.email,
      telefono: form.value.telefono || null,
      empresa: form.value.empresa || null,
      asunto: form.value.tipo,
      origen: form.value.origen || null,
      mensaje: form.value.mensaje,
      origen_formulario: 'componente_contacto'
    }
    const resultado = await store.enviarMensajeContacto(datos)
    if (resultado.success) {
      form.value = {
        nombre: '', email: '', telefono: '', empresa: '', tipo: '',
        origen: '', mensaje: '', aceptaTerminos: false
      }
      formRef.value?.resetValidation()
      alert('¡Mensaje enviado correctamente! Te responderé pronto.')
    } else {
      alert('Error al enviar el mensaje. Inténtalo de nuevo.')
    }
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    alert('Error inesperado. Inténtalo de nuevo.')
  } finally {
    enviando.value = false
  }
}

// Carga dinámica de script y estilo de Google Calendar
onMounted(() => {
  const cssLink = document.createElement('link')
  cssLink.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
  cssLink.rel = 'stylesheet'
  document.head.appendChild(cssLink)

  const script = document.createElement('script')
  script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
  script.async = true
  script.onload = () => {
    if (window.calendar && window.calendar.schedulingButton) {
      window.calendar.schedulingButton.load({
        url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2p9Ze-9NKD-jsYpiuZdc2cWMMqELw4D5lXrsOOjEReUHizC-25JERMy5PdYfX3GAwelQoFSB7_?gv=true',
        color: '#039BE5',
        label: 'Programar una cita',
        target: calendarBtnContainer.value
      })
    }
  }
  document.body.appendChild(script)
})
</script>

<style scoped>
.contacto-section {
  padding: 6rem 0;
  background: transparent;
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 2.5rem;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 4rem;
}

.contacto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contacto-info h3 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.lead-text {
  font-size: 1.2rem;
  color: #cccccc;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-method:hover {
  color: var(--color-primary);
}

.contacto-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-title {
  font-size: 1.8rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #cccccc;
  margin-bottom: 2rem;
}

.checkbox-label {
  color: #cccccc;
  font-size: 0.9rem;
}

/* Personalizar los campos de Vuetify para el tema oscuro */
:deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.v-field--focused) {
  border-color: var(--color-primary);
}

:deep(.v-label) {
  color: #cccccc;
}

:deep(.v-field__input) {
  color: var(--color-text);
}

@media (max-width: 768px) {
  .contacto-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contacto-info {
    text-align: center;
  }

  .contact-methods {
    align-items: center;
  }
}
</style>
