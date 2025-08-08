<template>
    <ClientOnly>
        <div class="fixed bottom-4 inset-x-4 md:hidden flex gap-2">
            <SecondaryBtn to="/contacto" text="¿Dudas?" class="flex-1" aria-label="¿Dudas?" />
            <PrimaryBtn href="https://wa.me/56920648446" text="Contratar" class="flex-1" aria-label="Contratar" />
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import PrimaryBtn from '../ui/PrimaryBtn.vue';
import SecondaryBtn from '../ui/SecondaryBtn.vue';
</script>
