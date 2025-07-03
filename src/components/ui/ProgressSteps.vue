<template>
  <v-stepper v-model="internal" class="my-6" alt-labels>
    <v-stepper-header>
      <v-stepper-item :complete="current > 1" value="1" icon="mdi-lightbulb" />
      <v-divider></v-divider>
      <v-stepper-item :complete="current > 2" value="2" icon="mdi-rocket-launch" />
      <v-divider></v-divider>
      <v-stepper-item :complete="current > 3" value="3" icon="mdi-chart-line" />
      <v-divider></v-divider>
      <v-stepper-item :complete="current > 4" value="4" icon="mdi-bullseye" />
    </v-stepper-header>
  </v-stepper>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  current: { type: Number, required: true }
})

const internal = ref(props.current)
watch(
  () => props.current,
  val => {
    internal.value = val
  }
)
</script>
