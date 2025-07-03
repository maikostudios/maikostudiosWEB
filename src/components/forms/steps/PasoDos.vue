<template>
  <Form @submit="handleSubmit(onSubmit)">
    <Field name="servicio" v-slot="{ value, errorMessage, handleChange }">
      <v-select
        :model-value="value"
        @update:model-value="handleChange"
        :items="items"
        item-title="label"
        item-value="value"
        label="¿Qué servicio necesitas?"
        return-object
      >
        <template #item="{ props, item }">
          <v-list-item v-bind="props">
            <v-icon left>{{ item.raw.icon }}</v-icon>
            <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
            <FormStepTooltip>
              {{ item.raw.tooltip }}
              <template #activator="{ props: activatorProps }">
                <span v-bind="activatorProps" />
              </template>
            </FormStepTooltip>
          </v-list-item>
        </template>
      </v-select>
      <small class="text-error">{{ errorMessage }}</small>
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
import { pasoDosSchema } from '@/composables/validationSchemas'
import FormStepTooltip from '@/components/forms/FormStepTooltip.vue'
import { mdiLightbulb, mdiRocketLaunch, mdiChartLine, mdiBullseye } from '@mdi/js'

const store = useFormStore()

const { handleSubmit } = useForm({
  validationSchema: pasoDosSchema,
  initialValues: { servicio: store.formData.servicio }
})

const items = [
  {
    value: 'web_app',
    label: 'Web/App a medida',
    icon: mdiLightbulb,
    tooltip: 'Soluciones digitales personalizadas según tu idea 💡'
  },
  {
    value: 'automatizaciones',
    label: 'Automatizaciones',
    icon: mdiRocketLaunch,
    tooltip: 'Ahorra tiempo automatizando procesos ⏱️'
  },
  {
    value: 'ia',
    label: 'IA aplicada',
    icon: mdiChartLine,
    tooltip: 'Usa inteligencia artificial en tu negocio 🤖'
  },
  {
    value: 'diseno',
    label: 'Diseño express',
    icon: mdiBullseye,
    tooltip: 'Landing pages listas en 48 hrs 🚀'
  }
]

function onSubmit (vals) {
  store.updateFormData(vals)
  store.nextStep()
}
</script>
    
