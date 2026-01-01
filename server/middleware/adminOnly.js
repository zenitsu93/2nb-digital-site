import { authenticateToken } from './auth.js';

// Middleware pour protéger uniquement les routes POST, PUT, DELETE
export const adminOnly = (req, res, next) => {
  // Les routes GET sont publiques
  if (req.method === 'GET') {
    return next();
  }
  
  // Les autres méthodes nécessitent une authentification
  return authenticateToken(req, res, next);
};
