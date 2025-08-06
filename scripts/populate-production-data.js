/**
 * Script para poblar datos básicos en producción
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuración de Firebase (producción)
const firebaseConfig = {
  apiKey: "AIzaSyBqK3gpZUzjUYulGE6yu6GwGyRavUFOKAo",
  authDomain: "maikostudios-a9162.firebaseapp.com",
  projectId: "maikostudios-a9162",
  storageBucket: "maikostudios-a9162.firebasestorage.app",
  messagingSenderId: "798896348759",
  appId: "1:798896348759:web:a4c6bf6911bc107aa38d12",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Datos de ejemplo para packs
const samplePacks = [
  {
    name: "Pack Básico",
    subtitle: "Perfecto para empezar",
    price: {
      monthly: 299000,
      annual: 2990000,
      currency: "CLP",
    },
    badge: {
      text: "Más Popular",
      color: "success",
      show: true,
    },
    features: [
      "Sitio web responsive",
      "Hasta 5 páginas",
      "Diseño personalizado",
      "Optimización SEO básica",
      "Formulario de contacto",
      "Hosting incluido (1 año)",
      "SSL certificado",
      "Soporte técnico 24/7",
    ],
    cta: {
      text: "Comenzar Ahora",
      action: "contact",
      whatsapp: true,
    },
    styling: {
      borderColor: "success",
      highlighted: true,
      gradient: true,
    },
    active: true,
    order: 1,
    category: "web",
    type: "pack",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  },
  {
    name: "Pack Profesional",
    subtitle: "Para empresas en crecimiento",
    price: {
      monthly: 599000,
      annual: 5990000,
      currency: "CLP",
    },
    badge: {
      text: "Recomendado",
      color: "primary",
      show: true,
    },
    features: [
      "Todo del Pack Básico",
      "Hasta 15 páginas",
      "E-commerce básico",
      "Integración con redes sociales",
      "Analytics avanzado",
      "Chat en vivo",
      "Backup automático",
      "Soporte prioritario",
    ],
    cta: {
      text: "Contactar",
      action: "contact",
      whatsapp: true,
    },
    styling: {
      borderColor: "primary",
      highlighted: false,
      gradient: false,
    },
    active: true,
    order: 2,
    category: "web",
    type: "pack",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  },
];

// Datos de ejemplo para planes
const samplePlans = [
  {
    name: "Plan Mantenimiento",
    description: "Mantenimiento mensual de tu sitio web",
    monthlyPrice: 49000,
    annualPrice: 490000,
    currency: "CLP",
    highlighted: false,
    features: [
      "Actualizaciones de seguridad",
      "Backup semanal",
      "Soporte técnico",
      "Monitoreo 24/7",
      "Reportes mensuales",
    ],
    active: true,
    order: 1,
    type: "plan",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  },
  {
    name: "Plan Premium",
    description: "Soporte completo y desarrollo continuo",
    monthlyPrice: 149000,
    annualPrice: 1490000,
    currency: "CLP",
    highlighted: true,
    features: [
      "Todo del Plan Mantenimiento",
      "Desarrollo de nuevas funcionalidades",
      "Optimización de rendimiento",
      "Consultoría estratégica",
      "Soporte prioritario 24/7",
    ],
    active: true,
    order: 2,
    type: "plan",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  },
];

async function poblarPacks() {
  try {
    console.log("Poblando packs de precios...");

    // Verificar si ya existen packs
    const existingPacks = await getDocs(query(collection(db, "pricing_packs")));

    if (existingPacks.size > 0) {
      console.log("Ya existen packs en la base de datos");
      return;
    }

    for (const pack of samplePacks) {
      const docRef = await addDoc(collection(db, "pricing_packs"), pack);
      console.log("Pack creado:", pack.name, "ID:", docRef.id);
    }

    console.log("Packs poblados exitosamente");
  } catch (error) {
    console.error("Error poblando packs:", error);
  }
}

async function poblarPlanes() {
  try {
    console.log("Poblando planes de precios...");

    // Verificar si ya existen planes
    const existingPlans = await getDocs(query(collection(db, "pricing_plans")));

    if (existingPlans.size > 0) {
      console.log("Ya existen planes en la base de datos");
      return;
    }

    for (const plan of samplePlans) {
      const docRef = await addDoc(collection(db, "pricing_plans"), plan);
      console.log("Plan creado:", plan.name, "ID:", docRef.id);
    }

    console.log("Planes poblados exitosamente");
  } catch (error) {
    console.error("Error poblando planes:", error);
  }
}

async function autenticar() {
  try {
    console.log("Autenticando como administrador...");
    await signInWithEmailAndPassword(auth, "maikostudios@gmail.com", "123456");
    console.log("Autenticación exitosa");
    return true;
  } catch (error) {
    console.error("Error de autenticación:", error.message);
    return false;
  }
}

async function poblarDatos() {
  console.log("Iniciando poblado de datos de producción...");

  const autenticado = await autenticar();
  if (!autenticado) {
    console.log("No se pudo autenticar. Abortando...");
    return;
  }

  await poblarPacks();
  await poblarPlanes();

  console.log("Poblado de datos completado");
}

poblarDatos();
