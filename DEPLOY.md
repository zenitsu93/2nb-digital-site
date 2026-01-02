# Guide de déploiement sur O2Switch

Ce guide vous explique comment déployer votre application 2NB Digital sur O2Switch.

## 📋 Prérequis

- Un compte O2Switch avec accès Node.js
- PostgreSQL activé sur votre hébergement O2Switch
- Accès SSH ou FTP à votre serveur
- Git installé localement

## 🏗️ Architecture de déploiement

Sur O2Switch, vous avez deux options principales :

### Option 1 : Déploiement séparé (recommandé)
- **Frontend** : Build statique servi par Apache/Nginx
- **Backend** : Node.js/Express tournant sur un port spécifique

### Option 2 : Déploiement unifié
- **Backend** : Node.js/Express qui sert également les fichiers statiques du frontend

Ce guide utilise l'**Option 2** (unifié) pour simplifier la configuration.

## 📦 Étapes de déploiement

### 1. Préparer le projet localement

#### 1.1 Build du frontend

```bash
# À la racine du projet
npm run build
```

Cela génère un dossier `dist` avec les fichiers statiques compilés.

#### 1.2 Vérifier les fichiers

Assurez-vous que le dossier `dist` a été créé avec les fichiers compilés.

### 2. Configuration sur O2Switch

#### 2.1 Choisir votre méthode de déploiement

**Option A : Via Git (recommandé pour les mises à jour faciles)**

Dans le panneau d'administration O2Switch :

1. Accédez à **Git** ou **Déploiement**
2. Connectez votre dépôt GitHub
3. Sélectionnez la branche à déployer (généralement `main` ou `master`)
4. Configurez le chemin de déploiement (ex: `/home/username/www/`)

**Option B : Via FTP (sans Git)**

Pas besoin de configurer Git. Procédez directement à l'étape 4 (Installation et configuration sur le serveur).

#### 2.2 Configuration Node.js

Dans le panneau O2Switch :

1. Activez **Node.js** pour votre domaine
2. Configurez le **fichier de démarrage** : `server/server.js`
3. Définissez la **version Node.js** (v18 ou supérieur recommandé)

### 3. Configuration de la base de données

#### 3.1 Créer la base de données PostgreSQL

Dans le panneau O2Switch :

1. Créez une base de données PostgreSQL
2. Notez les informations de connexion :
   - Host
   - Port
   - Nom de la base de données
   - Utilisateur
   - Mot de passe

#### 3.2 Variables d'environnement

Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
# Base de données PostgreSQL O2Switch
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/nom_base_donnees?schema=public"

# Port (O2Switch fournit généralement un port spécifique)
PORT=3000

# Environnement
NODE_ENV=production

# URL du frontend (votre domaine)
FRONTEND_URL=https://votre-domaine.com

# Secret JWT (générez un secret sécurisé)
JWT_SECRET=votre-secret-jwt-tres-long-et-securise-changez-moi
JWT_EXPIRES_IN=7d
```

**⚠️ Important** : Ne commitez jamais le fichier `.env` dans Git ! Il doit être créé directement sur le serveur.

**Note pour le frontend** : Le code utilise automatiquement des URLs relatives (`/api`) en production si `VITE_API_URL` n'est pas défini. Si vous souhaitez utiliser une URL API différente, créez un fichier `.env` à la racine du projet avec :
```env
VITE_API_URL=https://votre-domaine.com/api
```

### 4. Installation et configuration sur le serveur

#### 4.1 Via SSH (recommandé)

Connectez-vous en SSH à votre serveur O2Switch :

```bash
ssh votre-utilisateur@votre-serveur-o2switch.com
```

Une fois connecté :

```bash
# Naviguer vers le répertoire de votre site
cd /home/username/www/

# Cloner le projet depuis GitHub (si pas déjà fait)
git clone https://github.com/votre-username/votre-repo.git
cd votre-repo

# Installer les dépendances frontend
npm install

# Build du frontend
npm run build

