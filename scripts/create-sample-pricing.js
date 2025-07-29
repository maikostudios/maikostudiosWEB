/**
 * Script para crear datos de muestra de precios
 * Ejecutar con: node scripts/create-sample-pricing.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Configuración del proyecto de desarrollo
const firebaseConfig = {
  apiKey: "AIzaSyCDjbp0MSQ_5_GcBBZiDo6LV4qtjwHRNok",
  authDomain: "maikostudios-dev.firebaseapp.com",
  projectId: "maikostudios-dev",
  storageBucket: "maikostudios-dev.firebasestorage.app",
  messagingSenderId: "1084750960472",
  appId: "1:1084750960472:web:ec847ab51570bb7ec6372d"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Datos de muestra para packs
const samplePacks = [
  {
    name: 'Pack Básico',
    subtitle: 'Ideal para emprendedores',
    price: {
      monthly: 299000,
      annual: 2990000,
      currency: 'CLP'
    },
    features: [
      'Sitio web responsive',
      'Hasta 5 páginas',
      'Formulario de contacto',
      'Optimización SEO básica',
      'Hosting por 1 año'
    ],
    active: true,
    order: 1,
    type: 'pack',
    category: 'web',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Pack Profesional',
    subtitle: 'Para empresas en crecimiento',
    price: {
      monthly: 599000,
      annual: 5990000,
      currency: 'CLP'
    },
    features: [
      'Sitio web responsive avanzado',
      'Hasta 10 páginas',
      'Sistema de gestión de contenido',
      'Integración con redes sociales',
      'Optimización SEO avanzada',
      'Hosting por 2 años',
      'Soporte técnico 6 meses'
    ],
    active: true,
    order: 2,
    type: 'pack',
    category: 'web',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Pack Premium',
    subtitle: 'Solución completa empresarial',
    price: {
      monthly: 999000,
      annual: 9990000,
      currency: 'CLP'
    },
    features: [
      'Sitio web corporativo completo',
      'Páginas ilimitadas',
      'E-commerce integrado',
      'Panel de administración',
      'Integración con APIs',
      'Optimización SEO premium',
      'Hosting por 3 años',
      'Soporte técnico 12 meses',
      'Mantenimiento incluido'
    ],
    active: true,
    order: 3,
    type: 'pack',
    category: 'web',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Datos de muestra para planes
const samplePlans = [
  {
    name: 'Plan Starter',
    subtitle: 'Para proyectos pequeños',
    price: {
      monthly: 49000,
      annual: 490000,
      currency: 'CLP'
    },
    features: [
      'Mantenimiento básico',
      'Actualizaciones de seguridad',
      'Backup semanal',
      'Soporte por email'
    ],
    active: true,
    order: 1,
    type: 'plan',
    category: 'maintenance',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Plan Business',
    subtitle: 'Para empresas activas',
    price: {
      monthly: 99000,
      annual: 990000,
      currency: 'CLP'
    },
    features: [
      'Mantenimiento completo',
      'Actualizaciones de contenido',
      'Backup diario',
      'Soporte prioritario',
      'Análisis de rendimiento',
      'Optimización continua'
    ],
    active: true,
    order: 2,
    type: 'plan',
    category: 'maintenance',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Plan Enterprise',
    subtitle: 'Para grandes empresas',
    price: {
      monthly: 199000,
      annual: 1990000,
      currency: 'CLP'
    },
    features: [
      'Mantenimiento premium',
      'Desarrollo de nuevas funcionalidades',
      'Backup en tiempo real',
      'Soporte 24/7',
      'Análisis avanzado',
      'Consultoría estratégica',
      'SLA garantizado'
    ],
    active: true,
    order: 3,
    type: 'plan',
    category: 'maintenance',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function createSampleData() {
  console.log('🚀 Creando datos de muestra para precios...')
  
  try {
    // Crear packs
    console.log('📦 Creando packs de muestra...')
    for (const pack of samplePacks) {
      const docRef = await addDoc(collection(db, 'pricing_packs'), pack)
      console.log(`✅ Pack "${pack.name}" creado con ID: ${docRef.id}`)
    }
    
    // Crear planes
    console.log('📋 Creando planes de muestra...')
    for (const plan of samplePlans) {
      const docRef = await addDoc(collection(db, 'pricing_plans'), plan)
      console.log(`✅ Plan "${plan.name}" creado con ID: ${docRef.id}`)
    }
    
    console.log('🎉 Datos de muestra creados exitosamente!')
    console.log(`📊 Total: ${samplePacks.length} packs y ${samplePlans.length} planes`)
    
  } catch (error) {
    console.error('❌ Error creando datos de muestra:', error)
  }
  
  process.exit(0)
}

createSampleData().catch(console.error)
