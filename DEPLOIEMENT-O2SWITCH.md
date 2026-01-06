# 🚀 Guide Complet de Déploiement Node.js sur O2Switch

Guide étape par étape pour déployer votre application Node.js + PostgreSQL sur O2Switch en utilisant **cPanel Setup Node.js App** avec **CloudLinux Passenger**.

> **⚠️ IMPORTANT** : Ce guide utilise CloudLinux NodeJS Selector qui gère automatiquement les processus Node.js via Passenger. Ne démarrez **PAS** manuellement l'application avec PM2 ou `node server.js` - laissez CloudLinux gérer cela.

---

## 📋 Informations de Connexion

### Base de Données PostgreSQL
- **Serveur**: `127.0.0.1:5432`
- **Base de données**: `cire1827_2nbsite`
- **Utilisateur**: `cire1827_christian`
- **Mot de passe**: `siriusj20023700`
- **URL complète**: `postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public`

### Serveur O2Switch
- **Utilisateur SSH**: `cire1827`
- **IP du serveur**: `109.234.167.45`
- **Domaine**: `2nbdigital.com`
- **Dossier du projet**: `/home/cire1827/site-2nbdigital`
- **Repository Git**: `site-2nbdigital`

---

## 🔧 ÉTAPE 1 : Nettoyage Complet (Repartir à Zéro)

### 1.1 Arrêter Tous les Processus Node.js Existants

**⚠️ CRUCIAL** : Avant de commencer, arrêtez tous les processus Node.js pour éviter les conflits.

```bash
ssh cire1827@109.234.167.45

# Arrêter tous les processus Node.js
pkill -f node

# Arrêter PM2 si actif
pm2 stop all 2>/dev/null
pm2 delete all 2>/dev/null

# Vérifier qu'aucun processus Node.js ne tourne
ps aux | grep node | grep -v grep
```

**Résultat attendu** : Aucun processus Node.js ne doit apparaître.

### 1.2 Supprimer l'Application dans cPanel

1. Connectez-vous à **cPanel**
2. Allez dans **Setup Node.js App**
3. Si une application existe déjà, cliquez sur **"Delete"** ou **"Supprimer"** pour la supprimer complètement

### 1.3 Nettoyer le Projet sur le Serveur

```bash
cd ~/site-2nbdigital

# Supprimer les node_modules (OBLIGATOIRE - CloudLinux les recréera)
rm -rf node_modules
rm -rf server/node_modules

# Supprimer le build précédent (optionnel, sera rebuildé)
rm -rf dist

# Supprimer les logs (optionnel)
rm -rf logs

# Vérifier le nettoyage
ls -la
```

**Note** : Ne supprimez **PAS** le fichier `server/.env` si vous avez déjà configuré les variables d'environnement. Sinon, vous devrez les recréer dans cPanel.

---

## 📦 ÉTAPE 2 : Clonage du Projet (Si Nécessaire)

Si le projet n'existe pas encore sur le serveur :

```bash
ssh cire1827@109.234.167.45
cd ~
git clone https://votre-url-repo/site-2nbdigital.git site-2nbdigital
cd ~/site-2nbdigital
```

**Vérification** :
```bash
ls -la server/server.js
ls -la package.json
ls -la server/package.json
```

Tous ces fichiers doivent exister.

---

## 🚀 ÉTAPE 3 : Création de l'Application dans cPanel

### 3.1 Accéder à Setup Node.js App

1. Connectez-vous à votre **cPanel**
2. Dans la section **Logiciels** ou **Applications**, trouvez **"Setup Node.js App"**
3. Cliquez sur **"Create Application"**

### 3.2 Configuration de l'Application

Remplissez les champs **exactement** comme suit :

- **Node.js Version** : `20.x` (Sélectionnez la version 20.x ou la dernière version stable disponible)

- **Application Root** : `/home/cire1827/site-2nbdigital` (Chemin absolu vers votre projet)

- **Application URL** : `2nbdigital.com` (Sélectionnez dans la liste déroulante - doit être votre domaine principal)

- **Application Startup File** : `server/server.js` (Chemin relatif depuis Application Root vers votre fichier de démarrage)

- **Application Mode** : `Production`

### 3.3 Variables d'Environnement

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
- Générez un `JWT_SECRET` sécurisé avec cette commande (sur le serveur) :
  ```bash
  openssl rand -base64 32
  ```
