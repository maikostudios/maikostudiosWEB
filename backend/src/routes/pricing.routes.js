/**
 * Pricing Routes - /api/pricing/*
 * Packs (pago único) y Planes (suscripción)
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

// ========================
// PACKS (pago único)
// ========================

/** GET /api/pricing/packs — Público */
router.get('/packs', async (req, res) => {
  try {
    const packs = await prisma.pricingPack.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: packs });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener packs' });
  }
});

/** GET /api/pricing/packs/all — Todos (admin incluye inactivos) */
router.get('/packs/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const packs = await prisma.pricingPack.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: packs });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener packs' });
  }
});

/** POST /api/pricing/packs — Crear pack (admin) */
router.post('/packs', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, subtitle, description, priceMonthly, priceAnnual, currency, features, displayOrder, popular, color, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });

    const pack = await prisma.pricingPack.create({
      data: {
        name, subtitle, description,
        priceMonthly: priceMonthly ? parseInt(priceMonthly) : null,
        priceAnnual: priceAnnual ? parseInt(priceAnnual) : null,
        currency: currency || 'CLP',
        features: features || [],
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        popular: popular || false,
        color, icon,
      },
    });
    res.status(201).json({ success: true, data: pack });
  } catch (err) {
    console.error('Error al crear pack:', err);
    res.status(500).json({ error: 'Error al crear pack' });
  }
});

/** PUT /api/pricing/packs/:id — Actualizar pack (admin) */
router.put('/packs/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, subtitle, description, priceMonthly, priceAnnual, currency, features, active, displayOrder, popular, color, icon } = req.body;
    const pack = await prisma.pricingPack.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(name !== undefined && { name }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(priceMonthly !== undefined && { priceMonthly: parseInt(priceMonthly) }),
        ...(priceAnnual !== undefined && { priceAnnual: parseInt(priceAnnual) }),
        ...(currency !== undefined && { currency }),
        ...(features !== undefined && { features }),
        ...(active !== undefined && { active }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(popular !== undefined && { popular }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
      },
    });
    res.json({ success: true, data: pack });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar pack' });
  }
});

/** DELETE /api/pricing/packs/:id — Eliminar pack (admin) */
router.delete('/packs/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.pricingPack.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Pack eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar pack' });
  }
});

// ========================
// PLANES (suscripción)
// ========================

/** GET /api/pricing/plans — Público */
router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener planes' });
  }
});

/** GET /api/pricing/plans/all — Todos (admin) */
router.get('/plans/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const plans = await prisma.pricingPlan.findMany({ orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener planes' });
  }
});

/** POST /api/pricing/plans — Crear plan (admin) */
router.post('/plans', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, subtitle, description, priceMonthly, priceAnnual, currency, features, displayOrder, popular, color, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });

    const plan = await prisma.pricingPlan.create({
      data: {
        name, subtitle, description,
        priceMonthly: priceMonthly ? parseInt(priceMonthly) : null,
        priceAnnual: priceAnnual ? parseInt(priceAnnual) : null,
        currency: currency || 'CLP',
        features: features || [],
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        popular: popular || false,
        color, icon,
      },
    });
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear plan' });
  }
});

/** PUT /api/pricing/plans/:id — Actualizar plan (admin) */
router.put('/plans/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, subtitle, description, priceMonthly, priceAnnual, currency, features, active, displayOrder, popular, color, icon } = req.body;
    const plan = await prisma.pricingPlan.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(name !== undefined && { name }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(priceMonthly !== undefined && { priceMonthly: parseInt(priceMonthly) }),
        ...(priceAnnual !== undefined && { priceAnnual: parseInt(priceAnnual) }),
        ...(currency !== undefined && { currency }),
        ...(features !== undefined && { features }),
        ...(active !== undefined && { active }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(popular !== undefined && { popular }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
      },
    });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar plan' });
  }
});

/** DELETE /api/pricing/plans/:id — Eliminar plan (admin) */
router.delete('/plans/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.pricingPlan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Plan eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar plan' });
  }
});

// GET /api/pricing — Devuelve packs y planes juntos (conveniente para el frontend)
router.get('/', async (req, res) => {
  try {
    const [packs, plans] = await Promise.all([
      prisma.pricingPack.findMany({ where: { active: true }, orderBy: { displayOrder: 'asc' } }),
      prisma.pricingPlan.findMany({ where: { active: true }, orderBy: { displayOrder: 'asc' } }),
    ]);
    res.json({ success: true, data: { packs, plans } });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener precios' });
  }
});

module.exports = router;
