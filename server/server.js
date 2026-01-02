import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import serviceRoutes from './routes/services.js';
import projectRoutes from './routes/projects.js';
import articleRoutes from './routes/articles.js';
import partnerRoutes from './routes/partners.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Gérer plusieurs origines CORS (pour développement et production)
const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim());
const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Vérifier si l'origine est autorisée
    if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin?.includes(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // En production, vous pouvez restreindre : callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Créer le dossier public/uploads s'il n'existe pas
const uploadsDir = join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Dossier uploads créé:', uploadsDir);
}

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(uploadsDir));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes publiques (lecture seule pour le site)
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Routes protégées (admin uniquement)
app.use('/api/upload', authenticateToken, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

