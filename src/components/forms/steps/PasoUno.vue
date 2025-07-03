<template>
  <Form>
    <Field name="nombre" v-slot="{ field, errorMessage }">
      <v-text-field v-bind="field" :error-messages="errorMessage" label="Nombre completo" autofocus />
    </Field>
        <v-btn color="primary" @click="triggerSubmit">Siguiente</v-btn>
  </Form>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore'
import { useForm, Field, Form } from 'vee-validate'
import { pasoUnoSchema } from '@/composables/validationSchemas'

const store = useFormStore()
const { handleSubmit } = useForm({
  validationSchema: pasoUnoSchema,
  initialValues: { nombre: store.formData.nombre }
})

const triggerSubmit = handleSubmit(vals => {
  console.log('PasoUno submit', vals);
  store.updateFormData(vals);
  store.nextStep();
});
</script>
