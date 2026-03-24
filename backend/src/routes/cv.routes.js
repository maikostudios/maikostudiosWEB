/**
 * CV Routes - /api/cv/*
 * Solicitudes de CV personalizado con IA
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

// Rate limit para solicitudes de CV (evitar abuso de la IA)
const cvLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Demasiadas solicitudes de CV. Intenta en una hora.' },
});

/**
 * POST /api/cv/request
 * Nueva solicitud de CV personalizado (público)
 */
router.post('/request', cvLimiter, async (req, res) => {
  try {
    const { recruiterName, recruiterEmail, company, position, requiredSkills, jobDescription, customPrompt } = req.body;

    if (!position) {
      return res.status(400).json({ error: 'La posición/cargo es requerida' });
    }

    const cvRequest = await prisma.cvRequest.create({
      data: {
        recruiterName: recruiterName || null,
        recruiterEmail: recruiterEmail || null,
        company: company || null,
        position,
        requiredSkills: requiredSkills || [],
        jobDescription: jobDescription || null,
        customPrompt: customPrompt || null,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud de CV registrada. Será generada próximamente.',
      id: cvRequest.id,
    });
  } catch (err) {
    console.error('Error al crear solicitud CV:', err);
    res.status(500).json({ error: 'Error al registrar solicitud' });
  }
});

/**
 * POST /api/cv/generate
 * Genera CV con IA usando Gemini (proxy seguro)
 */
router.post('/generate', cvLimiter, async (req, res) => {
  try {
    const { recruiterName, recruiterEmail, company, position, requiredSkills, jobDescription, customPrompt } = req.body;

    // Crear registro en BD
    const cvRequest = await prisma.cvRequest.create({
      data: {
        recruiterName: recruiterName || null,
        recruiterEmail: recruiterEmail || null,
        company: company || null,
        position: position || 'No especificado',
        requiredSkills: requiredSkills || [],
        jobDescription: jobDescription || null,
        customPrompt: customPrompt || null,
        status: 'generating',
        aiProvider: 'gemini',
      },
    });

    // Llamar a Gemini desde el backend (la API key está segura aquí)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'tu_gemini_api_key_aqui') {
      await prisma.cvRequest.update({ where: { id: cvRequest.id }, data: { status: 'error' } });
      return res.status(503).json({ error: 'Servicio de IA no configurado en el servidor. Agrega GEMINI_API_KEY al .env del backend.' });
    }

    const prompt = buildCVPrompt({ position, company, requiredSkills, jobDescription, customPrompt });

    const geminiResp = await require('axios').post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );

    const html = geminiResp.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Guardar resultado
    await prisma.cvRequest.update({
      where: { id: cvRequest.id },
      data: { generatedHtml: html, status: 'completed', aiProvider: 'gemini' },
    });

    res.json({ success: true, html, id: cvRequest.id });
  } catch (err) {
    console.error('Error al generar CV:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al generar CV con IA' });
  }
});

/**
 * GET /api/cv/requests
 * Listar todas las solicitudes (solo admin)
 */
router.get('/requests', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [requests, total] = await Promise.all([
      prisma.cvRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.cvRequest.count({ where }),
    ]);

    res.json({
      success: true,
      data: requests,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

/**
 * GET /api/cv/requests/:id
 * Detalle de una solicitud (admin)
 */
router.get('/requests/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const cvReq = await prisma.cvRequest.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!cvReq) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json({ success: true, data: cvReq });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
});

// Helper: construir el prompt para el CV
function buildCVPrompt({ position, company, requiredSkills, jobDescription, customPrompt }) {
  return `Eres MaikoCV, un experto en RRHH del sector TI. Genera un CV en HTML para Michael Esteban Sáez Contreras.

DATOS DEL CANDIDATO:
- Nombre: Michael Esteban Sáez Contreras
- Cargo: Desarrollador Full Stack
- Email: m.saezc@maikostudios.com
- Teléfono: +56920648446
- LinkedIn: https://www.linkedin.com/in/me-saezc/
- Web: https://maikostudios.com/
- Ubicación: Chile
- Perfil: Desarrollador Full Stack con experiencia en Vue.js, React, Node.js, Java, Python. Certificado como facilitador e-learning.

POSICIÓN OBJETIVO: ${position}
${company ? `EMPRESA: ${company}` : ''}
${requiredSkills?.length ? `HABILIDADES REQUERIDAS: ${requiredSkills.join(', ')}` : ''}
${jobDescription ? `DESCRIPCIÓN: ${jobDescription}` : ''}
${customPrompt ? `PERSONALIZACIÓN: ${customPrompt}` : ''}

EXPERIENCIA:
1. Fundador - Maiko Studios (2024-Presente): Plataformas digitales, IA, automatización
2. Facilitador Frontend - Desafío Latam (Ago-Dic 2024): Vue.js, HTML, CSS, JavaScript
3. Facilitador Bootcamp - INFOCAL (Ene-Sep 2024): Frontend con Vue.js
4. Full Stack Developer - Tata Consultancy Services (Jul 2021-Dic 2023): MetLife Chile, Node.js, Express, SQL
5. Soporte TI - NTTDATA Centers (Nov 2020-Dic 2021)

HABILIDADES: Vue.js, React, Node.js, Python, Java, PostgreSQL, MongoDB, Firebase, Docker, AWS

INSTRUCCIONES:
- Genera HTML completo y profesional optimizado para ATS
- Header oscuro (#121212), títulos en cian (#00cccc), todo el texto en negro
- Formato limpio, sin explicaciones adicionales, solo el HTML
- Adapta el contenido para destacar lo relevante para la posición indicada`;
}

module.exports = router;
