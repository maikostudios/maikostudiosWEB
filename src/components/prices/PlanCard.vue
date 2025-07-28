<template>
    <div :class="[
        'bg-night/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col justify-between h-full',
        highlight ? 'ring-4 ring-cta' : ''
    ]">
        <div>
            <h3 class="text-xl font-semibold mb-2">{{ name }}</h3>
            <p class="text-2xl font-bold mb-4">{{ formatCurrency(price) }} <span class="text-sm font-normal">/ {{
                periodicityLabel }}</span></p>
            <ul class="mb-4 space-y-1">
                <li v-for="(feature, index) in features" :key="index" class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ feature }}</span>
                </li>
            </ul>
        </div>
        <div class="flex gap-4">
            <router-link to="/contacto"
                class="border border-primary text-primary hover:bg-primary/10 rounded-full px-4 py-2 text-center flex-1 font-semibold">¿Dudas?</router-link>
            <a href="https://wa.me/56983833148" target="_blank" rel="noopener"
                class="bg-primary hover:bg-primary/80 text-light rounded-full px-4 py-2 text-center flex-1 font-semibold">Contratar</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    periodicity: { type: String as () => 'monthly' | 'annual', required: true },
    features: { type: Array as () => string[], required: true },
    highlight: { type: Boolean, required: false, default: false },
});

const periodicityLabel = computed(() => {
    return props.periodicity === 'monthly' ? 'mes' : 'año';
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value);
};
</script>
