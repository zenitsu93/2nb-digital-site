# Guide de déploiement sur O2Switch

Ce guide vous explique comment déployer votre application 2NB Digital sur O2Switch avec CI/CD.

## 📋 Prérequis

1. Un compte O2Switch avec accès SSH
2. Une base de données PostgreSQL créée sur O2Switch
3. Un dépôt Git (GitLab ou GitHub)
4. Node.js 20+ installé sur le serveur O2Switch
5. PM2 installé (optionnel mais recommandé) : `npm install -g pm2`

## 🔧 Configuration initiale sur O2Switch

### 1. Base de données PostgreSQL

La base de données PostgreSQL est déjà configurée sur O2Switch avec les informations suivantes :

- **Serveur** : `127.0.0.1:5432` (local sur le serveur O2Switch)
- **Base de données** : `cire1827_2nbsite`
- **Utilisateur** : `cire1827_christian`
- **Mot de passe** : `siriusj20023700`
- **Profil** : `cire1827`

### 2. Préparer le serveur

Connectez-vous en SSH à votre serveur O2Switch :

```bash
ssh votre_utilisateur@ssh.o2switch.net
```

Créez le dossier de déploiement :

```bash
mkdir -p ~/2nb-digital-site/server/public/uploads
mkdir -p ~/2nb-digital-site/logs
```

### 3. Configurer les variables d'environnement

Créez le fichier `.env` dans le dossier `server` :

```bash
cd ~/2nb-digital-site/server
nano .env
```

Ajoutez les variables suivantes (utilisez `server/env.production.example` comme référence) :

```env
# Base de données PostgreSQL O2Switch (déjà configurée)
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.com
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
```

**Important** : Générez un JWT_SECRET sécurisé avec :
```bash
openssl rand -base64 32
```

## 🚀 Déploiement avec GitLab CI/CD

### 1. Configurer les variables dans GitLab

Allez dans votre projet GitLab → **Settings** → **CI/CD** → **Variables** et ajoutez :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SSH_PRIVATE_KEY` | Votre clé SSH privée | Contenu de `~/.ssh/id_rsa` |
| `O2SWITCH_USER` | Nom d'utilisateur O2Switch | `votre_user` |
| `O2SWITCH_HOST` | Serveur SSH O2Switch | `ssh.o2switch.net` |
| `O2SWITCH_DEPLOY_PATH` | Chemin de déploiement | `/home/votre_user/2nb-digital-site` |
| `O2SWITCH_URL` | URL de production | `https://votre-domaine.com` |

### 2. Générer une clé SSH pour le déploiement

Sur votre machine locale :

```bash
ssh-keygen -t rsa -b 4096 -C "gitlab-ci@2nb-digital" -f ~/.ssh/gitlab_deploy
```

Ajoutez la clé publique au serveur O2Switch :

```bash
ssh-copy-id -i ~/.ssh/gitlab_deploy.pub votre_user@ssh.o2switch.net
```

Copiez le contenu de la clé privée dans la variable `SSH_PRIVATE_KEY` de GitLab :

```bash
cat ~/.ssh/gitlab_deploy
```

### 3. Déployer

Le pipeline se déclenche automatiquement lors d'un push sur `main` ou `master`. Le déploiement est manuel (étape `deploy_o2switch`).

## 🚀 Déploiement avec GitHub Actions

### 1. Configurer les secrets dans GitHub

Allez dans votre dépôt GitHub → **Settings** → **Secrets and variables** → **Actions** et ajoutez :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `O2SWITCH_SSH_KEY` | Votre clé SSH privée | Contenu de `~/.ssh/id_rsa` |
| `O2SWITCH_USER` | Nom d'utilisateur O2Switch | `votre_user` |
| `O2SWITCH_HOST` | Serveur SSH O2Switch | `ssh.o2switch.net` |
| `O2SWITCH_DEPLOY_PATH` | Chemin de déploiement | `/home/votre_user/2nb-digital-site` |
| `O2SWITCH_URL` | URL de production | `https://votre-domaine.com` |

### 2. Générer une clé SSH

