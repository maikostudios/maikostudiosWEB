import { proyectosService } from "../services/proyectosService.js";

/**
 * Script para poblar Firebase con proyectos de ejemplo
 * Ejecutar desde la consola del navegador o como módulo
 */

const proyectosEjemplo = [
  {
    titulo: "MaikoStudios Web Platform",
    descripcion:
      "Plataforma web profesional con generador de CV inteligente, chatbot con IA, panel de administración y gestión de portafolio dinámico.",
    imagen:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    tecnologias: ["Vue.js", "Firebase", "Gemini AI", "Vuetify", "Pinia"],
    enlaceDemo: "https://maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/maikostudiosWEB",
    esEstrella: true,
    caracteristicas: [
      "Generador de CV con IA",
      "Chatbot inteligente",
      "Panel de administración",
      "Gestión de portafolio",
      "Diseño responsive",
    ],
  },
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
    titulo: "E-commerce Moderno",
    descripcion:
      "Tienda online completa con carrito de compras, integración de pagos múltiples, gestión de inventario y panel administrativo avanzado.",
    imagen:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    tecnologias: ["Vue.js", "Nuxt.js", "Stripe", "PayPal", "MongoDB", "Docker"],
    enlaceDemo: "https://shop-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/ecommerce-vue",
    esEstrella: false,
    caracteristicas: [],
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
];

/**
 * Función principal para poblar Firebase
 */
export async function poblarFirebaseConProyectos() {
  console.log("🚀 Iniciando población de Firebase con proyectos...");

  let creados = 0;
  let errores = 0;

  for (const proyecto of proyectosEjemplo) {
    try {
      console.log(`📝 Creando proyecto: ${proyecto.titulo}`);

      const resultado = await proyectosService.crearProyecto(proyecto);

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

  return { creados, errores, total: proyectosEjemplo.length };
}

/**
 * Función para limpiar todos los proyectos
 */
export async function limpiarProyectosFirebase() {
  console.log("🗑️ Obteniendo proyectos para eliminar...");

  const resultado = await proyectosService.obtenerProyectos();

  if (!resultado.success) {
    console.error("❌ Error al obtener proyectos:", resultado.error);
    return;
  }

  const proyectos = resultado.data;
  console.log(`📋 Encontrados ${proyectos.length} proyectos para eliminar`);

  if (proyectos.length === 0) {
    console.log("✅ No hay proyectos para eliminar");
    return;
  }

  let eliminados = 0;

  for (const proyecto of proyectos) {
    try {
      const resultado = await proyectosService.eliminarProyecto(proyecto.id);
      if (resultado.success) {
        eliminados++;
        console.log(`🗑️ Eliminado: ${proyecto.titulo}`);
      } else {
        console.error(
          `❌ Error al eliminar ${proyecto.titulo}:`,
          resultado.error
        );
      }
    } catch (error) {
      console.error(
        `❌ Error inesperado al eliminar ${proyecto.titulo}:`,
        error
      );
    }
  }

  console.log(`\n🧹 Limpieza completada: ${eliminados} proyectos eliminados`);
  return { eliminados, total: proyectos.length };
}

// Si se ejecuta directamente en el navegador
if (typeof window !== "undefined") {
  window.poblarFirebaseConProyectos = poblarFirebaseConProyectos;
  window.limpiarProyectosFirebase = limpiarProyectosFirebase;

  console.log(`
🎯 SCRIPTS DE FIREBASE DISPONIBLES:

📝 Crear proyectos de ejemplo:
   poblarFirebaseConProyectos()

🗑️ Eliminar todos los proyectos:
   limpiarProyectosFirebase()

💡 Ejecutar desde la consola del navegador en /admin
  `);
}
