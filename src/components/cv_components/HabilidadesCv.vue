<template>
    <section>
        <h2>Habilidades Técnicas</h2>
        <ul class="skills">
            <li>Desarrollo Web Full Stack</li>
            <li>Mentorías Técnicas</li>
            <li>Scrum / Kanban</li>
            <li>Node.js, Vue, React, Express</li>
            <li>SQL, PostgreSQL, MongoDB</li>
            <li>Spring Boot, Java 8+, Python</li>
            <li>GIT, Jira, MVC</li>
            <li>Automatización con herramientas IA</li>
        </ul>
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

ul.skills {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.skills li {
    width: 45%;
    color: var(--gris-texto);
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

.languages {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

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