Même procédure que pour GitLab (voir ci-dessus).

### 3. Déployer

Le workflow se déclenche automatiquement lors d'un push sur `main` ou `master`.

## 🛠️ Déploiement manuel

Si vous préférez déployer manuellement, utilisez le script `deploy.sh` :

### 1. Configurer les variables d'environnement

```bash
export O2SWITCH_USER="votre_utilisateur"
export O2SWITCH_HOST="ssh.o2switch.net"
export O2SWITCH_DEPLOY_PATH="/home/votre_utilisateur/2nb-digital-site"
export O2SWITCH_URL="https://votre-domaine.com"
```

### 2. Exécuter le script

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔄 Configuration du serveur web (Apache/Nginx)

### Pour Apache

Créez ou modifiez votre fichier `.htaccess` ou configuration vhost :

```apache
# Proxy pour l'API backend
ProxyPass /api http://localhost:3001/api
ProxyPassReverse /api http://localhost:3001/api

# Servir les fichiers statiques du frontend
DocumentRoot /home/votre_user/2nb-digital-site/dist
<Directory /home/votre_user/2nb-digital-site/dist>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Pour Nginx

Ajoutez dans votre configuration de site :

```nginx
# Servir les fichiers statiques du frontend
root /home/votre_user/2nb-digital-site/dist;
index index.html;

location / {
    try_files $uri $uri/ /index.html;
}

# Proxy pour l'API backend
location /api {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## 📦 Première migration de la base de données

Lors du premier déploiement, vous devez initialiser la base de données :

```bash
ssh votre_user@ssh.o2switch.net
cd ~/2nb-digital-site/server

# Créer le fichier .env avec les informations de la base de données
cat > .env << 'EOF'
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-domaine.com
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
EOF

# Installer les dépendances et initialiser la base
npm ci --production
npm run db:generate
npm run db:migrate:deploy
npm run create-default-admin
```

**Note** : La base de données PostgreSQL est déjà créée sur O2Switch avec les identifiants suivants :
- Base : `cire1827_2nbsite`
- Utilisateur : `cire1827_christian`
- Serveur : `127.0.0.1:5432`

## 🔄 Gestion avec PM2

### Démarrer l'application

```bash
cd ~/2nb-digital-site
pm2 start ecosystem.config.js
```

### Redémarrer l'application

```bash
pm2 restart 2nb-digital-api
```

### Voir les logs

```bash
pm2 logs 2nb-digital-api
```

### Arrêter l'application

```bash
pm2 stop 2nb-digital-api
```

### Configurer PM2 pour démarrer au boot

```bash
pm2 startup
pm2 save
```

## 🐛 Dépannage

### Erreur de connexion à la base de données

- Vérifiez que la base PostgreSQL est créée et accessible
- Vérifiez la variable `DATABASE_URL` dans `.env` :
  ```env
  DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"
  ```
- Testez la connexion depuis le serveur O2Switch :
  ```bash
  psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
  ```
- Vérifiez que PostgreSQL est bien lancé sur le port 5432

### L'application ne démarre pas

- Vérifiez les logs : `pm2 logs 2nb-digital-api`
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Vérifiez les permissions des dossiers

### Les migrations échouent

- Vérifiez que la base de données est accessible
- Vérifiez que le schéma Prisma est à jour
- Exécutez manuellement : `npm run db:migrate:deploy`

### Le frontend ne charge pas

- Vérifiez que le dossier `dist` existe et contient les fichiers
- Vérifiez la configuration Apache/Nginx
- Vérifiez les permissions du dossier `dist`

## 📝 Notes importantes

1. **Sécurité** : Ne commitez jamais le fichier `.env` dans Git
2. **JWT Secret** : Utilisez un secret fort et unique en production
3. **Base de données** : Faites des sauvegardes régulières
4. **PM2** : Utilisez PM2 pour gérer le processus Node.js en production
5. **Logs** : Surveillez les logs régulièrement pour détecter les erreurs

## 🔗 Ressources

- [Documentation O2Switch](https://www.o2switch.fr/support/)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
