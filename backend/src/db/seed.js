/**
 * Script de seed para poblar datos iniciales
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // ---- Usuario Admin ----
  const existingUser = await prisma.user.findUnique({ where: { email: 'maikostudios@gmail.com' } });
  if (!existingUser) {
    const hash = await bcrypt.hash('Maiko2026!', 12);
    await prisma.user.create({
      data: {
        email: 'maikostudios@gmail.com',
        passwordHash: hash,
        displayName: 'Michael Sáez',
        role: 'admin',
      },
    });
    console.log('✅ Usuario admin creado: maikostudios@gmail.com');
  } else {
    console.log('ℹ️  Usuario admin ya existe');
  }

  // ---- Proyecto estrella de ejemplo ----
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: 'De Una Transferencias',
        description: 'Plataforma SaaS para gestión de transferencias financieras y pagos. Sistema completo con panel de control, reportes en tiempo real e integración con múltiples métodos de pago.',
        shortDescription: 'Sistema SaaS para transferencias y gestión financiera',
        imageUrl: '/assets/projects/deuna.png',
        demoUrl: 'https://deuna.cl',
        technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Firebase', 'Stripe'],
        category: 'SaaS',
        featured: true,
        homeDisplay: true,
        displayOrder: 1,
      },
    });
    console.log('✅ Proyecto estrella creado');
  }

  // ---- Packs de precios de ejemplo ----
  const packCount = await prisma.pricingPack.count();
  if (packCount === 0) {
    await prisma.pricingPack.createMany({
      data: [
        {
          name: 'Starter',
          subtitle: 'Ideal para comenzar tu presencia digital',
          priceMonthly: 290000,
          currency: 'CLP',
          features: ['Landing Page profesional', 'Formulario de contacto', 'Diseño responsivo', 'SEO básico', '1 revisión'],
          displayOrder: 1,
          color: 'cyan',
        },
        {
          name: 'Business',
          subtitle: 'Para empresas que quieren crecer',
          priceMonthly: 590000,
          currency: 'CLP',
          features: ['Sitio web completo (hasta 5 páginas)', 'Panel de administración', 'Integración WhatsApp', 'SEO avanzado', 'Chatbot básico', '3 revisiones'],
          displayOrder: 2,
          popular: true,
          color: 'purple',
        },
        {
          name: 'Enterprise',
          subtitle: 'Solución personalizada para tu empresa',
          priceMonthly: 990000,
          currency: 'CLP',
          features: ['Aplicación web a medida', 'Base de datos propia', 'Integraciones API', 'Panel admin completo', 'Chatbot con IA', 'Soporte prioritario', 'Revisiones ilimitadas'],
          displayOrder: 3,
          color: 'orange',
        },
      ],
    });
    console.log('✅ Packs de precios creados (3)');
  }

  // ---- Planes de suscripción de ejemplo ----
  const planCount = await prisma.pricingPlan.count();
  if (planCount === 0) {
    await prisma.pricingPlan.createMany({
      data: [
        {
          name: 'Mantenimiento Básico',
          subtitle: 'Mantén tu sitio actualizado',
          priceMonthly: 49000,
          currency: 'CLP',
          features: ['Actualizaciones de contenido', 'Backup mensual', 'Soporte por email', '2 horas de cambios/mes'],
          displayOrder: 1,
          color: 'cyan',
        },
        {
          name: 'Soporte Premium',
          subtitle: 'Soporte completo y mejoras continuas',
          priceMonthly: 99000,
          currency: 'CLP',
          features: ['Actualizaciones ilimitadas', 'Backup semanal', 'Soporte WhatsApp', '8 horas de desarrollo/mes', 'Monitoreo 24/7', 'Reportes mensuales'],
          displayOrder: 2,
          popular: true,
          color: 'purple',
        },
      ],
    });
    console.log('✅ Planes de suscripción creados (2)');
  }

  // ---- Configuración inicial del sitio ----
  await prisma.siteConfig.upsert({
    where: { key: 'site_info' },
    update: {},
    create: {
      key: 'site_info',
      value: {
        name: 'MaikoStudios',
        phone: '+56920648446',
        email: 'contacto@maikostudios.com',
        address: 'Temuco, IX Región, Chile',
        linkedin: 'https://www.linkedin.com/in/me-saezc/',
        github: 'https://github.com/maikostudios',
        whatsapp_number: '56920648446',
      },
    },
  });
  console.log('✅ Configuración del sitio creada');

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
