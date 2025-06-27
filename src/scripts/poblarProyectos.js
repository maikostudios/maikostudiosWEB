/**
 * Script para poblar la base de datos con proyectos de ejemplo
 * Ejecutar desde la consola del navegador en /admin
 */

// Proyectos de ejemplo con imágenes reales del repositorio GitHub
const proyectosEjemplo = [
  {
    titulo: "De Una Transferencias",
    descripcion:
      "Sistema SaaS completo para gestión de transferencias financieras y administración de cuentas. Incluye dashboard administrativo, API REST, autenticación segura y reportes en tiempo real.",
    imagen:
      "https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/DeUna_home.png",
    tecnologias: [
      "Vue.js",
      "Node.js",
      "PostgreSQL",
      "Firebase",
      "Stripe",
      "JWT",
    ],
    enlaceDemo: "https://deuna-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/deuna-transferencias",
    esEstrella: true,
    caracteristicas: [
      "Dashboard administrativo completo",
      "API REST con documentación Swagger",
      "Autenticación JWT segura",
      "Reportes en tiempo real",
      "Integración con Stripe",
      "Notificaciones push",
      "Sistema de roles y permisos",
    ],
  },
  {
    titulo: "Panel de Login Corporativo",
    descripcion:
      "Sistema de autenticación empresarial con diseño moderno y funcionalidades avanzadas de seguridad. Incluye autenticación multifactor y gestión de sesiones.",
    imagen:
      "https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/DeUna_login.png",
    tecnologias: [
      "React",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Redis",
      "OAuth",
    ],
    enlaceDemo: "https://login-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/corporate-login",
    esEstrella: false,
    caracteristicas: [],
  },
  {
    titulo: "Delicias Tía Jovy",
    descripcion:
      "Página web operativa para restaurante familiar especializado en comida casera. Incluye menú digital, galería de platos, información de contacto y sistema de reservas. Proyecto real funcionando para PYME local.",
    imagen:
      "https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/delicias_tia_jovy.png",
    tecnologias: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL"],
    enlaceDemo: "https://deliciastiajovy.cl",
    enlaceGithub: "https://github.com/maikostudios/delicias-tia-jovy",
    esEstrella: true,
    caracteristicas: [
      "Página web operativa en producción",
      "Menú digital interactivo",
      "Galería de platos y especialidades",
      "Sistema de contacto y reservas",
      "Diseño responsive para móviles",
      "Optimización SEO local",
      "Proyecto real para PYME chilena",
    ],
  },
  {
    titulo: "Dashboard Analítico",
    descripcion:
      "Panel de control empresarial con métricas en tiempo real, gráficos interactivos, reportes automatizados y exportación de datos.",
    imagen:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    tecnologias: [
      "Vue.js",
      "Chart.js",
      "D3.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    enlaceDemo: "https://analytics-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/analytics-dashboard",
    esEstrella: false,
    caracteristicas: [],
  },
  {
    titulo: "App de Gestión Móvil",
    descripcion:
      "Aplicación móvil multiplataforma para gestión de tareas empresariales con sincronización en la nube y notificaciones push.",
    imagen:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    tecnologias: ["React Native", "Expo", "Firebase", "Redux", "AsyncStorage"],
    enlaceDemo: "https://app-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/task-manager-app",
    esEstrella: false,
    caracteristicas: [],
  },
  {
    titulo: "API Microservicios",
    descripcion:
      "Arquitectura de microservicios escalable con documentación automática, testing integrado, monitoreo y deployment automatizado.",
    imagen:
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    tecnologias: [
      "Node.js",
      "Express.js",
      "Docker",
      "Kubernetes",
      "PostgreSQL",
      "Redis",
    ],
    enlaceDemo: "https://api-docs.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/microservices-api",
    esEstrella: false,
    caracteristicas: [],
  },
];

/**
 * Función para crear proyectos de ejemplo
 * Usar desde la consola del navegador en /admin
 */
window.poblarProyectos = async function () {
  console.log("🚀 Iniciando población de proyectos...");

  // Verificar que el store esté disponible
  if (typeof window.store === "undefined") {
    console.error("❌ Store no disponible. Asegúrate de estar en /admin");
    return;
  }

  let creados = 0;
  let errores = 0;

  for (const proyecto of proyectosEjemplo) {
    try {
      console.log(`📝 Creando proyecto: ${proyecto.titulo}`);

      const resultado = await window.store.crearProyecto(proyecto);

      if (resultado.success) {
        creados++;
        console.log(`✅ Proyecto creado: ${proyecto.titulo}`);
      } else {
        errores++;
        console.error(`❌ Error al crear ${proyecto.titulo}:`, resultado.error);
      }

      // Pequeña pausa entre creaciones
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      errores++;
      console.error(`❌ Error inesperado con ${proyecto.titulo}:`, error);
    }
  }

  console.log(`\n🎉 Población completada:`);
  console.log(`✅ Proyectos creados: ${creados}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📊 Total intentos: ${proyectosEjemplo.length}`);

  if (creados > 0) {
    console.log("\n🔄 Recargando lista de proyectos...");
    await window.store.cargarProyectos();
    console.log("✅ Lista actualizada");
  }
};

/**
 * Función para limpiar todos los proyectos
 * USAR CON CUIDADO - Elimina todos los proyectos
 */
window.limpiarProyectos = async function () {
  if (
    !confirm("⚠️ ¿Estás seguro de que quieres eliminar TODOS los proyectos?")
  ) {
    return;
  }

  console.log("🗑️ Eliminando todos los proyectos...");

  const proyectos = window.store.proyectos;
  let eliminados = 0;

  for (const proyecto of proyectos) {
    try {
      const resultado = await window.store.eliminarProyecto(proyecto.id);
      if (resultado.success) {
        eliminados++;
        console.log(`🗑️ Eliminado: ${proyecto.titulo}`);
      }
    } catch (error) {
      console.error(`❌ Error al eliminar ${proyecto.titulo}:`, error);
    }
  }

  console.log(`\n🧹 Limpieza completada: ${eliminados} proyectos eliminados`);
};

// Instrucciones de uso
console.log(`
🎯 SCRIPTS DE POBLACIÓN DISPONIBLES:

📝 Crear proyectos de ejemplo:
   poblarProyectos()

🗑️ Eliminar todos los proyectos:
   limpiarProyectos()

💡 Asegúrate de estar en /admin para que funcionen correctamente.
`);

export { proyectosEjemplo };
