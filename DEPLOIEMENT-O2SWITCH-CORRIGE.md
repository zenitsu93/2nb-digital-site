# 🚀 Guide de Déploiement O2Switch - VERSION CORRIGÉE

**Guide étape par étape pour déployer votre application Node.js + React sur O2Switch**

> ⚠️ **IMPORTANT** : Ce guide corrige les erreurs communes et suit les bonnes pratiques O2Switch.

---

## 📋 Informations de Connexion

- **Utilisateur SSH**: `cire1827`
- **IP du serveur**: `109.234.167.45`
- **Domaine**: `2nbdigital.com`
- **Dossier du projet**: `/home/cire1827/site-2nbdigital`
- **Base de données**: `cire1827_2nbsite` (PostgreSQL)
- **Utilisateur DB**: `cire1827_christian`
- **Mot de passe DB**: `siriusj20023700`

---

## 🔧 ÉTAPE 1 : Nettoyage Complet (OBLIGATOIRE)

### 1.1 Arrêter Tous les Processus Node.js

```bash
ssh cire1827@109.234.167.45

# Arrêter tous les processus Node.js
pkill -f node 2>/dev/null
pm2 stop all 2>/dev/null
pm2 delete all 2>/dev/null

# Vérifier qu'aucun processus ne tourne
ps aux | grep node | grep -v grep
```

**Résultat attendu** : Aucun processus ne doit apparaître.

### 1.2 Supprimer l'Application dans cPanel

1. Connectez-vous à **cPanel**
2. Allez dans **Setup Node.js App**
3. Si une application existe, cliquez sur **"Delete"** pour la supprimer complètement

### 1.3 Nettoyer le Projet

```bash
cd ~/site-2nbdigital

# Supprimer les node_modules (OBLIGATOIRE)
rm -rf node_modules
rm -rf server/node_modules

# Supprimer le build précédent
rm -rf dist

# Vérifier
ls -la
```

---

## 📦 ÉTAPE 2 : Vérifier le Projet (Si Déjà Cloné)

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital

# Vérifier que tous les fichiers existent
ls -la app.js
ls -la server/server.js
ls -la package.json
ls -la server/package.json
```

Tous ces fichiers doivent exister.

---

## 🚀 ÉTAPE 3 : Créer l'Application dans cPanel

### 3.1 Configuration de l'Application

1. Connectez-vous à **cPanel**
2. Allez dans **Setup Node.js App**
3. Cliquez sur **"Create Application"**
4. Remplissez **exactement** comme suit :

   - **Node.js Version** : `20.x` (ou la dernière version stable)
   - **Application Root** : `/home/cire1827/site-2nbdigital`
   - **Application URL** : `2nbdigital.com` (sélectionnez dans la liste)
   - **Application Startup File** : `app.js`
   - **Application Mode** : `Production`

### 3.2 Variables d'Environnement (CRUCIAL)

Dans la section **Environment Variables**, ajoutez **TOUTES** ces variables (une par ligne) :

```
DATABASE_URL=postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://2nbdigital.com
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT** : 
- Générez un `JWT_SECRET` sécurisé avec :
  ```bash
  openssl rand -base64 32
  ```
- Remplacez `votre-secret-jwt-tres-securise` par le résultat
- **Toutes ces variables sont obligatoires**

### 3.3 Créer l'Application

Cliquez sur **"Create"**

**Si erreur "node_modules folder/file should not exist"** :
- Retournez sur SSH et supprimez les node_modules :
  ```bash
  cd ~/site-2nbdigital
  rm -rf node_modules server/node_modules
  ```
- Réessayez dans cPanel

---

## 📦 ÉTAPE 4 : Installer les Dépendances

### 4.1 Installer les Dépendances Racine (via cPanel)

1. Dans **cPanel > Setup Node.js App**
2. Cliquez sur **"Run NPM Install"** (installe les dépendances à la racine)

