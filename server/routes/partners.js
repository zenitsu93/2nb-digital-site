import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Error fetching partners' });
  }
});

// GET partner by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const partner = await prisma.partner.findUnique({
      where: { id },
    });
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Error fetching partner' });
  }
});

// POST create partner (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, logo, website } = req.body;
    
    // Validation
    if (!name || !logo) {
      return res.status(400).json({ error: 'Le nom et le logo sont requis' });
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        logo: logo.trim(),
        website: website?.trim() || null,
      },
    });
    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Un partenaire avec ce nom existe déjà' });
    }
    if (error.code === 'P1001' || error.code === 'P2021' || error.code === 'P2025') {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données. Vérifiez que la migration a été exécutée avec: npm run db:migrate' });
    }
    if (error.message?.includes('table') || error.message?.includes('does not exist')) {
      return res.status(500).json({ error: 'La table partners n\'existe pas. Exécutez: cd server && npm run db:migrate' });
    }
    res.status(500).json({ error: error.message || 'Error creating partner' });
  }
});

// PUT update partner (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, logo, website } = req.body;
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name,
        logo,
        website: website || null,
      },
    });
    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.status(500).json({ error: 'Error updating partner' });
  }
});

// DELETE partner (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.partner.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting partner:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Partner not found' });
    }
    res.status(500).json({ error: 'Error deleting partner' });
  }
});

export default router;

