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
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
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

// Servir les fichiers statiques du frontend (dist/)
const frontendDir = join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDir)) {
  // Servir les fichiers statiques avec des options pour mieux gérer les assets
  app.use(express.static(frontendDir, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    index: false, // Ne pas servir index.html automatiquement
  }));
  console.log('📁 Frontend statique servi depuis:', frontendDir);
}

// Routes API
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

// Servir le frontend React pour toutes les routes non-API (SPA routing)
if (fs.existsSync(frontendDir)) {
  app.get('*', (req, res) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    // Ne pas intercepter les fichiers statiques (assets, images, etc.)
    const requestedPath = join(frontendDir, req.path);
    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
      return res.sendFile(requestedPath);
    }
    
    // Servir index.html pour toutes les autres routes (React Router)
    res.sendFile(join(frontendDir, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
// Pour Passenger (O2Switch), utiliser 'passenger' au lieu du port
// Passenger intercepte automatiquement et gère les connexions
// Selon la documentation O2Switch: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
if (process.env.NODE_ENV === 'production' && process.env.PORT) {
  // Mode Passenger (production O2Switch)
  // Passenger détecte automatiquement et intercepte l'appel listen()
  app.listen('passenger', () => {
    console.log('🚀 Server running on Passenger (O2Switch)');
  });
} else {
  // Mode développement local
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

