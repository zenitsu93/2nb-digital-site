# 🚀 Guide de Déploiement sur O2Switch avec cPanel

Guide étape par étape pour déployer votre site Node.js + PostgreSQL sur O2Switch en utilisant l'outil **Setup Node.js App** de cPanel.

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

## 🔧 ÉTAPE 1 : Clonage du Projet sur le Serveur

### 1.1 Connexion SSH

```bash
ssh cire1827@109.234.167.45
```

### 1.2 Cloner le Projet

```bash
# Aller dans le dossier home
cd ~

# Cloner le projet (remplacez par l'URL de votre repository)
git clone https://votre-url-repo/site-2nbdigital.git site-2nbdigital

# Aller dans le dossier du projet
cd ~/site-2nbdigital
```

---

## 📦 ÉTAPE 2 : Installation des Dépendances et Build

### 2.1 Installer les Dépendances Frontend

```bash
cd ~/site-2nbdigital
npm install
```

### 2.2 Build du Frontend

```bash
# Build avec l'URL de production
VITE_API_URL=/api npm run build
```

### 2.3 Installer les Dépendances Backend

```bash
cd ~/site-2nbdigital/server
npm install --production
```

### 2.4 Générer le Client Prisma

```bash
npm run db:generate
```

---

## 🗄️ ÉTAPE 3 : Configuration de la Base de Données

### 3.1 Créer le Fichier .env

```bash
cd ~/site-2nbdigital/server

# Créer le fichier .env
nano .env
```

Collez ce contenu :

```env
# Base de données PostgreSQL O2Switch
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"

# Configuration serveur
PORT=3001
NODE_ENV=production

# URL du frontend en production
FRONTEND_URL=https://2nbdigital.com

# JWT Secret (générer un secret fort)
JWT_SECRET=votre-secret-jwt-tres-securise-changez-moi
JWT_EXPIRES_IN=7d
```

**Important**: Générez un JWT_SECRET sécurisé :
```bash
openssl rand -base64 32
```
Copiez le résultat et remplacez `votre-secret-jwt-tres-securise-changez-moi` dans le fichier .env.

Sauvegarder : `Ctrl+O`, `Entrée`, `Ctrl+X`

### 3.2 Vérifier la Connexion à la Base de Données

```bash
# Tester la connexion PostgreSQL
psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite

# Si ça fonctionne, vous verrez le prompt PostgreSQL
# Tapez \q pour quitter
```

### 3.3 Appliquer les Migrations Prisma

```bash
cd ~/site-2nbdigital/server

# Appliquer toutes les migrations
npm run db:migrate:deploy
```

### 3.4 Créer l'Administrateur par Défaut

```bash
cd ~/site-2nbdigital/server
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

---

## 🚀 ÉTAPE 4 : Configuration via cPanel "Setup Node.js App"

### 4.1 Accéder à l'Outil

1. Connectez-vous à votre **cPanel**
2. Dans la section **Logiciels** ou **Applications**, trouvez **"Setup Node.js App"**
3. Cliquez sur **"Create Application"**

### 4.2 Configuration de l'Application

Remplissez les champs suivants :

- **Node.js Version** : Sélectionnez la version (recommandé : **20.x** ou la dernière version stable)

- **Application Root** : 
  ```
  /home/cire1827/site-2nbdigital
  ```

- **Application URL** : 
  ```
  2nbdigital.com
  ```
  (ou sélectionnez dans la liste déroulante)

- **Application Startup File** : 
  ```
  server/server.js
  ```

- **Application Mode** : `Production`

### 4.3 Variables d'Environnement

Dans la section **Environment Variables**, ajoutez les variables suivantes :

```
DATABASE_URL=postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://2nbdigital.com
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
```

**Note** : Remplacez `votre-secret-jwt-tres-securise` par le secret que vous avez généré à l'étape 3.1.

### 4.4 Créer l'Application

Cliquez sur **"Create"** ou **"Créer"**

### 4.5 Démarrer l'Application

Une fois l'application créée, cliquez sur le bouton **"Run NPM Install"** ou **"Installer les dépendances"** si disponible, puis sur **"Restart App"** ou **"Redémarrer l'application"**.

---

## ✅ ÉTAPE 5 : Tests et Vérification

### 5.1 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

### 5.2 Vérifier les Logs dans cPanel

Dans l'outil "Setup Node.js App", vous pouvez :
- Voir les **logs de l'application**
- Voir le **statut** (Running/Stopped)
- **Redémarrer** l'application
- **Arrêter/Démarrer** l'application

---

## 🔄 ÉTAPE 6 : Synchronisation des Modifications (Workflow Quotidien)

Cette étape est à répéter **chaque fois que vous modifiez le code** et que vous voulez déployer les changements.

### 6.1 Sur votre Machine Locale

```bash
# 1. Aller dans le dossier du projet
cd C:\Users\asus\Documents\site-2nbdigital

# 2. Vérifier les modifications
git status

# 3. Ajouter les fichiers modifiés
git add .

# 4. Commiter avec un message descriptif
git commit -m "Description de vos modifications"

# 5. Pousser vers le repository distant
git push origin main  # ou master, selon votre branche
```

### 6.2 Sur le Serveur O2Switch

```bash
# 1. Se connecter au serveur
ssh cire1827@109.234.167.45

# 2. Aller dans le dossier du projet
cd ~/site-2nbdigital

