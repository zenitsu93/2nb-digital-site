# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application 2NB Digital sur Vercel.

## 📋 Prérequis

- Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Un compte GitHub/GitLab/Bitbucket (pour connecter le repo)
- Le backend déployé quelque part (Railway, Render, Heroku, etc.) OU utiliser Vercel Serverless Functions

## 🚀 Déploiement du Frontend sur Vercel

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Connecter votre repository**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub/GitLab/Bitbucket

2. **Configuration du projet**
   - **Framework Preset** : Vite (détecté automatiquement)
   - **Root Directory** : `.` (racine du projet)
   - **Build Command** : `npm run build` (déjà configuré dans `vercel.json`)
   - **Output Directory** : `dist` (déjà configuré)

3. **Variables d'environnement**
   - Allez dans **Settings > Environment Variables**
   - Ajoutez les variables suivantes :
     ```
     VITE_API_URL=https://votre-api-backend.com/api
     ```
   - Remplacez `https://votre-api-backend.com` par l'URL de votre backend déployé

4. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel va automatiquement :
     - Installer les dépendances
     - Builder le projet
     - Déployer l'application

### Option 2 : Déploiement via CLI

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Ajouter les variables d'environnement**
   ```bash
   vercel env add VITE_API_URL
   # Entrez l'URL de votre API backend
   ```

5. **Déployer en production**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration du Backend

### Option A : Déployer le backend séparément (Recommandé)

Le backend nécessite une base de données PostgreSQL et un stockage de fichiers. Options recommandées :

#### Railway (Recommandé)
1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Ajoutez PostgreSQL
4. Déployez votre backend depuis le dossier `server/`
5. Configurez les variables d'environnement :
   - `DATABASE_URL` (fourni par Railway)
   - `JWT_SECRET`
   - `FRONTEND_URL` (URL de votre frontend Vercel)
   - `PORT` (généré automatiquement)

#### Render
1. Créez un compte sur [render.com](https://render.com)
2. Créez un nouveau "Web Service"
3. Connectez votre repository
4. Configurez :
   - **Root Directory** : `server`
   - **Build Command** : `npm install && npm run db:generate`
   - **Start Command** : `npm start`
5. Ajoutez PostgreSQL dans "New > PostgreSQL"
6. Configurez les variables d'environnement

### Option B : Utiliser Vercel Serverless Functions (Avancé)

Si vous voulez tout déployer sur Vercel, vous devrez adapter votre backend pour utiliser Vercel Serverless Functions. Cela nécessite des modifications importantes du code.

## 📝 Variables d'environnement à configurer

### Frontend (Vercel)
```
VITE_API_URL=https://votre-api-backend.com/api
```

### Backend (Railway/Render/etc.)
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://votre-site.vercel.app
NODE_ENV=production
PORT=3001
```

## 🔄 Mise à jour du CORS dans le backend

Assurez-vous que le backend autorise les requêtes depuis votre domaine Vercel :

```javascript
// Dans server/server.js
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
```

## 📦 Structure des fichiers

```
2nb-digital-site/
├── vercel.json          # Configuration Vercel
├── .vercelignore        # Fichiers à ignorer lors du déploiement
├── .vercel.example.env  # Exemple de variables d'environnement
└── server/              # Backend (déployé séparément)
```

## 🐛 Dépannage

### Erreur : "Module not found"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Exécutez `npm install` localement pour vérifier

### Erreur : "API URL not found"
- Vérifiez que `VITE_API_URL` est bien configuré dans Vercel
- Vérifiez que l'URL se termine par `/api`

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans le backend correspond à votre URL Vercel
- Format : `https://votre-site.vercel.app` (sans `/` à la fin)

### Build échoue
- Vérifiez les logs de build dans Vercel
- Testez le build localement : `npm run build`

## 🔗 Liens utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite](https://vitejs.dev)
- [Documentation Railway](https://docs.railway.app)
- [Documentation Render](https://render.com/docs)

## ✅ Checklist de déploiement

- [ ] Repository connecté à Vercel
- [ ] Variables d'environnement configurées
- [ ] Backend déployé et accessible
- [ ] Base de données PostgreSQL configurée
- [ ] CORS configuré dans le backend
- [ ] Test du déploiement réussi
- [ ] Domaine personnalisé configuré (optionnel)