### 4.2 Installer les Dépendances Backend (via SSH)

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital/server

# Activer l'environnement Node.js (OBLIGATOIRE)
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Installer les dépendances backend
npm install
```

**Note** : CloudLinux créera automatiquement les symlinks `node_modules` vers l'environnement virtuel.

---

## 🔧 ÉTAPE 5 : Configuration Post-Installation

### 5.1 Générer le Client Prisma

```bash
# Toujours dans server/ et avec l'environnement activé
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

npm run db:generate
```

**Vérification** :
```bash
ls -la node_modules/.prisma/client
```
Le dossier doit exister.

### 5.2 Appliquer les Migrations Prisma

```bash
npm run db:migrate:deploy
```

### 5.3 Créer l'Administrateur par Défaut

```bash
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

### 5.4 Build le Frontend

```bash
cd ~/site-2nbdigital

# Activer l'environnement Node.js
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Build le frontend avec la bonne URL API
VITE_API_URL=/api npm run build
```

**⚠️ IMPORTANT** : 
- `VITE_API_URL=/api` est une URL relative qui fonctionnera avec votre domaine
- Ne mettez PAS `http://localhost:3001/api` ou `https://2nbdigital.com/api`
- Juste `/api` suffit (URL relative)

**Vérification** :
```bash
ls -la dist/
ls -la dist/index.html
ls -la dist/assets/
```

Tous ces fichiers doivent exister.

---

## 🚀 ÉTAPE 6 : Démarrer l'Application

1. Retournez dans **cPanel > Setup Node.js App**
2. Cliquez sur **"Start App"** ou **"Restart App"**
3. Attendez quelques secondes
4. Vérifiez que le statut passe à **"Running"**

---

## ✅ ÉTAPE 7 : Tests et Vérification

### 7.1 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher correctement
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

### 7.2 Vérifier les Logs

Dans **cPanel > Setup Node.js App** :
- Cliquez sur **"View Logs"** pour voir les logs
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🔄 ÉTAPE 8 : Mise à Jour du Code (Workflow Quotidien)

### 8.1 Sur votre Machine Locale

```bash
cd C:\Users\asus\Documents\2nb-digital-site

git add .
git commit -m "Description des modifications"
git push origin main
```

### 8.2 Sur le Serveur O2Switch

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital

# Récupérer les modifications
git pull origin main

# Activer l'environnement Node.js
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Rebuild le frontend
VITE_API_URL=/api npm run build

# Si le schéma Prisma a changé
cd server
npm run db:generate
npm run db:migrate:deploy

