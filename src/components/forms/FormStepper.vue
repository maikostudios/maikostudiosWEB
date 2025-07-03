<template>
  <div>
    <ProgressSteps :current="store.currentStep" />

    <transition name="fade" mode="out-in">
      <component :is="currentComponent" />
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import PasoUno from './steps/PasoUno.vue'
import PasoDos from './steps/PasoDos.vue'
import PasoTres from './steps/PasoTres.vue'
import PasoCuatro from './steps/PasoCuatro.vue'
import FormSuccess from './FormSuccess.vue'
import ProgressSteps from '@/components/ui/ProgressSteps.vue'

const store = useFormStore()

const componentMap = {
  1: PasoUno,
  2: PasoDos,
  3: PasoTres,
  4: PasoCuatro,
  success: FormSuccess
}

const currentComponent = computed(() => {
  return store.isLastStep && store.formData.enviado
    ? componentMap.success
    : componentMap[store.currentStep]
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
