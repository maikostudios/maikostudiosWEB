<template>
    <section>
        <h2>Contacto</h2>
        <p><strong>Email:</strong> m.saezc@maikostudios.com</p>
        <p><strong>Dirección:</strong> Temuco, IX Región, Chile</p>
        <p><strong>Teléfono:</strong> +56983833148</p>
        <p><strong>Fecha de nacimiento:</strong> 19 Oct, 1994</p>
        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/me-saezc/">linkedin.com/in/me-saezc</a></p>
        <p><strong>GitHub:</strong> <a href="https://github.com/maikostudios">github.com/maikostudios</a></p>
        <p><strong>Portafolio:</strong> <a href="https://www.maikostudios.com">www.maikostudios.com</a></p>
    </section>
</template>


<style scoped>
:root {
    --azul: #2a60c4;
    --gris-fondo: #f4f4f4;
    --blanco: #ffffff;
    --gris-texto: #444;
}

* {
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--gris-fondo);
    margin: 0;
    color: var(--gris-texto);
}

.container {
    display: grid;
    grid-template-columns: 30% 70%;
    max-width: 1100px;
    margin: auto;
    background: var(--blanco);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

aside {
    background-color: var(--azul);
    color: white;
    padding: 2rem 1rem;
}

aside h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

aside img {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

aside .tagline {
    font-weight: bold;
    font-size: 0.9rem;
    margin-top: 1rem;
    line-height: 1.4;
}

main {
    padding: 2rem;
}

section {
    margin-bottom: 2rem;
}

h2 {
    border-bottom: 2px solid var(--azul);
    padding-bottom: 0.25rem;
    color: var(--azul);
    margin-bottom: 1rem;
}

p {
    margin: 0.5rem 0;
    color: var(--gris-texto);
}

a {
    color: var(--azul);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.section-block {
    margin-bottom: 1rem;
}

.section-block h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
}

.section-block p {
    margin: 0.2rem 0;
    font-size: 0.9rem;
}

ul {
    padding-left: 1rem;
}

.skills,
.languages {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.skills li,
.languages li {
    width: 45%;
}

.btn-download {
    margin-top: 2rem;
    padding: 1rem 2rem;
    background-color: var(--azul);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-download:hover {
    background-color: #1f4ea2;
}
</style>