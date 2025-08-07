<template>
    <a :href="href"
        class="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
        :aria-label="ariaLabel">
        <slot>{{ text }}</slot>
    </a>
</template>

<script setup lang="ts">
defineProps({
    href: { type: String, required: true },
    text: { type: String, required: false, default: '' },
    ariaLabel: { type: String, required: false, default: '' }
});
</script>
