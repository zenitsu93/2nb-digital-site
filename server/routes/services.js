import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET service by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE service (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, icon, features } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || null,
        features: features || []
      }
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE service (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, features } = req.body;
    
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        icon: icon || null,
        features: features || []
      }
    });
    
    res.json(service);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE service (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;

