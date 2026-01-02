# Guide de déploiement - Backend

## 🎯 Où déployer le backend ?

Vous avez plusieurs options. Voici les plus simples :

### Option 1 : Railway (⭐ Recommandé - Le plus simple)

**Avantages** :
- ✅ Gratuit pour commencer
- ✅ Base de données PostgreSQL incluse
- ✅ Déploiement automatique depuis GitHub
- ✅ Configuration très simple

**Étapes** :

1. **Créer un compte** sur [railway.app](https://railway.app)

2. **Créer un nouveau projet** :
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository `2nb-digital-site`

3. **Ajouter PostgreSQL** :
   - Dans votre projet Railway, cliquez sur "+ New"
   - Sélectionnez "Database" → "PostgreSQL"
   - Railway créera automatiquement une base de données

4. **Configurer les variables d'environnement** :
   - Cliquez sur votre service backend
   - Allez dans "Variables"
   - Ajoutez ces variables :
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://votre-frontend.vercel.app
     JWT_SECRET=votre-secret-jwt-tres-securise-changez-moi
     JWT_EXPIRES_IN=7d
     ```
   - **Important** : Remplacez `FRONTEND_URL` par l'URL de votre frontend Vercel
   - **Important** : Remplacez `JWT_SECRET` par une chaîne aléatoire sécurisée

5. **Configurer le déploiement** :
   - Dans "Settings" → "Root Directory", définissez : `server`
   - Dans "Settings" → "Start Command", définissez : `npm start`

6. **Exécuter les migrations** :
   - Dans "Settings" → "Deploy", ajoutez un "Build Command" :
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```

7. **Créer l'admin par défaut** :
   - Dans Railway, allez dans "Deployments"
   - Cliquez sur le dernier déploiement
   - Ouvrez la console et exécutez :
     ```bash
     npm run create-default-admin
     ```

8. **Obtenir l'URL du backend** :
   - Dans Railway, cliquez sur votre service
   - L'URL sera affichée (ex: `https://votre-backend.railway.app`)
   - **L'URL de l'API sera** : `https://votre-backend.railway.app/api`

---

### Option 2 : Render (Gratuit aussi)

**Avantages** :
- ✅ Plan gratuit disponible
- ✅ PostgreSQL gratuit
- ✅ Déploiement depuis GitHub

**Étapes** :

1. **Créer un compte** sur [render.com](https://render.com)

2. **Créer une base de données PostgreSQL** :
   - "New +" → "PostgreSQL"
   - Choisissez le plan gratuit
   - Notez la "Internal Database URL"

3. **Créer un Web Service** :
   - "New +" → "Web Service"
   - Connectez votre repository GitHub
   - Configuration :
     - **Name** : `2nb-digital-backend`
     - **Root Directory** : `server`
     - **Environment** : `Node`
     - **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
     - **Start Command** : `npm start`

4. **Variables d'environnement** :
   ```
   DATABASE_URL=<votre-internal-database-url>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://votre-frontend.vercel.app
   JWT_SECRET=votre-secret-jwt-tres-securise
   JWT_EXPIRES_IN=7d
   ```

5. **Obtenir l'URL** :
   - L'URL sera : `https://votre-backend.onrender.com`
   - **L'URL de l'API sera** : `https://votre-backend.onrender.com/api`

---

## 🔗 Après le déploiement du backend

Une fois votre backend déployé, vous obtiendrez une URL comme :
- `https://votre-backend.railway.app` (Railway)
- `https://votre-backend.onrender.com` (Render)

**L'URL complète de l'API sera** : `https://votre-backend.railway.app/api`

### Configurer le frontend Vercel

1. Allez dans votre projet Vercel
2. "Settings" → "Environment Variables"
3. Ajoutez :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-backend.railway.app/api` (remplacez par votre URL)
4. Redéployez votre frontend

---

## 📝 Checklist de déploiement

- [ ] Backend déployé sur Railway ou Render
- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement configurées
- [ ] Migrations exécutées
- [ ] Admin par défaut créé
- [ ] URL du backend obtenue
- [ ] Variable `VITE_API_URL` configurée dans Vercel
- [ ] Frontend redéployé avec la nouvelle variable

---

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez les logs dans Railway/Render
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que `DATABASE_URL` est correcte

### Erreur de connexion à la base de données
- Vérifiez que la base de données est créée et active
- Vérifiez que `DATABASE_URL` utilise la bonne URL (Internal Database URL pour Render)

### Les migrations échouent
- Vérifiez que Prisma est bien installé
- Vérifiez que `DATABASE_URL` est accessible
- Essayez d'exécuter les migrations manuellement dans la console
