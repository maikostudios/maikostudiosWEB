<template>
  <div class="seguimiento-container py-12">
    <SpotlightEffect />
    <v-container>
      <h1 class="text-h4 text-center mb-6">🔍 Seguimiento de Solicitud</h1>

      <v-form @submit.prevent="buscar">
        <v-text-field
          v-model="codigo"
          label="Código MAIKO-XXXX"
          required
        />
        <v-btn color="primary" type="submit">Buscar</v-btn>
      </v-form>

      <template v-if="resultado">
        <v-card class="mt-6" v-if="resultado.success">
          <v-card-title>Estado: {{ resultado.data.estado }}</v-card-title>
          <v-card-text>
            <p><strong>Nombre:</strong> {{ resultado.data.nombre }}</p>
            <p><strong>Servicio:</strong> {{ resultado.data.servicio }}</p>
            <p><strong>Fecha:</strong> {{ resultado.data.fecha?.toDate?.().toLocaleString?.() }}</p>
            <v-btn
              v-if="puedeReenviar"
              color="secondary"
              class="mt-4"
              @click="reenviarContacto"
            >
              Reenviar contacto
            </v-btn>
          </v-card-text>
        </v-card>
        <v-alert type="error" class="mt-6" v-else>
          {{ resultado.error }}
        </v-alert>
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SpotlightEffect from '@/components/SpotlightEffect.vue'
import { buscarSolicitud } from '@/services/firestoreService'

const codigo = ref('')
const resultado = ref(null)
const diasLimite = 3

const puedeReenviar = computed(() => {
  if (!resultado.value?.success) return false
  const fecha = resultado.value.data.fecha?.toDate?.()
  if (!fecha) return false
  const diff = (Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24)
  return diff > diasLimite && resultado.value.data.estado !== 'respondido'
})

async function buscar () {
  resultado.value = await buscarSolicitud(codigo.value.trim().toUpperCase())
}

function reenviarContacto () {
  // Aquí se integraría una Cloud Function o EmailJS
  alert('Hemos reenviado tu solicitud. ¡Gracias por tu paciencia!')
}
</script>
