/**
 * Contact Routes - /api/contact/*
 * Formularios de contacto con email real
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { sendContactNotification } = require('../services/email.service');

const prisma = new PrismaClient();

// Rate limit específico para envío de mensajes (anti spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { error: 'Demasiados mensajes enviados. Intenta en una hora.' },
});

/**
 * POST /api/contact
 * Enviar mensaje de contacto (público)
 */
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, source } = req.body;

    // Validaciones básicas
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son requeridos' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'El mensaje debe tener al menos 10 caracteres' });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim().substring(0, 100),
        email: email.trim().toLowerCase().substring(0, 255),
        phone: phone ? phone.trim().substring(0, 20) : null,
        company: company ? company.trim().substring(0, 200) : null,
        subject: subject ? subject.trim().substring(0, 200) : null,
        message: message.trim().substring(0, 5000),
        source: source || 'web_form',
      },
    });

    // Enviar notificación por email al admin (no bloqueante)
    sendContactNotification(newMessage).catch(err =>
      console.error('⚠️ Error enviando email de notificación:', err.message)
    );

    res.status(201).json({
      success: true,
      message: '¡Mensaje enviado correctamente! Te responderemos pronto.',
      id: newMessage.id,
    });
  } catch (err) {
    console.error('Error al enviar contacto:', err);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
});

/**
 * GET /api/contact
 * Listar todos los mensajes (solo admin)
 */
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, read, responded } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (read !== undefined) where.read = read === 'true';
    if (responded !== undefined) where.responded = responded === 'true';

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('Error al listar mensajes:', err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

/**
 * GET /api/contact/:id
 * Obtener un mensaje específico (solo admin)
 */
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mensaje' });
  }
});

/**
 * PATCH /api/contact/:id/read
 * Marcar mensaje como leído (solo admin)
 */
router.patch('/:id/read', authenticate, requireAdmin, async (req, res) => {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { read: true, readAt: new Date() },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

/**
 * PATCH /api/contact/:id/responded
 * Marcar mensaje como respondido (solo admin)
 */
router.patch('/:id/responded', authenticate, requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body;
    const updated = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        responded: true,
        respondedAt: new Date(),
        read: true,
        readAt: new Date(),
        ...(notes && { notes }),
      },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

/**
 * DELETE /api/contact/:id
 * Eliminar mensaje (solo admin)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

module.exports = router;
