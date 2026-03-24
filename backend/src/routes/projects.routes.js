/**
 * Projects Routes - /api/projects/*
 * Portafolio de proyectos
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

/** GET /api/projects — Proyectos activos (público) */
router.get('/', async (req, res) => {
  try {
    const { featured, homeDisplay, category } = req.query;
    const where = { active: true };
    if (featured !== undefined) where.featured = featured === 'true';
    if (homeDisplay !== undefined) where.homeDisplay = homeDisplay === 'true';
    if (category) where.category = category;

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

/** GET /api/projects/all — Todos los proyectos (admin) */
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

/** GET /api/projects/:id — Proyecto específico (público) */
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!project || !project.active) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
});

/** POST /api/projects — Crear proyecto (admin) */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, description, shortDescription, imageUrl, demoUrl, githubUrl, technologies, category, featured, homeDisplay, displayOrder } = req.body;
    if (!title) return res.status(400).json({ error: 'El título es requerido' });

    const project = await prisma.project.create({
      data: {
        title, description, shortDescription, imageUrl, demoUrl, githubUrl,
        technologies: technologies || [],
        category,
        featured: featured || false,
        homeDisplay: homeDisplay || false,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      },
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error('Error al crear proyecto:', err);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
});

/** PUT /api/projects/:id — Actualizar proyecto (admin) */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const allowed = ['title', 'description', 'shortDescription', 'imageUrl', 'demoUrl', 'githubUrl', 'technologies', 'category', 'featured', 'homeDisplay', 'active', 'displayOrder'];
    const data = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        data[key] = key === 'displayOrder' ? parseInt(req.body[key]) : req.body[key];
      }
    }

    const project = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

/** DELETE /api/projects/:id — Eliminar proyecto (admin) */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

module.exports = router;
