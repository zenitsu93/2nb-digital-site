// Point d'entrée pour les fonctions serverless Vercel
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from '../server/lib/prisma.js';
import serviceRoutes from '../server/routes/services.js';
import projectRoutes from '../server/routes/projects.js';
import articleRoutes from '../server/routes/articles.js';
import partnerRoutes from '../server/routes/partners.js';
import testimonialRoutes from '../server/routes/testimonials.js';
import uploadRoutes from '../server/routes/upload.js';
import authRoutes from '../server/routes/auth.js';
import { authenticateToken } from '../server/middleware/auth.js';

dotenv.config();

const app = express();

// Middleware CORS - Accepter toutes les origines pour Vercel
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running on Vercel' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export pour Vercel Serverless Functions
// Vercel utilise serverless-http pour adapter Express
export default app;
