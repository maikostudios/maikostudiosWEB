<template>
    <section class="max-w-7xl mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold mb-6">Packs (Pago Único)</h2>
        <div class="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PackCard v-for="pack in packs" :key="pack.id" :name="pack.name" :price="pack.price"
                :features="pack.features" />
        </div>
        <div class="md:hidden snap-x overflow-x-auto flex gap-4 pb-4">
            <div v-for="pack in packs" :key="pack.id" class="snap-start min-w-[280px] flex-shrink-0">
                <PackCard :name="pack.name" :price="pack.price" :features="pack.features" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCatalog } from '../../stores/useCatalog';
import PackCard from './PackCard.vue';

const catalog = useCatalog();

onMounted(() => {
    catalog.fetchAll();
});

const packs = catalog.packs;
</script>
