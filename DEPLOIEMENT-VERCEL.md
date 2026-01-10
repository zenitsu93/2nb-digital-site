# 🚀 Guide de Déploiement sur Vercel avec Prisma

Ce guide vous explique comment déployer votre application 2NB Digital sur Vercel en utilisant Prisma avec PostgreSQL.

## 📋 Prérequis

1. Un compte Vercel (gratuit) : [https://vercel.com](https://vercel.com)
2. Une base de données PostgreSQL (recommandé : Vercel Postgres, Supabase, Neon, ou Railway)
3. Git installé sur votre machine
4. Le code du projet prêt à être déployé

## 🔧 Étape 1 : Préparer la Base de Données PostgreSQL (GRATUIT)

**Important** : Votre projet utilise déjà **Prisma avec PostgreSQL** ! Vous avez juste besoin d'une base PostgreSQL gratuite pour héberger vos données.

### Option A : Vercel Postgres (100% GRATUIT - Recommandé) ⭐

**Gratuit jusqu'à 256 MB** - Parfait pour commencer !

1. Connectez-vous à votre dashboard Vercel
2. Allez dans **Storage** → **Create Database** → **Postgres**
3. Créez une nouvelle base de données (c'est gratuit !)
4. Vercel vous donnera automatiquement la **Connection String** (DATABASE_URL)
5. Cette URL sera automatiquement disponible dans vos variables d'environnement Vercel

**Avantages** :
- ✅ 100% gratuit jusqu'à 256 MB
- ✅ Intégré directement avec Vercel
- ✅ Configuration automatique
- ✅ Pas besoin de configuration supplémentaire

### Option B : Supabase (100% GRATUIT) ⭐

**Gratuit jusqu'à 500 MB** - Très généreux !

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Allez dans **Settings** → **Database**
5. Copiez la **Connection String** (URI)

**Avantages** :
- ✅ 100% gratuit jusqu'à 500 MB
- ✅ Interface très facile à utiliser
- ✅ Inclut un dashboard pour gérer vos données

### Option C : Neon (100% GRATUIT) ⭐

**Gratuit jusqu'à 512 MB** - Encore plus généreux !

1. Allez sur [https://neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez une nouvelle base de données
4. Copiez la **Connection String**

**Avantages** :
- ✅ 100% gratuit jusqu'à 512 MB
- ✅ Très performant
- ✅ Facile à utiliser

---

**Format de la Connection String** (pour référence) :
```
postgresql://user:password@host:port/database?schema=public
```

**Note** : Toutes ces options sont **100% GRATUITES** pour commencer ! Vous n'avez rien à payer. Prisma fonctionnera parfaitement avec n'importe laquelle de ces bases PostgreSQL gratuites.

## 🔑 Étape 2 : Configurer les Variables d'Environnement

### Dans Vercel Dashboard :

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings** → **Environment Variables**
3. Ajoutez les variables suivantes :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DATABASE_URL` | `postgresql://...` | URL de connexion PostgreSQL |
| `JWT_SECRET` | `votre-secret-fort` | Secret pour JWT (générez avec `openssl rand -base64 32`) |
| `JWT_EXPIRES_IN` | `7d` | Durée d'expiration du token JWT |
| `NODE_ENV` | `production` | Environnement de production |
| `VITE_API_URL` | (vide ou `/api`) | URL de l'API pour le frontend (laisser vide pour utiliser `/api` automatiquement) |

**Note** : Pour `VITE_API_URL`, vous pouvez soit :
- Laisser vide : le frontend utilisera `/api` (recommandé pour Vercel)
- Mettre `/api` : même résultat
- Mettre l'URL complète : `https://votre-site.vercel.app/api` (si vous avez besoin d'un domaine spécifique)

**Important** : 
- Le `FRONTEND_URL` sera automatiquement défini par Vercel
- Ne partagez jamais votre `JWT_SECRET` publiquement

## 📦 Étape 3 : Déployer via l'Interface Vercel

### Méthode 1 : Import depuis Git (Recommandé)

1. **Préparez votre dépôt Git** :
   ```bash
   git init
   git add .
   git commit -m "Préparation pour Vercel"
   git remote add origin https://github.com/votre-username/votre-repo.git
   git push -u origin main
   ```

2. **Sur Vercel** :
   - Allez sur [https://vercel.com/new](https://vercel.com/new)
   - Cliquez sur **Import Git Repository**
   - Connectez votre compte GitHub/GitLab/Bitbucket
   - Sélectionnez votre dépôt
   - Vercel détectera automatiquement la configuration

3. **Configurez le projet** :
   - **Framework Preset** : Vite
   - **Root Directory** : `./` (racine du projet)
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install && cd server && npm install`

4. **Ajoutez les variables d'environnement** (voir Étape 2)

5. Cliquez sur **Deploy**

### Méthode 2 : Upload Direct

1. Allez sur [https://vercel.com/new](https://vercel.com/new)
2. Cliquez sur **Upload**
3. Glissez-déposez votre dossier de projet
4. Configurez comme dans la Méthode 1
5. Ajoutez les variables d'environnement
6. Cliquez sur **Deploy**

## 🗄️ Étape 4 : Initialiser la Base de Données

Après le déploiement, vous devez exécuter les migrations Prisma :

### Option A : Via Vercel CLI (Recommandé)

1. Installez Vercel CLI :
   ```bash
   npm i -g vercel
   ```

2. Connectez-vous :
   ```bash
   vercel login
   ```

3. Liez votre projet :
   ```bash
   vercel link
   ```

4. Exécutez les migrations :
   ```bash
   cd server
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Option B : Via Vercel Dashboard (Shell)

1. Allez sur votre projet Vercel
2. Cliquez sur **Deployments** → Sélectionnez le dernier déploiement
3. Cliquez sur les **...** → **View Function Logs**
4. Utilisez la console pour exécuter les migrations

### Option C : Via Script Local avec Variables d'Environnement

1. Créez un fichier `.env.local` dans `server/` avec vos variables Vercel
2. Exécutez :
   ```bash
   cd server
   npx prisma migrate deploy
   npx prisma db seed  # Si vous avez un seed
   ```

## 👤 Étape 5 : Créer l'Admin par Défaut

Pour créer le compte administrateur par défaut :

```bash
cd server
node scripts/createDefaultAdmin.js
```

**Identifiants par défaut** :
- Username : `christian`
- Password : `j20023700`

⚠️ **Changez ces identifiants immédiatement après le premier login !**

## ✅ Étape 6 : Vérifier le Déploiement

1. Visitez votre URL Vercel : `https://votre-projet.vercel.app`
2. Testez l'API : `https://votre-projet.vercel.app/api/health`
3. Connectez-vous à l'admin : `https://votre-projet.vercel.app/admin/login`

## 🔄 Mises à Jour Futures

Pour mettre à jour votre application :

1. Faites vos modifications localement
2. Committez et poussez sur Git :
   ```bash
   git add .
   git commit -m "Description des modifications"
   git push
   ```
3. Vercel déploiera automatiquement les changements

## 🐛 Dépannage

### Erreur : "Prisma Client not generated"
- Solution : Vérifiez que le script `postinstall` dans `package.json` inclut `cd server && npx prisma generate`

### Erreur : "Database connection failed"
- Vérifiez que `DATABASE_URL` est correctement configurée dans Vercel
- Vérifiez que votre base de données accepte les connexions depuis Vercel (whitelist IP)

### Erreur : "Migration failed"
- Exécutez `npx prisma migrate deploy` manuellement
- Vérifiez que votre schéma Prisma est à jour

### Les images/uploads ne fonctionnent pas
- ⚠️ **IMPORTANT** : Vercel utilise un système de fichiers en lecture seule
- Le système d'upload actuel (`server/routes/upload.js`) utilise multer avec stockage local, ce qui ne fonctionnera PAS sur Vercel
- **Solution** : Vous devez migrer vers un service cloud pour les uploads :
  - **Cloudinary** (recommandé, gratuit jusqu'à 25GB)
  - **AWS S3** (payant mais très fiable)
  - **Vercel Blob Storage** (intégré à Vercel)
- Modifiez `server/routes/upload.js` pour utiliser un de ces services
- Consultez la documentation de votre service choisi pour l'intégration

## 📝 Notes Importantes

1. **Uploads de fichiers** : Vercel ne supporte pas l'écriture de fichiers sur le système de fichiers. Pour les uploads, utilisez :
   - Cloudinary
   - AWS S3
   - Vercel Blob Storage

2. **Base de données** : 
   - **Vercel Postgres** : Gratuit jusqu'à 256 MB ⭐
   - **Supabase** : Gratuit jusqu'à 500 MB ⭐
   - **Neon** : Gratuit jusqu'à 512 MB ⭐
   - Toutes ces options sont **100% GRATUITES** pour commencer !

3. **Limites** : Les fonctions serverless Vercel ont une limite de 10 secondes (gratuit) ou 60 secondes (Pro).

4. **Variables d'environnement** : Assurez-vous que toutes les variables sont définies pour Production, Preview et Development.

## 🎉 Félicitations !

Votre application est maintenant déployée sur Vercel ! 🚀

Pour toute question, consultez la [documentation Vercel](https://vercel.com/docs).
