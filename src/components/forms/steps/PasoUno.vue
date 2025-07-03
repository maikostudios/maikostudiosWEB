<template>
  <Form @submit="triggerSubmit">
    <v-text-field
      v-model="nombre"
      v-bind="nombreAttrs"
      :error-messages="errors.nombre"
      label="Nombre completo"
      autofocus
    />
    <v-btn color="primary" type="submit">Siguiente</v-btn>
  </Form>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore';
import { useForm, Form } from 'vee-validate';
import { pasoUnoSchema } from '@/composables/validationSchemas';

const store = useFormStore();

// Obtenemos 'errors' para mostrar los mensajes y usamos defineField para la vinculación
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: pasoUnoSchema,
  initialValues: { nombre: store.formData.nombre },
});

const [nombre, nombreAttrs] = defineField('nombre');

const onInvalidSubmit = ({ errors }) => {
  console.error('La validación falló:', errors);
};

const triggerSubmit = handleSubmit((values) => {
  console.log('PasoUno submit:', values);
  store.updateFormData(values);
  store.nextStep();
}, onInvalidSubmit);
</script>
