<template>
    <section class="relative text-light">
        <!-- Image removed temporarily due to missing file hero-bg.jpg -->
        <!-- <img src="/assets/hero-bg.jpg" class="absolute inset-0 h-full w-full object-cover -z-10"
            alt="Hero Background" /> -->
        <div class="max-w-4xl mx-auto py-16 text-center space-y-6">
            <h1 class="text-3xl md:text-5xl font-bold">Elige tu Pack, Escala con Nuestros Planes</h1>
            <p class="md:text-lg text-light/80">Formaliza, digitaliza y crece con Maiko Studios.</p>
            <PrimaryBtn href="https://wa.me/56920648446" text="Hablar por WhatsApp" aria-label="Hablar por WhatsApp" />
        </div>
    </section>
</template>

<script setup lang="ts">
import PrimaryBtn from '../ui/PrimaryBtn.vue';
</script>
