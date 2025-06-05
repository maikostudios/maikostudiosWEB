<template>
  <section id="contacto" class="contacto-section">
    <v-container>
      <h2 class="section-title">¿Listo para empezar tu proyecto?</h2>
      
      <div class="contacto-grid">
        <div class="contacto-info">
          <h3>Conectemos</h3>
          <p class="lead-text">
            Estoy disponible para nuevos proyectos y colaboraciones. ¡Hablemos sobre cómo puedo ayudarte!
          </p>
          
          <div class="contact-methods">
            <a href="mailto:m.esteban.saez@gmail.com" class="contact-method">
              <v-icon color="primary">mdi-email</v-icon>
              <span>m.esteban.saez@gmail.com</span>
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

        <div class="contacto-form">
          <v-form @submit.prevent="enviarFormulario">
            <v-text-field
              v-model="form.nombre"
              label="Nombre"
              variant="outlined"
              color="primary"
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              variant="outlined"
              color="primary"
            ></v-text-field>

            <v-select
              v-model="form.tipo"
              :items="tiposProyecto"
              label="Tipo de Proyecto"
              variant="outlined"
              color="primary"
            ></v-select>

            <v-textarea
              v-model="form.mensaje"
              label="Mensaje"
              variant="outlined"
              color="primary"
              rows="4"
            ></v-textarea>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
            >
              Enviar Mensaje
            </v-btn>
          </v-form>
        </div>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  nombre: '',
  email: '',
  tipo: '',
  mensaje: ''
})

const tiposProyecto = [
  'Desarrollo Web',
  'Aplicación Móvil',
  'Consultoría',
  'Mentoría',
  'Otro'
]

const enviarFormulario = () => {
  // Implementar lógica de envío
  console.log('Formulario enviado:', form.value)
}
</script>

<style scoped>
.contacto-section {
  padding: 6rem 0;
  background: linear-gradient(to bottom, var(--color-background), #0d0d0d);
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