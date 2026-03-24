/**
 * Stats Routes - /api/stats/*
 * Analytics y estadísticas reales
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const crypto = require('crypto');

const prisma = new PrismaClient();

/**
 * POST /api/stats/visit
 * Registrar visita de página (público, silencioso)
 */
router.post('/visit', async (req, res) => {
  try {
    const { page } = req.body;
    if (!page) return res.status(400).json({ error: 'page es requerida' });

    // Hash del IP para privacidad (GDPR-friendly)
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

    await prisma.pageVisit.create({
      data: {
        page: page.substring(0, 100),
        userAgent: req.headers['user-agent']?.substring(0, 300) || null,
        referrer: req.headers['referer']?.substring(0, 300) || null,
        ipHash,
      },
    });

    res.json({ success: true });
  } catch (err) {
    // No bloqueamos al usuario si falla el tracking
    res.json({ success: false });
  }
});

/**
 * GET /api/stats
 * Estadísticas generales del dashboard (solo admin)
 */
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalMessages,
      unreadMessages,
      messagesLast30,
      totalCvRequests,
      pendingCvRequests,
      totalConversations,
      activeConversations,
      derivedConversations,
      totalVisits,
      visitsLast7,
      totalProjects,
      featuredProjects,
    ] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.cvRequest.count(),
      prisma.cvRequest.count({ where: { status: 'pending' } }),
      prisma.chatbotConversation.count(),
      prisma.chatbotConversation.count({ where: { status: 'active' } }),
      prisma.chatbotConversation.count({ where: { derivedToHuman: true } }),
      prisma.pageVisit.count(),
      prisma.pageVisit.count({ where: { visitedAt: { gte: sevenDaysAgo } } }),
      prisma.project.count({ where: { active: true } }),
      prisma.project.count({ where: { featured: true, active: true } }),
    ]);

    // Páginas más visitadas
    const topPages = await prisma.pageVisit.groupBy({
      by: ['page'],
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    });

    // Mensajes por día (últimos 7 días)
    const recentMessages = await prisma.contactMessage.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      data: {
        messages: {
          total: totalMessages,
          unread: unreadMessages,
          last30Days: messagesLast30,
        },
        cvRequests: {
          total: totalCvRequests,
          pending: pendingCvRequests,
        },
        chatbot: {
          totalConversations,
          activeConversations,
          derivedToHuman: derivedConversations,
        },
        visits: {
          total: totalVisits,
          last7Days: visitsLast7,
          topPages: topPages.map(p => ({ page: p.page, visits: p._count.page })),
        },
        projects: {
          total: totalProjects,
          featured: featuredProjects,
        },
        recentMessages: recentMessages.map(m => m.createdAt),
      },
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

/**
 * GET /api/stats/visits/pages
 * Desglose de visitas por página (admin)
 */
router.get('/visits/pages', authenticate, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const pages = await prisma.pageVisit.groupBy({
      by: ['page'],
      _count: { page: true },
      where: { visitedAt: { gte: since } },
      orderBy: { _count: { page: 'desc' } },
    });

    res.json({
      success: true,
      data: pages.map(p => ({ page: p.page, visits: p._count.page })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de páginas' });
  }
});

module.exports = router;
