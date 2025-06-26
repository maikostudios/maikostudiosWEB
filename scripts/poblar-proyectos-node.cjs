// Script para poblar proyectos en Firestore desde Node.js
const { initializeApp } = require("firebase/app");
const { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} = require("firebase/firestore");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de proyectos
const proyectos = [
  {
    titulo: "Delicias Tía Jovy",
    descripcion: "Página web operativa para restaurante familiar especializado en comida casera. Incluye menú digital, galería de platos, información de contacto y sistema de reservas. Proyecto real funcionando para PYME local.",
    imagen: "https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/delicias_tia_jovy.png",
    tecnologias: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL"],
    enlaceDemo: "https://deliciastiajovy.cl",
    enlaceGithub: "https://github.com/maikostudios/delicias-tia-jovy",
    esEstrella: true,
    mostrarEnHome: true,
    caracteristicas: [
      "Página web operativa en producción",
      "Menú digital interactivo",
      "Galería de platos y especialidades",
      "Sistema de contacto y reservas",
      "Diseño responsive para móviles",
      "Optimización SEO local",
      "Proyecto real para PYME chilena"
    ],
    activo: true
  },
  {
    titulo: "Sistema de Gestión Empresarial",
    descripcion: "Plataforma completa para gestión de inventarios, ventas, clientes y reportes. Incluye dashboard analítico, sistema de roles y notificaciones en tiempo real.",
    imagen: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    tecnologias: ["Vue.js", "Node.js", "Express", "MongoDB", "Socket.io", "Chart.js"],
    enlaceDemo: "https://gestion-demo.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/sistema-gestion",
    esEstrella: false,
    mostrarEnHome: true,
    caracteristicas: [
      "Dashboard analítico en tiempo real",
      "Gestión completa de inventarios",
      "Sistema de roles y permisos",
      "Reportes automáticos",
      "Notificaciones push",
      "API REST completa"
    ],
    activo: true
  },
  {
    titulo: "App Móvil de Delivery",
    descripcion: "Aplicación móvil para pedidos de comida con geolocalización, pagos integrados y seguimiento en tiempo real. Incluye panel administrativo para restaurantes.",
    imagen: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg",
    tecnologias: ["React Native", "Firebase", "Stripe", "Google Maps", "Redux"],
    enlaceDemo: "https://delivery-app.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/delivery-app",
    esEstrella: false,
    mostrarEnHome: false,
    caracteristicas: [
      "Geolocalización en tiempo real",
      "Pagos seguros con Stripe",
      "Notificaciones push",
      "Panel administrativo",
      "Seguimiento de pedidos",
      "Calificaciones y reseñas"
    ],
    activo: true
  },
  {
    titulo: "Plataforma E-learning",
    descripcion: "Sistema de aprendizaje online con cursos interactivos, evaluaciones automáticas y certificaciones. Incluye videoconferencias y foros de discusión.",
    imagen: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
    tecnologias: ["Next.js", "PostgreSQL", "WebRTC", "AWS S3", "Tailwind CSS"],
    enlaceDemo: "https://elearning.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/elearning-platform",
    esEstrella: false,
    mostrarEnHome: false,
    caracteristicas: [
      "Cursos interactivos multimedia",
      "Evaluaciones automáticas",
      "Certificaciones digitales",
      "Videoconferencias integradas",
      "Foros de discusión",
      "Progreso personalizado"
    ],
    activo: true
  },
  {
    titulo: "Dashboard Analytics",
    descripcion: "Panel de control avanzado para análisis de datos empresariales con gráficos interactivos, reportes personalizables y exportación de datos.",
    imagen: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
    tecnologias: ["Vue.js", "D3.js", "Python", "FastAPI", "Redis", "Docker"],
    enlaceDemo: "https://analytics.maikostudios.com",
    enlaceGithub: "https://github.com/maikostudios/analytics-dashboard",
    esEstrella: false,
    mostrarEnHome: false,
    caracteristicas: [
      "Gráficos interactivos avanzados",
      "Reportes personalizables",
      "Exportación múltiples formatos",
      "Análisis predictivo",
      "Alertas automáticas",
      "API de integración"
    ],
    activo: true
  }
];

async function poblarProyectos() {
  try {
    console.log("🚀 Iniciando población de proyectos en Firestore...");
    
    // Verificar si ya existen proyectos
    const proyectosRef = collection(db, "proyectos");
    const snapshot = await getDocs(proyectosRef);
    
    if (!snapshot.empty) {
      console.log(`⚠️ Ya existen ${snapshot.size} proyectos en Firestore`);
      console.log("¿Deseas continuar y agregar más proyectos? (Ctrl+C para cancelar)");
      // Esperar 3 segundos antes de continuar
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log(`📝 Agregando ${proyectos.length} proyectos a Firestore...`);
    
    for (const proyecto of proyectos) {
      const proyectoData = {
        ...proyecto,
        fechaCreacion: serverTimestamp(),
        fechaActualizacion: serverTimestamp()
      };
      
      const docRef = await addDoc(proyectosRef, proyectoData);
      console.log(`✅ Proyecto "${proyecto.titulo}" agregado con ID: ${docRef.id}`);
    }
    
    console.log("🎉 ¡Todos los proyectos han sido agregados exitosamente!");
    console.log("\n📊 Resumen:");
    console.log(`- Total proyectos: ${proyectos.length}`);
    console.log(`- Proyectos estrella: ${proyectos.filter(p => p.esEstrella).length}`);
    console.log(`- Proyectos en Home: ${proyectos.filter(p => p.mostrarEnHome).length}`);
    console.log(`- Proyectos activos: ${proyectos.filter(p => p.activo).length}`);
    
  } catch (error) {
    console.error("❌ Error al poblar proyectos:", error);
  }
}

// Ejecutar el script
poblarProyectos().then(() => {
  console.log("✅ Script completado");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error en el script:", error);
  process.exit(1);
});