- Copiez le résultat et remplacez `votre-secret-jwt-tres-securise` dans les variables d'environnement
- **Toutes ces variables sont obligatoires** - si une variable manque, l'application ne démarrera pas

### 3.4 Créer l'Application

Cliquez sur **"Create"** ou **"Créer"**

**⚠️ Si vous obtenez une erreur "node_modules folder/file should not exist"** :
- Retournez sur SSH et supprimez les node_modules :
  ```bash
  cd ~/site-2nbdigital
  rm -rf node_modules
  rm -rf server/node_modules
  ```
- Puis réessayez de créer l'application dans cPanel

### 3.5 Installer les Dépendances

Après la création de l'application :
1. Cliquez sur **"Run NPM Install"** ou **"Installer les dépendances"**
2. Attendez que l'installation se termine (peut prendre quelques minutes)

**Note** : CloudLinux créera automatiquement les symlinks `node_modules` vers l'environnement virtuel.

### 3.6 Démarrer l'Application

1. Cliquez sur **"Start App"** ou **"Restart App"**
2. Attendez quelques secondes
3. Vérifiez que le statut passe à **"Running"**

---

## 📦 ÉTAPE 4 : Configuration Post-Déploiement (via SSH)

Une fois l'application créée et démarrée dans cPanel, effectuez ces étapes via SSH :

### 4.1 Se Connecter au Serveur

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital
```

### 4.2 Générer le Client Prisma

```bash
cd server
npm run db:generate
```

**Vérification** :
```bash
ls -la node_modules/.prisma/client
```

Le dossier doit exister.

### 4.3 Appliquer les Migrations Prisma

```bash
npm run db:migrate:deploy
```

**Note** : Cette commande applique toutes les migrations en attente. Si la base de données est vide, cela créera toutes les tables.

### 4.4 Créer l'Administrateur par Défaut

```bash
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

### 4.5 Build le Frontend

```bash
cd ~/site-2nbdigital
VITE_API_URL=/api npm run build
```

**Vérification** :
```bash
ls -la dist/
ls -la dist/index.html
ls -la dist/assets/
```

Tous ces fichiers doivent exister.

### 4.6 Redémarrer l'Application dans cPanel

1. Retournez dans **cPanel > Setup Node.js App**
2. Cliquez sur **"Restart App"** pour redémarrer l'application avec toutes les configurations

---

## ✅ ÉTAPE 5 : Tests et Vérification

### 5.1 Tester Node.js Directement (via SSH)

```bash
ssh cire1827@109.234.167.45

# Tester que l'application répond
curl http://localhost:3001
curl http://localhost:3001/api/health
```

**Résultat attendu** : 
- `curl http://localhost:3001` doit retourner du HTML
- `curl http://localhost:3001/api/health` doit retourner `{"status":"ok","message":"API is running"}`

### 5.2 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher correctement
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

### 5.3 Vérifier les Logs dans cPanel

Dans **cPanel > Setup Node.js App** :
- Cliquez sur **"View Logs"** pour voir les logs de l'application
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🔄 ÉTAPE 6 : Synchronisation des Modifications (Workflow Quotidien)

Cette étape est à répéter **chaque fois que vous modifiez le code**.

### 6.1 Sur votre Machine Locale

```bash
cd C:\Users\asus\Documents\site-2nbdigital

# Vérifier les modifications
git status

# Ajouter les fichiers modifiés
git add .

# Commiter avec un message descriptif
git commit -m "Description de vos modifications"

# Pousser vers le repository
git push origin main  # ou master, selon votre branche
```

### 6.2 Sur le Serveur O2Switch

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital

# Récupérer les dernières modifications
git pull origin main  # ou master

# Rebuild le frontend
VITE_API_URL=/api npm run build

# Si le schéma Prisma a changé
cd server
npm run db:generate
npm run db:migrate:deploy

