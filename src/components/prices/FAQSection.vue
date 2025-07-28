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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface FAQ {
    pregunta: string;
    respuesta: string;
}

const faqs = ref<FAQ[]>([]);

const fetchFAQs = async () => {
    const snapshot = await getDocs(collection(db, 'faq'));
    faqs.value = [];
    snapshot.forEach((doc) => {
        faqs.value.push(doc.data() as FAQ);
    });
};

onMounted(() => {
    fetchFAQs();
});
</script>
