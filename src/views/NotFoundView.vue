<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h2>Página No Encontrada</h2>
    <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
    <router-link to="/">Volver al Inicio</router-link>
  </div>
</template>

<script setup>
// No se necesita lógica de script para esta vista simple.
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #ff5252;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
}

a {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #ff5252;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

a:hover {
  background-color: #e04848;
}
</style>
