import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET all articles
router.get('/', async (req, res) => {
  try {
    const { published, category } = req.query;
    const where = {};
    
    if (published !== undefined) {
      where.published = published === 'true';
    }
    
    if (category) {
      where.category = category;
    }
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE article (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, image, video, author, category, tags, published, date } = req.body;
    
    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ error: 'Title, excerpt, content, author and category are required' });
    }
    
    const article = await prisma.article.create({
      data: {
        title,
        excerpt,
        content,
        image: image || null,
        video: video || null,
        author,
        category,
        tags: tags || [],
        published: published || false,
        date: date ? new Date(date) : new Date()
      }
    });
    
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE article (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, video, author, category, tags, published, date } = req.body;
    
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        excerpt,
        content,
        image: image || null,
        video: video || null,
        author,
        category,
        tags: tags || [],
        published: published !== undefined ? published : undefined,
        date: date ? new Date(date) : undefined
      }
    });
    
    res.json(article);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE article (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.article.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;