# Redémarrer l'application dans cPanel
# Allez dans cPanel > Setup Node.js App > Restart App
```

**⚠️ IMPORTANT** : 
- Ne démarrez **PAS** l'application manuellement avec `node server.js` ou PM2
- Utilisez **uniquement** cPanel pour démarrer/redémarrer l'application
- CloudLinux Passenger gère automatiquement les processus

---

## 🛠️ Commandes Utiles pour la Maintenance

### Redémarrer l'Application

**Via cPanel** (recommandé) :
- Allez dans **Setup Node.js App**
- Cliquez sur **"Restart App"**

**⚠️ Ne pas utiliser** :
- `pm2 restart` (créerait un conflit avec Passenger)
- `node server.js` (créerait un conflit avec Passenger)

### Voir les Logs

**Via cPanel** :
- Allez dans **Setup Node.js App**
- Cliquez sur **"View Logs"**

**Via SSH** :
```bash
cd ~/site-2nbdigital/logs
cat out.log
cat err.log
```

### Appliquer de Nouvelles Migrations

```bash
cd ~/site-2nbdigital/server
npm run db:migrate:deploy
```

Puis redémarrez l'application via cPanel.

---

## 🐛 Dépannage

### Erreur "node_modules folder/file should not exist"

**Cause** : Des dossiers `node_modules` existent dans le projet avant la création de l'application.

**Solution** :
```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital
rm -rf node_modules
rm -rf server/node_modules
```

Puis réessayez de créer l'application dans cPanel.

### Erreur 500 Internal Server Error

**Vérifications** :

1. **Vérifier les logs dans cPanel** :
   - Allez dans **Setup Node.js App > View Logs**
   - Copiez les erreurs

2. **Vérifier que Prisma est généré** :
   ```bash
   cd ~/site-2nbdigital/server
   ls -la node_modules/.prisma/client
   ```
   Si le dossier n'existe pas :
   ```bash
   npm run db:generate
   ```

3. **Vérifier les variables d'environnement dans cPanel** :
   - Toutes les 6 variables doivent être définies
   - `JWT_SECRET` ne doit pas être vide

4. **Redémarrer l'application dans cPanel**

### Gateway Timeout

**Cause** : Conflit entre un processus Node.js existant et Passenger.

**Solution** :

1. **Arrêter tous les processus Node.js** :
   ```bash
   ssh cire1827@109.234.167.45
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

**Vérifications** :

1. **Vérifier que Node.js répond** :
   ```bash
   curl http://localhost:3001
   ```
   Doit retourner du HTML.

2. **Vérifier que dist/ existe** :
   ```bash
   ls -la ~/site-2nbdigital/dist/
   ```
   Doit contenir `index.html` et `assets/`.

3. **Rebuild le frontend si nécessaire** :
   ```bash
   cd ~/site-2nbdigital
   VITE_API_URL=/api npm run build
   ```

4. **Vérifier le statut dans cPanel** :
   - Le statut doit être **"Running"**

### Erreur "Cannot find module '@prisma/client'"

**Solution** :
```bash
cd ~/site-2nbdigital/server
npm run db:generate
```

Puis redémarrez l'application dans cPanel.

### Erreur "Environment variable not found: DATABASE_URL"

**Solution** :
1. Vérifiez dans **cPanel > Setup Node.js App** que toutes les variables d'environnement sont définies
2. Redémarrez l'application après avoir ajouté/modifié les variables

---

## 📝 Checklist de Déploiement Complet

- [ ] Tous les processus Node.js arrêtés (pas de conflit)
- [ ] Ancienne application supprimée dans cPanel (si existante)
- [ ] Dossiers `node_modules` supprimés du projet
- [ ] Projet cloné sur le serveur dans `/home/cire1827/site-2nbdigital`
- [ ] Application créée dans cPanel "Setup Node.js App"
- [ ] Configuration correcte :
  - [ ] Application Root : `/home/cire1827/site-2nbdigital`
  - [ ] Application URL : `2nbdigital.com`
  - [ ] Application Startup File : `server/server.js`
  - [ ] Node.js Version : `20.x`
- [ ] 6 variables d'environnement configurées dans cPanel
- [ ] `JWT_SECRET` généré et configuré
- [ ] Dépendances installées via cPanel ("Run NPM Install")
- [ ] Application démarrée dans cPanel (statut "Running")
- [ ] Prisma généré (`npm run db:generate`)
- [ ] Migrations appliquées (`npm run db:migrate:deploy`)
- [ ] Admin créé (`npm run create-default-admin`)
- [ ] Frontend buildé (`npm run build`)
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

---

## 📞 Support

- **Documentation O2Switch**: https://faq.o2switch.fr
- **Support Node.js O2Switch**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
- **Support PostgreSQL O2Switch**: https://faq.o2switch.fr/cpanel/bases-de-donnees/postgresql/

---

## 🎉 Félicitations !

Votre site est maintenant déployé sur O2Switch et accessible sur **2nbdigital.com** !

Pour toute question ou problème, consultez la section Dépannage ci-dessus.
