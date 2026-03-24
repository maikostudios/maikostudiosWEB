/**
 * Script para crear la base de datos db_maikostudios_web
 * Conecta al servidor PostgreSQL usando la BD "postgres" (por defecto)
 * y crea la BD de destino si no existe.
 */
const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Conectamos a la BD por defecto "postgres" para poder crear la nueva
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',          // BD por defecto del servidor
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
  });

  const dbName = process.env.DB_NAME || 'db_maikostudios_web';

  try {
    await client.connect();
    console.log('✅ Conectado al servidor PostgreSQL');

    // Verificar si ya existe
    const result = await client.query(
      `SELECT 1 FROM pg_catalog.pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount > 0) {
      console.log(`ℹ️  La base de datos "${dbName}" ya existe.`);
    } else {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos "${dbName}" creada exitosamente.`);
    }
  } catch (err) {
    console.error('❌ Error al crear la base de datos:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
