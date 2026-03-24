/**
 * Script auxiliar: carga el .env y ejecuta prisma db push + seed
 * Ejecutar con: node src/db/setup.js
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Cargar .env manualmente
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key && value) process.env[key] = value;
  });
  console.log('✅ Variables de entorno cargadas');
} else {
  console.error('❌ .env no encontrado');
  process.exit(1);
}

const opts = {
  cwd: path.join(__dirname, '..', '..'),
  stdio: 'inherit',
  env: { ...process.env }
};

try {
  console.log('\n1️⃣  Generando Prisma Client...');
  execSync('npx prisma generate', opts);
  console.log('✅ Prisma Client generado');

  console.log('\n2️⃣  Sincronizando esquema con PostgreSQL (db push)...');
  execSync('npx prisma db push --accept-data-loss', opts);
  console.log('✅ Esquema aplicado a la BD');

  console.log('\n3️⃣  Ejecutando seed...');
  execSync('node src/db/seed.js', { ...opts, cwd: path.join(__dirname, '..', '..') });
  console.log('✅ Seed completado');

  console.log('\n🎉 Setup completo! El backend está listo.');
  console.log('   Ejecuta: npm run dev  — para iniciar el servidor');
} catch (err) {
  console.error('❌ Error durante el setup:', err.message);
  process.exit(1);
}
