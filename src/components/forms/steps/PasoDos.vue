<template>
  <Form @submit="triggerSubmit">
    <v-select
      v-model="servicio"
      v-bind="servicioAttrs"
      :items="items"
      item-title="label"
      item-value="value"
      label="¿Qué servicio necesitas?"
      :error-messages="errors.servicio"
    >
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :prepend-icon="item.raw.icon">
          <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-select>

    <div class="d-flex justify-space-between mt-4">
      <v-btn variant="outlined" @click="store.prevStep()">Atrás</v-btn>
      <v-btn color="primary" type="submit">Siguiente</v-btn>
    </div>
  </Form>
</template>

<script setup>
import { useFormStore } from '@/stores/formStore';
import { useForm, Form } from 'vee-validate';
import { pasoDosSchema } from '@/composables/validationSchemas';
import { mdiLightbulb, mdiRocketLaunch, mdiChartLine, mdiBullseye } from '@mdi/js';

const store = useFormStore();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: pasoDosSchema,
  initialValues: { servicio: store.formData.servicio },
});

const [servicio, servicioAttrs] = defineField('servicio');

const items = [
  {
    value: 'web-app',
    label: 'Web/App a medida',
    icon: mdiRocketLaunch,
    tooltip: 'Soluciones completas y personalizadas desde cero.'
  },
  {
    value: 'automatizaciones',
    label: 'Automatizaciones',
    icon: mdiLightbulb,
    tooltip: 'Optimiza tareas y flujos de trabajo repetitivos.'
  },
  {
    value: 'ia-aplicada',
    label: 'IA aplicada',
    icon: mdiChartLine,
    tooltip: 'Integra inteligencia artificial para potenciar tu negocio.'
  },
  {
    value: 'diseno-express',
    label: 'Diseño express',
    icon: mdiBullseye,
    tooltip: 'Landing pages o MVPs funcionales en tiempo récord.'
  }
];

const triggerSubmit = handleSubmit(values => {
  store.updateFormData(values);
  store.nextStep();
});
</script>
