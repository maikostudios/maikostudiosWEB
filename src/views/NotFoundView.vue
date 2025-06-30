<script setup>
import { useRouter } from 'vue-router'
import { useSEO } from '@/composables/useSEO'

const router = useRouter()
const { setSEO } = useSEO()

setSEO({
  title: 'Página no encontrada | Maikostudios',
  description: 'La página que buscas no existe. Vuelve al inicio o contacta al equipo de Maikostudios.'
})

function goHome() {
  router.push('/')
}
function goContact() {
  router.push('/contacto')
}
</script>

<template>
  <div class="notfound-container">
    <div class="notfound-content">
      <h1 class="notfound-title">404</h1>
      <h2 class="notfound-subtitle">¡Oops! Página no encontrada</h2>
      <p class="notfound-message">
        Lo sentimos, la ruta que intentaste visitar no existe o fue movida.<br>
        Si crees que esto es un error, por favor contáctanos.
      </p>
      <div class="notfound-actions">
        <button class="notfound-btn" @click="goHome">Volver al inicio</button>
        <button class="notfound-btn secondary" @click="goContact">Contactar equipo</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #181c2f 0%, #232946 100%);
  padding: clamp(2rem, 8vw, 6rem) 1em 1em 1em;
  text-align: center;
}
.notfound-content {
  background: rgba(255,255,255,0.04);
  border-radius: 1.5em;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: clamp(2em, 8vw, 4em);
  max-width: 420px;
  width: 100%;
}
.notfound-title {
  font-size: clamp(4rem, 12vw, 7rem);
  color: var(--color-primary);
  margin-bottom: 0.2em;
  font-weight: 900;
  letter-spacing: -0.04em;
}
.notfound-subtitle {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  color: var(--color-text);
  margin-bottom: 0.6em;
  font-weight: 700;
}
.notfound-btn {
  font-size: 1.1em;
  padding: 0.8em 2.2em;
  border: none;
  border-radius: 2em;
  background: var(--color-primary);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.notfound-btn.secondary {
  background: var(--color-background);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.notfound-btn:hover {
  background: var(--color-secondary);
}
.notfound-btn.secondary:hover {
  background: var(--color-background);
  color: var(--color-secondary);
  border-color: var(--color-secondary);
}
.notfound-message {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: #e0e0e0;
  margin-bottom: 1.5em;
}
.notfound-actions {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.notfound-btn {
  font-size: 1.1em;
  padding: 0.8em 2.2em;
  border: none;
  border-radius: 2em;
  background: #ff4e4e;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.notfound-btn.secondary {
  background: #232946;
  color: #ff4e4e;
  border: 2px solid #ff4e4e;
}
.notfound-btn:hover {
  background: #e03c3c;
}
.notfound-btn.secondary:hover {
  background: #181c2f;
}
@media (max-width: 600px) {
  .notfound-content {
    padding: 2em 1em;
    max-width: 98vw;
  }
  .notfound-title {
    font-size: 3.5rem;
  }
}
</style>