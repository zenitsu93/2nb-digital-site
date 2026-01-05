# Guide de déploiement via Git Version Control O2Switch

Ce guide explique comment déployer votre application 2NB Digital via le gestionnaire Git intégré à O2Switch.

## 📋 Prérequis

1. Un compte O2Switch avec accès au cPanel
2. Accès SSH au serveur O2Switch
3. Node.js 20+ installé sur le serveur
4. PM2 installé (optionnel mais recommandé) : `npm install -g pm2`
5. Un dépôt Git (GitHub ou GitLab) avec votre code

## 🔧 Étape 1 : Cloner le dépôt via l'interface O2Switch

1. Connectez-vous à votre cPanel O2Switch
2. Allez dans **"Git™ Version Control"**
3. Cliquez sur **"Create Repository"**
4. Remplissez le formulaire :

   - ✅ **Enable this toggle** : Activez (pour cloner un dépôt)
   - **Clone URL** : `https://github.com/VOTRE-USERNAME/2nb-digital-site.git`
     (ou `https://gitlab.com/VOTRE-USERNAME/2nb-digital-site.git`)
   - **Repository Path** : `2nb-digital-site`
   - **Repository Name** : `2nb-digital-site`
   
5. Cliquez sur **"Créer"**

Le dépôt sera cloné dans `/home/cire1827/2nb-digital-site`

## 🔧 Étape 2 : Installer le script de déploiement

### Option A : Via SSH (recommandé)

1. Connectez-vous en SSH :
   ```bash
   ssh cire1827@109.234.167.45
   ```

2. Aller dans le dossier du projet :
   ```bash
   cd ~/2nb-digital-site
   ```

3. Copier le script de déploiement :
   ```bash
   # Le fichier deploy-hook.sh devrait être dans le dépôt
   # Si ce n'est pas le cas, créez-le :
   nano deploy-hook.sh
   # Collez le contenu du fichier deploy-hook.sh
   ```

4. Rendre le script exécutable :
   ```bash
   chmod +x deploy-hook.sh
   ```

5. Créer le hook Git :
   ```bash
   # Créer le dossier hooks s'il n'existe pas
   mkdir -p .git/hooks
   
   # Créer le hook post-receive
   nano .git/hooks/post-receive
   ```

6. Collez ce contenu dans le hook :
   ```bash
   #!/bin/bash
   cd /home/cire1827/2nb-digital-site
   bash deploy-hook.sh
   ```

7. Rendre le hook exécutable :
   ```bash
   chmod +x .git/hooks/post-receive
   ```

### Option B : Le hook est déjà dans le dépôt

Si le fichier `.git/hooks/post-receive` est déjà dans votre dépôt (ce qui est le cas), il suffit de le rendre exécutable :

```bash
ssh cire1827@109.234.167.45
cd ~/2nb-digital-site
chmod +x .git/hooks/post-receive
chmod +x deploy-hook.sh
```

## 🔧 Étape 3 : Créer le fichier .env

```bash
ssh cire1827@109.234.167.45
cd ~/2nb-digital-site/server
nano .env
```

Collez ce contenu (remplacez `votre-domaine.com` par votre vrai domaine) :

```env
# Base de données PostgreSQL O2Switch
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.com
JWT_SECRET=votre-secret-jwt-tres-securise-production
JWT_EXPIRES_IN=7d
```

**Générez un JWT_SECRET sécurisé :**
```bash
openssl rand -base64 32
```

Remplacez `votre-secret-jwt-tres-securise-production` par la valeur générée.

Sauvegardez : `Ctrl+O`, `Entrée`, `Ctrl+X`

## 🚀 Étape 4 : Premier déploiement manuel

```bash
ssh cire1827@109.234.167.45
cd ~/2nb-digital-site

# Exécuter le script de déploiement
bash deploy-hook.sh
```

**OU** exécutez les commandes manuellement :

```bash
# Installer les dépendances frontend
npm ci

# Build du frontend
npm run build

# Installer les dépendances backend
cd server
npm ci --production

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate:deploy

# Créer l'admin par défaut
npm run create-default-admin

# Démarrer avec PM2
cd ..
pm2 start ecosystem.config.js
```

## 🔄 Étape 5 : Déploiements futurs

### Méthode 1 : Via l'interface O2Switch

1. Allez dans **"Git™ Version Control"**
2. Trouvez votre dépôt `2nb-digital-site`
3. Cliquez sur **"Pull"** ou **"Update"** (si disponible)
4. Le hook `post-receive` s'exécutera automatiquement

### Méthode 2 : Via SSH

```bash
ssh cire1827@109.234.167.45
cd ~/2nb-digital-site
git pull origin main
# Le hook post-receive s'exécutera automatiquement
```

### Méthode 3 : Depuis votre machine locale

Après avoir poussé sur GitHub/GitLab :

```bash
# Sur votre machine locale
git push origin main

# Puis sur le serveur (via SSH)
ssh cire1827@109.234.167.45
cd ~/2nb-digital-site
git pull origin main
# Le hook s'exécutera automatiquement
```

## 📝 Structure des fichiers

```
/home/cire1827/2nb-digital-site/
├── deploy-hook.sh          # Script de déploiement principal
├── .git/
│   └── hooks/
│       └── post-receive   # Hook Git (exécuté automatiquement)
├── server/
│   ├── .env               # Variables d'environnement (à créer)
│   └── ...
└── ...
```

## 🐛 Dépannage

### Le hook ne s'exécute pas

Vérifiez les permissions :
```bash
chmod +x .git/hooks/post-receive
chmod +x deploy-hook.sh
```

### Erreur "Permission denied"

Vérifiez que vous êtes dans le bon dossier et que les permissions sont correctes :
```bash
ls -la .git/hooks/post-receive
ls -la deploy-hook.sh
```

### Le script échoue à une étape

Exécutez le script manuellement pour voir les erreurs :
```bash
bash deploy-hook.sh
```

### PM2 n'est pas installé

Installez PM2 :
```bash
npm install -g pm2
```

Puis redémarrez l'application :
```bash
cd ~/2nb-digital-site
pm2 start ecosystem.config.js
```

## ✅ Vérification

Après le déploiement, vérifiez :

1. **L'application tourne :**
   ```bash
   pm2 list
   ```

2. **Les logs :**
   ```bash
   pm2 logs 2nb-digital-api
   ```

3. **L'API répond :**
   ```bash
   curl http://localhost:3001/api/health
   ```

4. **Le frontend est accessible :**
   Ouvrez votre navigateur : `https://votre-domaine.com`

## 📝 Notes importantes

- Le fichier `.env` ne doit **JAMAIS** être commité dans Git
- Le script `deploy-hook.sh` peut être commité (il ne contient pas de secrets)
- Le hook `post-receive` est dans `.git/hooks/` et ne sera pas commité automatiquement
- Assurez-vous que `node_modules/` et `dist/` sont dans `.gitignore`

## 🔗 Ressources

- [Documentation O2Switch](https://www.o2switch.fr/support/)
- [Documentation Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Documentation PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
