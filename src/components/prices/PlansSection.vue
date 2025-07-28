<template>
    <section class="max-w-7xl mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold mb-6">Planes (Suscripción)</h2>
        <div class="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PlanCard v-for="plan in plans" :key="plan.id" :name="plan.name" :price="plan.price"
                :periodicity="plan.periodicity" :features="plan.features"
                :highlight="plan.name.toLowerCase().includes('pyme')" />
        </div>
        <div class="md:hidden snap-x overflow-x-auto flex gap-4 pb-4">
            <div v-for="plan in plans" :key="plan.id" class="snap-start min-w-[280px] flex-shrink-0">
                <PlanCard :name="plan.name" :price="plan.price" :periodicity="plan.periodicity"
                    :features="plan.features" :highlight="plan.name.toLowerCase().includes('pyme')" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCatalog } from '../../stores/useCatalog';
import PlanCard from './PlanCard.vue';

const catalog = useCatalog();

onMounted(() => {
    catalog.fetchAll();
});

const plans = catalog.plans;
</script>
