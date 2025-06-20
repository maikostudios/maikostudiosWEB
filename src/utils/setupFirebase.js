import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Función para ejecutar manualmente desde la consola del navegador
 * Ejecuta: window.setupFirebaseCollections()
 */
window.setupFirebaseCollections = async () => {
  console.log("🚀 Iniciando configuración manual de Firebase...");

  try {
    // 1. Crear colección reclutadores_interesados
    await setDoc(doc(db, "reclutadores_interesados", "ejemplo-001"), {
      nombre: "María González",
      empresa: "TechCorp",
      email: "maria.gonzalez@techcorp.com",
      posicion: "Desarrollador Full Stack",
      fechaRegistro: new Date().toISOString(),
      cvGenerado: true,
      habilidadesSeleccionadas: ["Vue.js", "Node.js", "PostgreSQL"],
      seguimientoRealizado: false,
    });
    console.log("✅ Colección reclutadores_interesados creada");

    // 2. Crear colección solicitudes_cv
    await setDoc(doc(db, "solicitudes_cv", "ejemplo-001"), {
      nombreReclutador: "Juan Pérez",
      empresa: "StartupXYZ",
      email: "juan.perez@startupxyz.com",
      posicion: "Desarrollador Frontend",
      tipoSolicitud: "cv_personalizado",
      fechaSolicitud: new Date().toISOString(),
      estado: "pendiente",
    });
    console.log("✅ Colección solicitudes_cv creada");

    // 3. Crear colección mensajes_contacto
    await setDoc(doc(db, "mensajes_contacto", "ejemplo-001"), {
      nombre: "Ana Rodríguez",
      email: "ana.rodriguez@empresa.com",
      empresa: "Empresa Demo",
      mensaje: "Consulta de ejemplo",
      fechaEnvio: new Date().toISOString(),
      leido: false,
    });
    console.log("✅ Colección mensajes_contacto creada");

    // 4. Crear colección visitas
    await setDoc(doc(db, "visitas", "ejemplo-001"), {
      pagina: "/cv-generator",
      timestamp: new Date().toISOString(),
      userAgent: "Mozilla/5.0 (ejemplo)",
      duracion: 120,
    });
    console.log("✅ Colección visitas creada");

    // 5. Crear colección configuracion
    await setDoc(doc(db, "configuracion", "sistema"), {
      version: "1.0.0",
      ultimaActualizacion: new Date().toISOString(),
      estadisticas: {
        totalCVsGenerados: 0,
        totalReclutadores: 0,
      },
    });
    console.log("✅ Colección configuracion creada");

    console.log("");
    console.log("🎉 ¡Todas las colecciones creadas exitosamente!");
    console.log("🎯 Ahora puedes probar el generador de CV");

    return { success: true };
  } catch (error) {
    console.error("❌ Error al configurar Firebase:", error);
    return { success: false, error: error.message };
  }
};

// Hacer la función disponible inmediatamente
setTimeout(() => {
  console.log(
    "🔧 Para configurar Firebase manualmente, ejecuta: window.setupFirebaseCollections()"
  );
}, 1000);
