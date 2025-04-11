<template>
    <div ref="spotlight" class="spotlight"></div>
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
    z-index: 0;
}
</style>