# 📋 Variables d'Environnement - Guide Complet

Ce document liste toutes les variables d'environnement nécessaires pour votre projet 2NB Digital.

## 🔧 Variables Backend (server/.env.local)

### Base de Données (OBLIGATOIRE)
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```
**Description** : URL de connexion à votre base de données PostgreSQL  
**Exemple Vercel Postgres** : `postgresql://user:pass@host.vercel-storage.com:5432/dbname?schema=public`  
**Exemple Supabase** : `postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres`  
**Exemple Neon** : `postgresql://user:pass@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### Configuration Serveur
```env
PORT=3001
```
**Description** : Port sur lequel le serveur backend écoute  
**Défaut** : `3001`  
**Note** : Vercel gère automatiquement le port en production

```env
NODE_ENV=production
```
**Description** : Environnement d'exécution  
**Valeurs possibles** : `development`, `production`, `test`  
**Pour Vercel** : `production`

```env
FRONTEND_URL=https://votre-site.vercel.app
```
**Description** : URL du frontend pour la configuration CORS  
**Développement local** : `http://localhost:5173`  
**Production Vercel** : `https://votre-projet.vercel.app`  
**Note** : Vercel peut automatiquement définir cette variable

### Authentification JWT (OBLIGATOIRE)
```env
JWT_SECRET=votre-secret-jwt-tres-securise
```
**Description** : Secret utilisé pour signer les tokens JWT  
**Génération** : `openssl rand -base64 32`  
**⚠️ IMPORTANT** : Utilisez un secret fort et unique en production !  
**Exemple** : `aB3xK9mP2qR7sT4uV6wY8zA1bC5dE0fG2hI4jK6lM8nO0pQ3rS5tU7vW9xY1z`

```env
JWT_EXPIRES_IN=7d
```
**Description** : Durée de validité des tokens JWT  
**Défaut** : `7d` (7 jours)  
**Autres formats** : `1h`, `24h`, `30d`, `1y`

## 🎨 Variables Frontend (.env.local à la racine)

```env
VITE_API_URL=http://localhost:3001/api
```
**Description** : URL de base pour les appels API  
**Développement local** : `http://localhost:3001/api`  
**Production Vercel** : Laissez vide ou mettez `/api` (utilisera automatiquement le même domaine)  
**Note** : Les variables Vite doivent commencer par `VITE_`

## 📝 Fichier server/.env.local Complet

```env
# ============================================
# Configuration Base de Données PostgreSQL
# ============================================
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# ============================================
# Configuration Serveur
# ============================================
PORT=3001
NODE_ENV=production

# URL du frontend
FRONTEND_URL=https://votre-site.vercel.app

# ============================================
# Configuration JWT (Authentification)
# ============================================
JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production
JWT_EXPIRES_IN=7d
```

## 📝 Fichier .env.local (Racine) Complet

```env
# ============================================
# Configuration Frontend (Vite)
# ============================================
VITE_API_URL=http://localhost:3001/api
```

## 🔐 Configuration sur Vercel

Dans Vercel Dashboard → Settings → Environment Variables, ajoutez :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `DATABASE_URL` | `postgresql://...` | ✅ Production, ✅ Preview, ✅ Development |
| `JWT_SECRET` | `votre-secret-fort` | ✅ Production, ✅ Preview, ✅ Development |
| `JWT_EXPIRES_IN` | `7d` | ✅ Production, ✅ Preview, ✅ Development |
| `NODE_ENV` | `production` | ✅ Production |
| `VITE_API_URL` | (vide ou `/api`) | ✅ Production, ✅ Preview, ✅ Development |

## 🛠️ Comment obtenir vos valeurs

### DATABASE_URL depuis Vercel Postgres
1. Allez dans Vercel Dashboard → **Storage** → Votre base de données
2. Cliquez sur **".env.local"**
3. Copiez la ligne `DATABASE_URL=...`

### DATABASE_URL depuis Supabase
1. Allez dans votre projet → **Settings** → **Database**
2. Sous **Connection string**, copiez l'URI
3. Format : `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres`

### DATABASE_URL depuis Neon
1. Allez dans votre dashboard → Votre base de données
2. Cliquez sur **Connection Details**
3. Copiez la **Connection String**

### Générer JWT_SECRET
```bash
# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Sur Mac/Linux
openssl rand -base64 32

# Ou utilisez un générateur en ligne
```

## ✅ Checklist de Configuration

- [ ] `DATABASE_URL` configurée avec votre vraie URL PostgreSQL
- [ ] `JWT_SECRET` généré avec un secret fort (32+ caractères)
- [ ] `JWT_EXPIRES_IN` défini (défaut: `7d`)
- [ ] `NODE_ENV` défini à `production` pour Vercel
- [ ] `FRONTEND_URL` défini à votre URL Vercel (optionnel, peut être auto-détecté)
- [ ] `VITE_API_URL` défini à `/api` ou laissé vide pour Vercel
- [ ] Toutes les variables ajoutées dans Vercel Dashboard avec les 3 environnements cochés

## 🚨 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS vos fichiers `.env.local` dans Git (ils sont déjà dans `.gitignore`)
- Utilisez des secrets différents pour développement et production
- Changez le `JWT_SECRET` par défaut immédiatement
- Ne partagez jamais vos variables d'environnement publiquement

## 📚 Références

- [Documentation Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentation Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [Documentation Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
