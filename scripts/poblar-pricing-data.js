// Script para poblar datos de prueba en Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Configuración de Firebase (desarrollo)
const firebaseConfig = {
  apiKey: "AIzaSyALnEe3chHJOMiXS0dOUQ6GZ61oXfBaqxU",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de prueba para packs (pago único)
const packsData = [
  {
    name: "Pack Básico Web",
    subtitle: "Perfecto para emprendedores",
    price: {
      monthly: 150000,
      annual: 1500000,
      currency: "CLP"
    },
    badge: {
      text: "Más Popular",
      color: "success",
      show: true
    },
    features: [
      "Sitio web responsive",
      "Hasta 5 páginas",
      "Formulario de contacto",
      "Optimización SEO básica",
      "Hosting por 1 año",
      "Certificado SSL",
      "Soporte por 3 meses"
    ],
    cta: {
      text: "Contactar",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "success",
      highlighted: true,
      gradient: false
    },
    active: true,
    order: 1,
    category: "web",
    type: "pack",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  },
  {
    name: "Pack E-commerce",
    subtitle: "Tienda online completa",
    price: {
      monthly: 350000,
      annual: 3500000,
      currency: "CLP"
    },
    badge: {
      text: "",
      color: "primary",
      show: false
    },
    features: [
      "Tienda online completa",
      "Hasta 100 productos",
      "Pasarela de pagos",
      "Panel de administración",
      "Gestión de inventario",
      "Reportes de ventas",
      "Hosting por 1 año",
      "Soporte por 6 meses"
    ],
    cta: {
      text: "Contactar",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "primary",
      highlighted: false,
      gradient: false
    },
    active: true,
    order: 2,
    category: "ecommerce",
    type: "pack",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  },
  {
    name: "Pack Empresarial",
    subtitle: "Solución completa para empresas",
    price: {
      monthly: 750000,
      annual: 7500000,
      currency: "CLP"
    },
    badge: {
      text: "Premium",
      color: "warning",
      show: true
    },
    features: [
      "Aplicación web personalizada",
      "Base de datos avanzada",
      "Integración con APIs",
      "Panel de administración",
      "Reportes avanzados",
      "Backup automático",
      "Hosting empresarial",
      "Soporte por 12 meses",
      "Capacitación del equipo"
    ],
    cta: {
      text: "Contactar",
      action: "contact",
      whatsapp: true
    },
    styling: {
      borderColor: "warning",
      highlighted: false,
      gradient: true
    },
    active: true,
    order: 3,
    category: "enterprise",
    type: "pack",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  }
]

// Datos de prueba para planes (suscripción)
const planesData = [
  {
    name: "Plan Básico",
    description: "Ideal para emprendedores que inician",
    monthlyPrice: 50000,
    annualPrice: 500000,
    currency: "CLP",
    highlighted: false,
    features: [
      "Consultoría mensual (2 horas)",
      "Soporte por WhatsApp",
      "Actualizaciones básicas",
      "Reportes mensuales",
      "Backup automático"
    ],
    active: true,
    order: 1,
    type: "plan",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  },
  {
    name: "Plan Profesional",
    description: "Para negocios en crecimiento",
    monthlyPrice: 120000,
    annualPrice: 1200000,
    currency: "CLP",
    highlighted: true,
    features: [
      "Consultoría mensual (4 horas)",
      "Soporte prioritario 24/7",
      "Actualizaciones avanzadas",
      "Reportes semanales",
      "Backup automático",
      "Optimización SEO",
      "Análisis de competencia"
    ],
    active: true,
    order: 2,
    type: "plan",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  },
  {
    name: "Plan Empresarial",
    description: "Solución completa para empresas",
    monthlyPrice: 250000,
    annualPrice: 2500000,
    currency: "CLP",
    highlighted: false,
    features: [
      "Consultoría ilimitada",
      "Soporte dedicado 24/7",
      "Desarrollo personalizado",
      "Reportes en tiempo real",
      "Backup automático",
      "Optimización SEO avanzada",
      "Análisis de competencia",
      "Integración con CRM",
      "Capacitación del equipo"
    ],
    active: true,
    order: 3,
    type: "plan",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  }
]

// Función para poblar packs
async function poblarPacks() {
  console.log('🔄 Poblando packs...')
  
  for (const pack of packsData) {
    try {
      const docRef = await addDoc(collection(db, 'pricing_packs'), pack)
      console.log(`✅ Pack "${pack.name}" creado con ID: ${docRef.id}`)
    } catch (error) {
      console.error(`❌ Error creando pack "${pack.name}":`, error)
    }
  }
}

// Función para poblar planes
async function poblarPlanes() {
  console.log('🔄 Poblando planes...')
  
  for (const plan of planesData) {
    try {
      const docRef = await addDoc(collection(db, 'pricing_plans'), plan)
      console.log(`✅ Plan "${plan.name}" creado con ID: ${docRef.id}`)
    } catch (error) {
      console.error(`❌ Error creando plan "${plan.name}":`, error)
    }
  }
}

// Ejecutar poblado
async function main() {
  console.log('🚀 Iniciando poblado de datos de pricing...')
  
  await poblarPacks()
  await poblarPlanes()
  
  console.log('✅ Poblado completado!')
  process.exit(0)
}

main().catch(console.error)
