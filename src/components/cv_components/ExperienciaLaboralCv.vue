<template>
    <section>
        <h2>Experiencia Profesional</h2>
        <div class="section-block">
            <h3>Facilitador Front End - Desafío Latam</h3>
            <p>Ago 2024 - Dic 2024</p>
            <p>Impartí cursos en tecnologías Front End como HTML, CSS, JavaScript, y Vue en el marco del
                programa Talento Digital para Chile. Certificado como facilitador por la institución.</p>
        </div>
        <div class="section-block">
            <h3>Facilitador Bootcamp - INFOCAL</h3>
            <p>Ene 2024 - Sep 2024</p>
            <p>Docente en cursos de desarrollo Front End usando HTML, CSS, JavaScript, Bootstrap y Vue.js,
                adaptando contenidos a estudiantes en formación técnica.</p>
        </div>
        <div class="section-block">
            <h3>Full Stack Developer - Tata Consultancy Services</h3>
            <p>Jul 2021 - Dic 2023</p>
            <p>Desarrollador líder en proyectos para Metlife Chile, resolviendo el 100% de tickets reportados.
                Trabajo Full Stack con tecnologías JavaScript, Node, y SQL.</p>
        </div>
        <div class="section-block">
            <h3>Soporte TI - NTTDATA Centers</h3>
            <p>Nov 2020 - Dic 2021</p>
            <p>Gestión de incidencias, soporte técnico, geolocalización de datos y configuración de
                infraestructura tecnológica.</p>
        </div>
        <div class="section-block">
            <h3>Jefe Sucursal Subrogante - Clínica Dental Pacífico</h3>
            <p>2020 - 2021</p>
            <p>Gestión operativa de clínica, control de inventario, coordinación de agenda médica y
                administración de base de datos SQL.</p>
        </div>
        <div class="section-block">
            <h3>Ejecutivo Comercial - Inmobiliaria Conquistadores de Labranza</h3>
            <p>Mar 2019 - Ago 2020</p>
            <p>Asesoría personalizada en subsidios habitacionales, gestión de créditos y coordinación con
                instituciones financieras.</p>
        </div>
        <div class="section-block">
            <h3>Administrativo URGENCIAS - Hospital Hernán Henríquez Aravena</h3>
            <p>Ene 2015 - Dic 2016</p>
            <p>Atención de pacientes y administración de registros clínicos en unidad de urgencias adulto,
                pediátrico y obstetricia.</p>
        </div>
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

.section-block {
    margin-bottom: 1rem;
}

.section-block h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    color: var(--gris-texto);
}

.section-block p {
    margin: 0.2rem 0;
    font-size: 0.9rem;
    color: var(--gris-texto);
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