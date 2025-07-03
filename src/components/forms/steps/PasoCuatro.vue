<template>
  <Form @submit="handleSubmit(onSubmit)">
    <Field name="mensaje" v-slot="{ field, errorMessage }">
      <v-textarea v-bind="field" rows="5" label="Cuéntanos tu idea" :error-messages="errorMessage" />
    </Field>
    <v-file-input v-model="archivo" label="Adjuntar archivo (opcional)" />

    <div class="d-flex justify-space-between mt-4">
      <v-btn variant="outlined" @click="store.prevStep()">Atrás</v-btn>
      <v-btn color="primary" type="submit">Enviar</v-btn>
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { guardarFormulario } from '@/services/firestoreService'
import { useMainStore } from '@/stores/main'
import { useForm, Field, Form } from 'vee-validate'
import { pasoCuatroSchema } from '@/composables/validationSchemas'

const store = useFormStore()
const mainStore = useMainStore()
const archivo = ref(null)

const { handleSubmit } = useForm({
  validationSchema: pasoCuatroSchema,
  initialValues: { mensaje: store.formData.mensaje }
})

async function onSubmit (vals) {
  store.updateFormData({ ...vals, archivo: archivo.value })
  const { success, codigo, error } = await guardarFormulario(store.formData)
  if (success) {
    store.updateFormData({ enviado: true, codigo })
    mainStore.notify?.({ type: 'success', message: `Código de seguimiento: ${codigo}` })
  } else {
    mainStore.notify?.({ type: 'error', message: error })
  }
}
</script>