# 3. Récupérer les dernières modifications
git pull origin main  # ou master

# 4. Installer/Mettre à jour les dépendances frontend si nécessaire
npm install

# 5. Rebuild le frontend avec les nouvelles modifications
npm run build

# 6. Si des dépendances backend ont changé
cd server
npm install --production

# 7. Régénérer le client Prisma si le schéma a changé
npm run db:generate

# 8. Appliquer les migrations si nécessaire (si vous avez modifié le schéma)
npm run db:migrate:deploy

# 9. Redémarrer l'application via cPanel
# Allez dans cPanel > Setup Node.js App > Cliquez sur "Restart App"
```

**OU** redémarrer via SSH si l'outil cPanel le permet :

```bash
# Vérifier si l'outil cPanel expose des commandes
# Sinon, utilisez l'interface cPanel pour redémarrer
```

### 6.3 Vérification Rapide

1. Vérifiez dans cPanel que l'application est en cours d'exécution
2. Testez votre site dans le navigateur
3. Vérifiez les logs dans cPanel si nécessaire

---

## 🛠️ Commandes Utiles pour la Maintenance

### Redémarrer l'Application

Via **cPanel** :
- Allez dans **Setup Node.js App**
- Cliquez sur **"Restart App"** pour votre application

### Voir les Logs

Via **cPanel** :
- Allez dans **Setup Node.js App**
- Cliquez sur **"View Logs"** ou **"Voir les logs"** pour votre application

### Appliquer de Nouvelles Migrations

```bash
cd ~/site-2nbdigital/server
npm run db:migrate:deploy
```

Puis redémarrez l'application via cPanel.

---

## 🐛 Dépannage

### L'Application ne Démarre pas

1. **Vérifier les logs dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Cliquez sur **"View Logs"** pour voir les erreurs

2. **Vérifier le fichier .env** :
   ```bash
   cat ~/site-2nbdigital/server/.env
   ```

3. **Vérifier que le fichier server.js existe** :
   ```bash
   ls -la ~/site-2nbdigital/server/server.js
   ```

### Le Frontend ne s'Affiche pas

1. **Vérifier que le dossier dist/ existe** :
   ```bash
   ls -la ~/site-2nbdigital/dist/
   ```

2. **Rebuild le frontend** :
   ```bash
   cd ~/site-2nbdigital
   VITE_API_URL=/api npm run build
   ```

3. **Redémarrer l'application via cPanel**

### Erreur de Connexion à la Base de Données

1. **Vérifier les identifiants dans .env** :
   ```bash
   cat ~/site-2nbdigital/server/.env
   ```

2. **Tester la connexion PostgreSQL** :
   ```bash
   psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
   ```

3. **Vérifier les variables d'environnement dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que toutes les variables d'environnement sont correctement définies

### Erreur "Environment variable not found: DATABASE_URL"

1. **Vérifier que le fichier .env existe** :
   ```bash
   ls -la ~/site-2nbdigital/server/.env
   ```

2. **Vérifier les variables d'environnement dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que `DATABASE_URL` est bien définie dans les variables d'environnement

3. **Si vous utilisez le fichier .env**, assurez-vous que l'application peut y accéder. Sinon, utilisez les variables d'environnement définies dans cPanel.

### Erreur "Cannot find module"

1. **Réinstaller les dépendances** :
   ```bash
   cd ~/site-2nbdigital/server
   rm -rf node_modules
   npm install --production
   npm run db:generate
   ```

2. **Redémarrer l'application via cPanel**

---

## 📝 Checklist de Déploiement Initial

- [ ] Repository Git configuré et accessible
- [ ] Projet cloné dans `/home/cire1827/site-2nbdigital` sur le serveur O2Switch
- [ ] Dépendances frontend installées
- [ ] Frontend buildé (`dist/` existe)
- [ ] Dépendances backend installées
- [ ] Fichier `.env` créé avec les bonnes informations
- [ ] Client Prisma généré
- [ ] Migrations appliquées
- [ ] Admin par défaut créé
- [ ] Application créée dans cPanel "Setup Node.js App"
- [ ] Variables d'environnement configurées dans cPanel
- [ ] Application démarrée et fonctionnelle
- [ ] Site accessible sur `https://2nbdigital.com`
- [ ] API accessible sur `https://2nbdigital.com/api/health`
- [ ] Admin accessible sur `https://2nbdigital.com/admin/login`

## 🔄 Checklist de Synchronisation (À répéter à chaque modification)

- [ ] Modifications committées localement
- [ ] Modifications poussées vers le repository Git
- [ ] `git pull` effectué sur le serveur
- [ ] Dépendances mises à jour si nécessaire
- [ ] Frontend rebuildé (`npm run build`)
- [ ] Client Prisma régénéré si le schéma a changé
- [ ] Migrations appliquées si nécessaire
- [ ] Application redémarrée via cPanel
- [ ] Vérification du site et tests fonctionnels

---

## 🎉 Félicitations !

Votre site est maintenant déployé sur O2Switch et accessible sur **2nbdigital.com** !

Pour toute question ou problème, consultez la section Dépannage ci-dessus ou contactez le support O2Switch.

---

## 📞 Support

- **Documentation O2Switch**: https://faq.o2switch.fr
- **Support Node.js O2Switch**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
- **Support PostgreSQL O2Switch**: https://faq.o2switch.fr/cpanel/bases-de-donnees/postgresql/
