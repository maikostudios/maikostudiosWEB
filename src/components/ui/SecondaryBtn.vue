<template>
    <RouterLink :to="to"
        class="inline-flex px-5 py-3 rounded-full font-semibold border border-primary text-primary hover:bg-primary/10 transition"
        :aria-label="ariaLabel">
        <slot>{{ text }}</slot>
    </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
    to: { type: String, required: true },
    text: { type: String, required: false, default: '' },
    ariaLabel: { type: String, required: false, default: '' }
});
</script>
