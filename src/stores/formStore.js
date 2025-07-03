import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store para manejar el estado del formulario interactivo tipo wizard
 */
export const useFormStore = defineStore('form', () => {
  // Paso actual (1‒4)
  const currentStep = ref(1)
  const totalSteps = 4

  // Datos del formulario
  const formData = ref({
    nombre: '',
    servicio: '',
    email: '',
    telefono: '',
    mensaje: '',
    archivo: null,
    utm: {},
    fuente: '', // canal entrada (Home / Campañas / Instagram etc.)
    formulario: 'interactivo'
  })

  // GETTERS --------------------------------------------------------------
  const progress = computed(() => (currentStep.value / totalSteps) * 100)
  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === totalSteps)

  // ACTIONS --------------------------------------------------------------
  function nextStep() {
    if (currentStep.value < totalSteps) currentStep.value += 1
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value -= 1
  }

  function updateFormData(payload) {
    formData.value = { ...formData.value, ...payload }
  }

  function resetForm() {
    currentStep.value = 1
    formData.value = {
      nombre: '',
      servicio: '',
      email: '',
      telefono: '',
      mensaje: '',
      archivo: null,
      utm: {},
      fuente: '',
      formulario: 'interactivo'
    }
  }

  return {
    currentStep,
    totalSteps,
    formData,
    progress,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    updateFormData,
    resetForm
  }
})
