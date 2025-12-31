import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category && category !== 'Tous' ? { category } : {};
    
    const projects = await prisma.project.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE project
router.post('/', async (req, res) => {
  try {
    const { title, description, image, video, category, tags, date } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description and category are required' });
    }
    
    const project = await prisma.project.create({
      data: {
        title,
        description,
        image: image || null,
        video: video || null,
        category,
        tags: tags || [],
        date: date ? new Date(date) : new Date()
      }
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, video, category, tags, date } = req.body;
    
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        image: image || null,
        video: video || null,
        category,
        tags: tags || [],
        date: date ? new Date(date) : undefined
      }
    });
    
    res.json(project);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;