# Installer les dépendances backend
cd server
npm install --production

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Créer l'administrateur par défaut (optionnel)
npm run create-default-admin
```

#### 4.2 Via FTP (sans Git)

Si vous préférez ne pas utiliser Git, vous pouvez déployer directement via FTP :

**Option A : Déploiement complet via FTP**

1. **Build du frontend localement** :
   ```bash
   npm run build
   ```
   Cela crée le dossier `dist` avec les fichiers compilés.

2. **Via un client FTP** (FileZilla, WinSCP, etc.) :
   - Connectez-vous à votre serveur O2Switch
   - Téléversez **tous les fichiers** du projet, y compris :
     - Le dossier `dist` (frontend buildé)
     - Le dossier `server/` (backend complet)
     - Le dossier `node_modules/` du serveur (ou installez-les sur le serveur via SSH)
     - Les fichiers de configuration (`package.json`, `tsconfig.json`, etc.)

3. **Important** :
   - Créez le fichier `server/.env` directement sur le serveur avec vos variables d'environnement
   - Si vous n'avez pas SSH, vous devrez téléverser aussi le dossier `server/node_modules/` (peut être volumineux)
   - Alternative : Utilisez SSH une seule fois pour installer les dépendances : `cd server && npm install --production`

**Option B : Déploiement hybride (recommandé si pas de Git)**

1. Build du frontend localement : `npm run build`
2. Téléversez via FTP uniquement :
   - Le dossier `dist/`
   - Le dossier `server/` (sans node_modules)
   - Les fichiers de configuration
3. Connectez-vous en SSH une seule fois pour :
   ```bash
   cd server
   npm install --production
   npm run db:generate
   npm run db:migrate
   ```

**Note** : L'installation des dépendances npm nécessite généralement SSH, mais vous pouvez aussi téléverser le dossier `node_modules/` si vous l'avez installé localement.

### 5. Configuration du serveur backend

Le fichier `server/server.js` doit servir les fichiers statiques du frontend en production.

Assurez-vous que le serveur est configuré pour servir le dossier `dist` (voir la section Configuration du code).

### 6. Configuration O2Switch pour Node.js

Dans le panneau d'administration O2Switch :

1. **Chemin de l'application** : `/home/username/www/server/`
2. **Fichier de démarrage** : `server.js`
3. **Port** : Utilisez la variable d'environnement `PORT` (O2Switch fournit généralement un port)
4. **Mode** : `production`

### 7. Configuration du domaine

#### 7.1 Domaine principal

Configurez votre domaine pour pointer vers l'application Node.js.

#### 7.2 Configuration Apache/Nginx (si nécessaire)

Si O2Switch utilise Apache, vous pouvez créer un fichier `.htaccess` à la racine pour rediriger vers Node.js. Cependant, O2Switch gère généralement cela automatiquement pour les applications Node.js.

### 8. Redémarrage de l'application

Après avoir configuré les variables d'environnement :

1. Dans le panneau O2Switch, **redémarrez** l'application Node.js
2. Vérifiez les logs pour détecter d'éventuelles erreurs

### 9. Vérification

1. Accédez à votre site : `https://votre-domaine.com`
2. Vérifiez que le frontend se charge correctement
3. Testez l'API : `https://votre-domaine.com/api/health`
4. Testez la connexion admin : `https://votre-domaine.com/admin/login`

## 🔧 Configuration du code pour la production

Le serveur backend doit être configuré pour servir les fichiers statiques du frontend en production. Cette configuration est déjà incluse dans `server/server.js`.

## 📝 Mise à jour du code

Pour mettre à jour votre application après déploiement :

```bash
# Via SSH
cd /home/username/www/votre-repo
git pull origin main
npm run build
cd server
npm install --production
npm run db:migrate
# Redémarrer l'application depuis le panneau O2Switch
```

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifiez les logs dans le panneau O2Switch
2. Vérifiez que toutes les variables d'environnement sont correctement définies
3. Vérifiez la connexion à la base de données
4. Vérifiez que le port est correctement configuré

### Erreur de connexion à la base de données

1. Vérifiez les informations de connexion dans `.env`
2. Vérifiez que PostgreSQL est activé sur votre compte O2Switch
3. Vérifiez que la base de données a été créée

### Les fichiers statiques ne se chargent pas

1. Vérifiez que le build du frontend a été effectué (`npm run build`)
2. Vérifiez que le dossier `dist` existe dans le projet
3. Vérifiez les permissions des fichiers

### CORS errors

1. Vérifiez que `FRONTEND_URL` dans `.env` correspond à votre domaine en production
2. Assurez-vous que l'URL n'a pas de slash final

## 📚 Ressources

- [Documentation O2Switch Node.js](https://www.o2switch.fr/hebergement-web/nodejs.php)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Vite](https://vitejs.dev/)

## 🔒 Sécurité en production

- ✅ Utilisez HTTPS (généralement activé par défaut sur O2Switch)
- ✅ Utilisez un JWT_SECRET fort et unique
- ✅ Ne commitez jamais le fichier `.env`
- ✅ Mettez à jour régulièrement les dépendances
- ✅ Configurez des backups réguliers de la base de données
