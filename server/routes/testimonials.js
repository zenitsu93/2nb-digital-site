import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE testimonial (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, role, company, image, content, rating } = req.body;
    
    if (!name || !role || !company || !content) {
      return res.status(400).json({ error: 'Name, role, company and content are required' });
    }

    // Validate rating (1-5)
    const validRating = rating && rating >= 1 && rating <= 5 ? rating : 5;
    
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company,
        image: image || null,
        content,
        rating: validRating
      }
    });
    
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE testimonial (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, image, content, rating } = req.body;
    
    // Construire l'objet de données à mettre à jour
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (image !== undefined) updateData.image = image || null;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) {
      // Validate rating (1-5)
      updateData.rating = rating >= 1 && rating <= 5 ? rating : 5;
    }
    
    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    res.json(testimonial);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE testimonial (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.testimonial.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
