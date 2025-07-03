import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFormStore = defineStore('form', () => {
  const currentStep = ref(1);
  const totalSteps = 5; // 4 pasos + pantalla de gracias

  const initialFormData = {
    nombre: '',
    servicio: '',
    email: '',
    telefono: '',
    mensaje: '',
    archivo: null,
    utm: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    },
    fuente: '',
    formulario: 'interactivo',
    enviado: false,
    codigo: '',
  };

  const formData = ref({ ...initialFormData });

  const progress = computed(() => ((currentStep.value - 1) / (totalSteps - 1)) * 100);
  const isFirstStep = computed(() => currentStep.value === 1);
  const isLastStep = computed(() => currentStep.value === totalSteps);

  function nextStep() {
    if (currentStep.value < totalSteps) currentStep.value++;
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value--;
  }

  function updateFormData(payload) {
    formData.value = { ...formData.value, ...payload };
  }

  function setUtmParams(params) {
    formData.value.utm = {
      utm_source: params.utm_source || '',
      utm_medium: params.utm_medium || '',
      utm_campaign: params.utm_campaign || '',
      utm_term: params.utm_term || '',
      utm_content: params.utm_content || '',
    };
  }

  function resetForm() {
    currentStep.value = 1;
    formData.value = { ...initialFormData };
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
    resetForm,
    setUtmParams,
  };
});
