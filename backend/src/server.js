/**
 * MaikoStudios Backend - Servidor Principal
 * Express + PostgreSQL + Prisma
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Rutas
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const pricingRoutes = require('./routes/pricing.routes');
const projectsRoutes = require('./routes/projects.routes');
const cvRoutes = require('./routes/cv.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const aiRoutes = require('./routes/ai.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ========================
// MIDDLEWARES GLOBALES
// ========================

// Helmet - seguridad en headers HTTP
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_PROD || 'https://maikostudios.com',
  'http://localhost:5174',
  'http://localhost:4173',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origen no permitido: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Demasiadas peticiones. Intenta en unos minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Rate limiting estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 1000 : 10, // Aumentado para desarrollo
  message: { error: 'Demasiados intentos de login. Intenta en 15 minutos.' },
});

// ========================
// RUTAS DE LA API
// ========================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'MaikoStudios Backend',
    env: process.env.NODE_ENV,
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(`❌ Error [${req.method} ${req.url}]:`, err.message);

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  });
});

// ========================
// INICIAR SERVIDOR
// ========================
app.listen(PORT, () => {
  console.log(`\n🚀 MaikoStudios Backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend permitido: ${process.env.FRONTEND_URL}`);
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   POST   /api/contact        (público)`);
  console.log(`   GET    /api/contact        (admin)`);
  console.log(`   GET    /api/pricing/packs  (público)`);
  console.log(`   GET    /api/pricing/plans  (público)`);
  console.log(`   GET    /api/projects       (público)`);
  console.log(`   POST   /api/cv/request     (público)`);
  console.log(`   POST   /api/chatbot/conversation`);
  console.log(`   POST   /api/ai/gemini      (proxy seguro)`);
  console.log(`   GET    /api/stats          (admin)`);
});

module.exports = app;
