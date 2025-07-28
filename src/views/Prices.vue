<template>
    <div class="bg-gradient-to-b from-night via-[#06204D] to-night min-h-screen text-light font-sans">
        <HeroSection />
        <PacksSection />
        <PlansSection />
        <AddOnsSection />
        <FAQSection />
        <TestimonialsSection />
        <CTAStickyMobile />
    </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/prices/HeroSection.vue';
import PacksSection from '../components/prices/PacksSection.vue';
import PlansSection from '../components/prices/PlansSection.vue';
import AddOnsSection from '../components/prices/AddOnsSection.vue';
import FAQSection from '../components/prices/FAQSection.vue';
import TestimonialsSection from '../components/prices/TestimonialsSection.vue';
import CTAStickyMobile from '../components/prices/CTAStickyMobile.vue';
</script>
