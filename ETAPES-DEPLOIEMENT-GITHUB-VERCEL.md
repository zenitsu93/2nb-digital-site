# 🚀 Étapes pour Déployer sur Vercel depuis GitHub

Vous avez déjà :
- ✅ Créé votre base de données PostgreSQL
- ✅ Poussé votre code sur GitHub

Maintenant, suivons ces étapes pour déployer sur Vercel :

## 📋 Étape 1 : Se connecter à Vercel

1. Allez sur **[https://vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Connectez-vous avec votre compte GitHub (recommandé pour l'intégration)

## 📦 Étape 2 : Importer votre projet depuis GitHub

1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
   OU
   Allez directement sur **[https://vercel.com/new](https://vercel.com/new)**

2. Vous verrez vos dépôts GitHub. **Trouvez votre projet** `2nb-digital-site` (ou le nom de votre repo)

3. Cliquez sur **"Import"** à côté de votre projet

## ⚙️ Étape 3 : Configurer le projet

Vercel devrait détecter automatiquement la configuration, mais vérifiez :

### Configuration du Build :

- **Framework Preset** : `Vite` (devrait être détecté automatiquement)
- **Root Directory** : `./` (racine du projet)
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install && cd server && npm install`

### Variables d'Environnement :

Cliquez sur **"Environment Variables"** et ajoutez ces variables :

| Variable | Valeur | Où trouver |
|----------|--------|------------|
| `DATABASE_URL` | `postgresql://...` | Votre base de données PostgreSQL (que vous avez créée) |
| `JWT_SECRET` | `votre-secret-fort` | Générez avec : `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `7d` | Durée d'expiration du token |
| `NODE_ENV` | `production` | Environnement de production |
| `VITE_API_URL` | (laissez vide) | Ou mettez `/api` |

**Important** :
- Pour chaque variable, cochez les 3 cases : **Production**, **Preview**, **Development**
- Cliquez sur **"Add"** après chaque variable

### Comment obtenir votre DATABASE_URL :

**Si vous avez utilisé Vercel Postgres** :
- Allez dans votre projet Vercel → **Storage** → Votre base de données
- Cliquez sur **".env.local"** → Copiez la ligne `DATABASE_URL=...`

**Si vous avez utilisé Supabase** :
- Allez dans votre projet → **Settings** → **Database**
- Sous **Connection string**, copiez l'URI (format `postgresql://...`)

**Si vous avez utilisé Neon** :
- Allez dans votre dashboard → Votre base de données
- Copiez la **Connection String**

## 🚀 Étape 4 : Déployer

1. Une fois toutes les variables configurées, cliquez sur **"Deploy"**

2. Vercel va :
   - Installer les dépendances
   - Builder votre projet
   - Déployer votre application

3. Attendez quelques minutes (2-5 minutes généralement)

## ✅ Étape 5 : Vérifier le déploiement

Une fois le déploiement terminé :

1. Vous verrez une URL comme : `https://votre-projet.vercel.app`
2. Cliquez sur cette URL pour voir votre site
3. Testez l'API : `https://votre-projet.vercel.app/api/health`
   - Vous devriez voir : `{"status":"ok","message":"API is running on Vercel"}`

## 🗄️ Étape 6 : Initialiser la base de données (IMPORTANT !)

Après le déploiement, vous devez créer les tables dans votre base de données :

### Option A : Via Vercel CLI (Recommandé)

1. **Installez Vercel CLI** :
   ```bash
   npm install -g vercel
   ```

2. **Connectez-vous** :
   ```bash
   vercel login
   ```

3. **Liez votre projet** (dans le dossier de votre projet) :
   ```bash
   vercel link
   ```
   - Sélectionnez votre projet Vercel
   - Confirmez les paramètres

4. **Récupérez les variables d'environnement** :
   ```bash
   cd server
   vercel env pull .env.local
   ```

5. **Exécutez les migrations Prisma** :
   ```bash
   npx prisma migrate deploy
   ```

6. **Créez l'admin par défaut** :
   ```bash
   node scripts/createDefaultAdmin.js
   ```

### Option B : Via votre machine locale

Si vous avez déjà votre `DATABASE_URL` :

1. Créez un fichier `server/.env.local` avec :
   ```env
   DATABASE_URL="votre-connection-string-postgresql"
   ```

2. Exécutez :
   ```bash
   cd server
   npx prisma migrate deploy
   node scripts/createDefaultAdmin.js
   ```

## 🔐 Étape 7 : Se connecter à l'admin

1. Allez sur : `https://votre-projet.vercel.app/admin/login`

2. Connectez-vous avec :
   - **Username** : `christian`
   - **Password** : `j20023700`

3. ⚠️ **IMPORTANT** : Changez immédiatement le mot de passe après la première connexion !

## 🎉 C'est fait !

Votre site est maintenant en ligne sur Vercel ! 🚀

## 🔄 Pour les mises à jour futures

Chaque fois que vous poussez du code sur GitHub :
1. Faites vos modifications
2. Committez et poussez :
   ```bash
   git add .
   git commit -m "Description des modifications"
   git push
   ```
3. Vercel déploiera automatiquement les changements !

## 🐛 Dépannage

### Erreur : "Prisma Client not generated"
- Vérifiez que le script `postinstall` dans `package.json` inclut `cd server && npx prisma generate`

### Erreur : "Database connection failed"
- Vérifiez que `DATABASE_URL` est correctement configurée dans Vercel
- Vérifiez que votre base de données accepte les connexions depuis Vercel

### Erreur : "Migration failed"
- Exécutez `npx prisma migrate deploy` manuellement (voir Étape 6)

### Le site fonctionne mais l'API ne répond pas
- Vérifiez que `VITE_API_URL` est vide ou égale à `/api` dans Vercel
- Vérifiez les logs dans Vercel Dashboard → Deployments → Votre déploiement → Function Logs
