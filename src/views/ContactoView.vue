<template>
    <BaseLayout>
        <section class="contacto-page">
            <v-container>
                <div class="page-header">
                    <h1 class="page-title">Contacto</h1>
                    <p class="page-subtitle">¿Tienes un proyecto en mente? ¡Hablemos!</p>
                </div>

                <div class="contacto-content">
                    <!-- Información de contacto -->
                    <div class="contacto-info">
                        <h2>Conectemos</h2>
                        <p class="lead-text">
                            Estoy disponible para nuevos proyectos y colaboraciones.
                            ¡Hablemos sobre cómo puedo ayudarte a digitalizar tu negocio!
                        </p>

                        <div class="contact-methods">
                            <a href="mailto:m.esteban.saez@gmail.com" class="contact-method">
                                <v-icon color="primary">mdi-email</v-icon>
                                <div>
                                    <strong>Email</strong>
                                    <span>m.esteban.saez@gmail.com</span>
                                </div>
                            </a>

                            <a href="https://wa.me/56949475207" target="_blank" class="contact-method">
                                <v-icon color="primary">mdi-whatsapp</v-icon>
                                <div>
                                    <strong>WhatsApp</strong>
                                    <span>+56 9 4947 5207</span>
                                </div>
                            </a>

                            <a href="https://linkedin.com/in/me-saezc" target="_blank" class="contact-method">
                                <v-icon color="primary">mdi-linkedin</v-icon>
                                <div>
                                    <strong>LinkedIn</strong>
                                    <span>linkedin.com/in/me-saezc</span>
                                </div>
                            </a>

                            <div class="contact-method">
                                <v-icon color="primary">mdi-map-marker</v-icon>
                                <div>
                                    <strong>Ubicación</strong>
                                    <span>Temuco, Chile</span>
                                </div>
                            </div>
                        </div>

                        <div class="horarios">
                            <h3>Horarios de Atención</h3>
                            <p><strong>Lunes a Viernes:</strong> 9:00 - 18:00</p>
                            <p><strong>Sábados:</strong> 10:00 - 14:00</p>
                            <p><strong>Respuesta promedio:</strong> 2-4 horas</p>
                        </div>
                    </div>

                    <!-- Formulario de contacto -->
                    <div class="formulario-contacto">
                        <FormularioContacto />
                    </div>
                </div>
            </v-container>
        </section>
    </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue'
import FormularioContacto from '@/components/FormularioContacto.vue'
</script>

<style scoped>
.contacto-page {
    padding: 4rem 0;
    color: var(--color-text);
}

.page-header {
    text-align: center;
    margin-bottom: 4rem;
}

.page-title {
    font-size: 3rem;
    color: var(--color-text);
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.2rem;
    color: var(--color-secondary);
}

.contacto-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
}

.contacto-info h2 {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: 1rem;
}

.lead-text {
    font-size: 1.1rem;
    color: #cccccc;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.contact-methods {
    margin-bottom: 3rem;
}

.contact-method {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.3s ease;
}

.contact-method:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}

.contact-method div {
    display: flex;
    flex-direction: column;
}

.contact-method strong {
    color: var(--color-primary);
    margin-bottom: 0.25rem;
}

.contact-method span {
    color: #cccccc;
    font-size: 0.9rem;
}

.horarios {
    background: rgba(0, 102, 255, 0.1);
    border: 1px solid var(--color-primary);
    border-radius: 12px;
    padding: 1.5rem;
}

.horarios h3 {
    color: var(--color-primary);
    margin-bottom: 1rem;
}

.horarios p {
    color: #cccccc;
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .contacto-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .page-title {
        font-size: 2rem;
    }
}
</style>