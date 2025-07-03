<template>
  <Form @submit="handleSubmit(onSubmit)">
    <Field name="email" v-slot="{ field, errorMessage }">
      <v-text-field v-bind="field" label="Correo electrónico" :error-messages="errorMessage" />
    </Field>
    <Field name="telefono" v-slot="{ field, errorMessage }">
      <v-text-field v-bind="field" label="Teléfono" placeholder="+56987654321" :error-messages="errorMessage" />
    </Field>

    <div class="d-flex justify-space-between mt-4">
      <v-btn variant="outlined" @click="store.prevStep()">Atrás</v-btn>
      <v-btn color="primary" type="submit">Siguiente</v-btn>
    </div>
  </Form>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore'
import { useForm, Field, Form } from 'vee-validate'
import { pasoTresSchema } from '@/composables/validationSchemas'

const store = useFormStore()

const { handleSubmit } = useForm({
  validationSchema: pasoTresSchema,
  initialValues: {
    email: store.formData.email,
    telefono: store.formData.telefono
  }
})

function onSubmit (vals) {
  store.updateFormData(vals)
  store.nextStep()
}
</script>
