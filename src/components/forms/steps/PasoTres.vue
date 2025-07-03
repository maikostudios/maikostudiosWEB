<template>
  <Form @submit="triggerSubmit">
    <v-text-field
      v-model="email"
      v-bind="emailAttrs"
      label="Correo electrónico"
      :error-messages="errors.email"
    />
    <v-text-field
      v-model="telefono"
      v-bind="telefonoAttrs"
      label="Teléfono"
      placeholder="+56987654321"
      :error-messages="errors.telefono"
    />

    <div class="d-flex justify-space-between mt-4">
      <v-btn variant="outlined" @click="store.prevStep()">Atrás</v-btn>
      <v-btn color="primary" type="submit">Siguiente</v-btn>
    </div>
  </Form>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore';
import { useForm, Form } from 'vee-validate';
import { pasoTresSchema } from '@/composables/validationSchemas';

const store = useFormStore();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: pasoTresSchema,
  initialValues: {
    email: store.formData.email,
    telefono: store.formData.telefono
  }
});

const [email, emailAttrs] = defineField('email');
const [telefono, telefonoAttrs] = defineField('telefono');

const triggerSubmit = handleSubmit(values => {
  store.updateFormData(values);
  store.nextStep();
});
</script>
