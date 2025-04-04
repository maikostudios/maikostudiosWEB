<template>
  <div class="background">
    <div class="spotlight" ref="spotlight"></div>
    <div class="container">
      <img src="../public/logo/logo_maikostudio.png" alt="Maiko Studios" class="logo" />
      <h1>🛠 Sitio en construcción</h1>
      <p>Pronto descubrirás lo que estamos creando para ti...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const spotlight = ref(null)
let mouseActive = false
let timeout

function handleMouseMove(e) {
  mouseActive = true
  clearTimeout(timeout)

  spotlight.value.style.opacity = '1'
  spotlight.value.style.top = `${e.clientY}px`
  spotlight.value.style.left = `${e.clientX}px`

  timeout = setTimeout(() => {
    mouseActive = false
    spotlight.value.style.opacity = '0'
  }, 3000)
}

function animateSpotlight() {
  if (!mouseActive) {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight

    spotlight.value.style.top = `${y}px`
    spotlight.value.style.left = `${x}px`
    spotlight.value.style.opacity = '1'

    setTimeout(() => {
      spotlight.value.style.opacity = '0'
    }, 2000)
  }

  setTimeout(animateSpotlight, 2000)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  animateSpotlight()
})
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.background {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #0a0a0a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spotlight {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.3), transparent 70%);
  filter: blur(50px);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.container {
  text-align: center;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  margin: 0 auto;
}

.logo {
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

p {
  font-size: 1.2rem;
  color: #dddddd;
}

/* Ajustes responsivos para móviles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  p {
    font-size: 1rem;
  }

  .logo {
    max-width: 15rem;
  }
}
</style>
