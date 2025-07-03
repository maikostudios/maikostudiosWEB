<template>
  <v-tooltip v-bind="$attrs" location="end">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>
    <slot />
  </v-tooltip>
</template>

<script setup>
// Componente wrapper para facilitar el uso de tooltips animados
// Props y attrs se pasan directamente a v-tooltip de Vuetify
</script>