# Redémarrer l'application dans cPanel
# Allez dans cPanel > Setup Node.js App > Restart App
```

---

## 🐛 Dépannage

### Erreur "We're sorry, but something went wrong" (Passenger)

**Solutions** :

1. **Vérifier les logs** :
   - Dans cPanel > Setup Node.js App > View Logs
   - Cherchez les erreurs

2. **Vérifier que Prisma est généré** :
   ```bash
   cd ~/site-2nbdigital/server
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   ls -la node_modules/.prisma/client
   ```
   Si le dossier n'existe pas :
   ```bash
   npm run db:generate
   ```

3. **Vérifier que les dépendances backend sont installées** :
   ```bash
   cd ~/site-2nbdigital/server
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   ls -la node_modules/express
   ls -la node_modules/@prisma/client
   ```
   Si elles n'existent pas :
   ```bash
   npm install
   ```

4. **Vérifier que le frontend est buildé** :
   ```bash
   ls -la ~/site-2nbdigital/dist/index.html
   ```
   Si le fichier n'existe pas :
   ```bash
   cd ~/site-2nbdigital
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   VITE_API_URL=/api npm run build
   ```

5. **Redémarrer l'application dans cPanel**

### Erreur "node_modules folder/file should not exist"

```bash
cd ~/site-2nbdigital
rm -rf node_modules server/node_modules
```

Puis réessayez de créer l'application dans cPanel.

### Gateway Timeout

1. **Arrêter tous les processus Node.js** :
   ```bash
   pkill -f node
   pm2 stop all 2>/dev/null
   pm2 delete all 2>/dev/null
   ```

2. **Vérifier qu'aucun processus ne tourne** :
   ```bash
   ps aux | grep node | grep -v grep
   ```

3. **Redémarrer l'application dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Cliquez sur **"Stop App"**
   - Attendez quelques secondes
   - Cliquez sur **"Start App"**

### Le Site ne s'Affiche pas (Page Blanche)

1. **Vérifier que dist/ existe** :
   ```bash
   ls -la ~/site-2nbdigital/dist/
   ```
   Doit contenir `index.html` et `assets/`.

2. **Rebuild le frontend si nécessaire** :
   ```bash
   cd ~/site-2nbdigital
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   VITE_API_URL=/api npm run build
   ```

3. **Vérifier le statut dans cPanel** :
   - Le statut doit être **"Running"**

### Erreur "Cannot find module '@prisma/client'"

```bash
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
npm install
npm run db:generate
```

Puis redémarrez l'application dans cPanel.

---

## 📝 Checklist de Déploiement

- [ ] Tous les processus Node.js arrêtés
- [ ] Ancienne application supprimée dans cPanel
- [ ] Dossiers `node_modules` supprimés
- [ ] Projet cloné sur le serveur dans `/home/cire1827/site-2nbdigital`
- [ ] Fichier `app.js` existe à la racine
- [ ] Application créée dans cPanel "Setup Node.js App"
- [ ] Configuration correcte :
  - [ ] Application Root : `/home/cire1827/site-2nbdigital`
  - [ ] Application URL : `2nbdigital.com`
  - [ ] Application Startup File : `app.js`
  - [ ] Node.js Version : `20.x`
- [ ] 6 variables d'environnement configurées dans cPanel
- [ ] `JWT_SECRET` généré et configuré
- [ ] Dépendances installées via cPanel ("Run NPM Install") - racine
- [ ] Dépendances backend installées via SSH dans `server/` avec environnement activé
- [ ] Application démarrée dans cPanel (statut "Running")
- [ ] Prisma généré (`npm run db:generate` avec environnement activé)
- [ ] Migrations appliquées (`npm run db:migrate:deploy`)
- [ ] Admin créé (`npm run create-default-admin`)
- [ ] Frontend buildé (`VITE_API_URL=/api npm run build` avec environnement activé)
- [ ] Application redémarrée dans cPanel
- [ ] Site accessible sur `https://2nbdigital.com`
- [ ] API accessible sur `https://2nbdigital.com/api/health`
- [ ] Admin accessible sur `https://2nbdigital.com/admin/login`

---

## ⚠️ Règles Importantes

1. **Ne jamais démarrer l'application manuellement** avec `node server.js` ou PM2
2. **Utiliser uniquement cPanel** pour démarrer/redémarrer l'application
3. **CloudLinux Passenger** gère automatiquement les processus Node.js
4. **Toujours supprimer les node_modules** avant de créer/modifier l'application dans cPanel
5. **Vérifier qu'aucun processus Node.js ne tourne** avant de créer l'application
6. **Toujours activer l'environnement Node.js** avant d'exécuter npm/npx :
   ```bash
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   ```
7. **Installer les dépendances backend séparément** dans `server/` après avoir créé l'application dans cPanel
8. **Utiliser `VITE_API_URL=/api`** (URL relative) lors du build du frontend

---

## 🎉 Félicitations !

Votre site est maintenant déployé sur O2Switch et accessible sur **2nbdigital.com** !

---

## 📞 Support

- **Documentation O2Switch Node.js**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
- **Guide O2Switch React/Node.js**: https://faq.o2switch.fr/guides/nodejs/application-reactjs/
- **Documentation cPanel Node.js**: https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/
