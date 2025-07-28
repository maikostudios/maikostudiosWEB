<template>
    <section class="max-w-7xl mx-auto px-4 py-12 text-light">
        <h2 class="text-2xl font-bold mb-6">Historias de Éxito: Nuestros Clientes Hablan</h2>
        <Carousel :autoplay="true" :loop="true" :perPage="3" :breakpoints="breakpoints" :mouseDrag="true"
            :pauseAutoplayOnHover="true">
            <Slide v-for="(testimonial, index) in testimonials" :key="index">
                <div
                    class="bg-night/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center text-center h-full">
                    <img :src="testimonial.avatarURL" alt="Avatar" class="w-20 h-20 rounded-full mb-4 object-cover" />
                    <p class="mb-2 italic">"{{ testimonial.quote }}"</p>
                    <p class="font-semibold">{{ testimonial.name }}</p>
                    <p class="text-sm text-light/80">{{ testimonial.role }}</p>
                </div>
            </Slide>
        </Carousel>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

interface Testimonial {
    name: string;
    role: string;
    quote: string;
    avatarURL: string;
}

const testimonials = ref<Testimonial[]>([]);

const fetchTestimonials = async () => {
    const snapshot = await getDocs(collection(db, 'testimonials'));
    testimonials.value = [];
    snapshot.forEach((doc) => {
        testimonials.value.push(doc.data() as Testimonial);
    });
};

onMounted(() => {
    fetchTestimonials();
});

const breakpoints = {
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
};
</script>
