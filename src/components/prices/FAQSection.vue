<template>
    <section class="max-w-7xl mx-auto px-4 py-12 text-light">
        <h2 class="text-2xl font-bold mb-6">Preguntas Frecuentes (FAQ)</h2>
        <div class="grid md:grid-cols-2 gap-6">
            <div v-for="(item, index) in faqs" :key="index"
                class="bg-night/70 backdrop-blur-lg rounded-2xl shadow-xl p-6"
                :aria-label="'Pregunta: ' + item.pregunta">
                <h3 class="font-semibold mb-2">{{ item.pregunta }}</h3>
                <p>{{ item.respuesta }}</p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface FAQ {
    pregunta: string;
    respuesta: string;
}

const faqs = ref<FAQ[]>([]);

const fetchFAQs = async () => {
    // Array estático de preguntas frecuentes
    faqs.value = [
        {
            pregunta: "¿Cuánto tiempo toma desarrollar un sitio web?",
            respuesta: "Dependiendo de la complejidad, un sitio corporativo tradicional toma entre 2 a 4 semanas. Proyectos a medida, aplicaciones y tiendas online suelen llevar entre 1 y 3 meses de trabajo continuo."
        },
        {
            pregunta: "¿Ofrecen servicios de mantención?",
            respuesta: "Sí, todos nuestros sitios incluyen mantención básica, pero ofrecemos planes de suscripción para soporte continuo, integraciones extra, resolución de tickets 24/7 y mejoras visuales constantes."
        },
        {
            pregunta: "¿Cuáles son las formas de pago?",
            respuesta: "Aceptamos pago vía transferencia interbancaria, tarjetas de débito/crédito y en casos internacionales admitimos PayPal. Generalmente se solicita un 50% al empezar el contrato y el restante contra-entrega o en cuotas establecidas."
        },
        {
            pregunta: "¿Tienen sistema de facturación o facturan a mi empresa?",
            respuesta: "Sí. Podemos emitir boleta de honorarios o factura exenta según el requerimiento de la entidad y la naturaleza de los servicios."
        }
    ];
};

onMounted(() => {
    fetchFAQs();
});
</script>
