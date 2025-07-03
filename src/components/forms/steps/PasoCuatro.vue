<template>
  <Form @submit="triggerSubmit">
    <v-textarea
      v-model="mensaje"
      v-bind="mensajeAttrs"
      rows="5"
      label="Cuéntanos tu idea"
      :error-messages="errors.mensaje"
    />
    <v-file-input v-model="archivo" label="Adjuntar archivo (opcional)" />

    <div class="d-flex justify-space-between mt-4">
      <v-btn variant="outlined" @click="store.prevStep()">Atrás</v-btn>
      <v-btn color="primary" type="submit">Enviar</v-btn>
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue';
import { useFormStore } from '@/stores/formStore';
import { guardarFormulario } from '@/services/firestoreService';
import { useMainStore } from '@/stores/main';
import { useForm, Form } from 'vee-validate';
import { pasoCuatroSchema } from '@/composables/validationSchemas';

const store = useFormStore();
const mainStore = useMainStore();
const archivo = ref(null);

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: pasoCuatroSchema,
  initialValues: { mensaje: store.formData.mensaje },
});

const [mensaje, mensajeAttrs] = defineField('mensaje');

const triggerSubmit = handleSubmit(async (values) => {
  store.updateFormData({ ...values, archivo: archivo.value });
  const { success, codigo, error } = await guardarFormulario(store.formData);
  if (success) {
    store.updateFormData({ enviado: true, codigo });
    mainStore.notify?.({ type: 'success', message: `Código de seguimiento: ${codigo}` });
    store.nextStep();
  } else {
    mainStore.notify?.({ type: 'error', message: error });
  }
});
</script>
