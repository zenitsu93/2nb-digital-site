# 🚀 Guide Complet de Déploiement sur O2Switch

Guide étape par étape pour déployer votre site Node.js + PostgreSQL sur O2Switch et le rendre accessible sur **2nbdigital.com**.

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
- **Dossier du projet**: `/home/cire1827/2nb-digital-site`

---

## 🔧 ÉTAPE 1 : Préparation Locale

### 1.1 Nettoyer et Build le Projet

```bash
# Dans le dossier du projet
cd C:\Users\asus\Documents\2nb-digital-site

# Installer les dépendances frontend
npm install

# Build du frontend pour la production
npm run build
```

### 1.2 Vérifier les Fichiers de Configuration

Assurez-vous que les fichiers suivants existent :
- ✅ `ecosystem.config.cjs` (configuration PM2)
- ✅ `server/env.o2switch.example` (template de configuration)

---

## 📤 ÉTAPE 2 : Transfert des Fichiers sur O2Switch

### 2.1 Connexion SSH

```bash
ssh cire1827@109.234.167.45
```

### 2.2 Créer le Dossier du Projet (si nécessaire)

```bash
cd ~
mkdir -p 2nb-digital-site
cd 2nb-digital-site
```

### 2.3 Transférer les Fichiers

**Option A : Via FTP (FileZilla, WinSCP, etc.)**
- Connectez-vous avec les identifiants FTP fournis par O2Switch
- Transférez tous les fichiers du projet vers `/home/cire1827/2nb-digital-site`

**Option B : Via Git (recommandé)**
```bash
# Sur le serveur O2Switch
cd ~
git clone https://votre-repo.git 2nb-digital-site
cd 2nb-digital-site
```

**Option C : Via rsync (depuis votre machine locale)**
```bash
# Depuis votre machine Windows (avec WSL ou Git Bash)
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude '.git' \
  ./ cire1827@109.234.167.45:~/2nb-digital-site/
```

---

## 🔧 ÉTAPE 3 : Installation de Node.js sur O2Switch

### 3.1 Vérifier si Node.js est Installé

```bash
node --version
npm --version
```

### 3.2 Installer Node.js via nvm (si nécessaire)

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le shell
source ~/.bashrc

# Installer Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Vérifier
node --version  # Doit afficher v20.x.x
npm --version
```

**Note**: O2Switch peut aussi avoir Node.js installé via cPanel. Vérifiez dans cPanel > Setup Node.js App.

---

## 📦 ÉTAPE 4 : Installation des Dépendances

### 4.1 Installer les Dépendances Frontend

```bash
cd ~/2nb-digital-site
npm install
```

### 4.2 Build du Frontend

```bash
# Build avec l'URL de production
VITE_API_URL=/api npm run build
```

### 4.3 Installer les Dépendances Backend

```bash
cd ~/2nb-digital-site/server
npm install --production
```

### 4.4 Générer le Client Prisma

```bash
npm run db:generate
```

---

## 🗄️ ÉTAPE 5 : Configuration de la Base de Données

### 5.1 Créer le Fichier .env

```bash
cd ~/2nb-digital-site/server

# Créer le fichier .env
nano .env
```

Collez ce contenu (les informations sont déjà correctes) :

```env
# Base de données PostgreSQL O2Switch
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"

# Configuration serveur
PORT=3001
NODE_ENV=production

# URL du frontend en production
FRONTEND_URL=https://2nbdigital.com

# JWT Secret (générer un secret fort)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
```

**Important**: Générez un JWT_SECRET sécurisé :
```bash
openssl rand -base64 32
```
Copiez le résultat et remplacez `$(openssl rand -base64 32)` dans le fichier .env.

Sauvegarder : `Ctrl+O`, `Entrée`, `Ctrl+X`

### 5.2 Vérifier la Connexion à la Base de Données

```bash
# Tester la connexion PostgreSQL
psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite

# Si ça fonctionne, vous verrez le prompt PostgreSQL
# Tapez \q pour quitter
```

### 5.3 Appliquer les Migrations Prisma

```bash
cd ~/2nb-digital-site/server

# Appliquer toutes les migrations
npm run db:migrate:deploy
```

**Note**: Cette commande applique toutes les migrations en attente. Si la base de données est déjà créée mais vide, cela créera toutes les tables.

### 5.4 Créer l'Administrateur par Défaut

```bash
cd ~/2nb-digital-site/server
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

---

## 🚀 ÉTAPE 6 : Configuration PM2 (Gestionnaire de Processus)

### 6.1 Installer PM2 Globalement

```bash
npm install -g pm2
```

### 6.2 Démarrer l'Application avec PM2

```bash
cd ~/2nb-digital-site
pm2 start ecosystem.config.cjs
```

### 6.3 Vérifier que l'Application Tourne

```bash
pm2 list
pm2 logs 2nb-digital-api
```

Vous devriez voir :
```
🚀 Server running on http://localhost:3001
```

### 6.4 Configurer PM2 pour Démarrer au Redémarrage

```bash
pm2 startup
# Suivez les instructions affichées
pm2 save
```

---

## 🌐 ÉTAPE 7 : Configuration Apache (Proxy vers Node.js)

### 7.1 Trouver le Dossier public_html

```bash
# Vérifier où se trouve public_html
ls -la ~/public_html
# OU
ls -la ~/domains/2nbdigital.com/public_html
```

### 7.2 Créer le Fichier .htaccess

```bash
# Aller dans le dossier public_html
cd ~/public_html
# OU
cd ~/domains/2nbdigital.com/public_html

# Créer le fichier .htaccess
nano .htaccess
```

Collez ce contenu :

```apache
# Proxy TOUT vers Node.js (frontend + API)
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
</IfModule>
```

Sauvegarder : `Ctrl+O`, `Entrée`, `Ctrl+X`

### 7.3 Vérifier que mod_proxy est Activé

Si vous obtenez une erreur 502 Bad Gateway, contactez le support O2Switch pour activer :
- `mod_proxy`
- `mod_proxy_http`

---

## ✅ ÉTAPE 8 : Tests et Vérification

### 8.1 Tester Node.js Directement

```bash
# Sur le serveur
curl http://localhost:3001
curl http://localhost:3001/api/health
```

Vous devriez voir des réponses JSON.

### 8.2 Tester via le Domaine

```bash
# Depuis votre machine locale
curl https://2nbdigital.com
curl https://2nbdigital.com/api/health
```

### 8.3 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

---

## 🔄 ÉTAPE 9 : Migration des Données (si nécessaire)

Si vous avez des données existantes à migrer :

### 9.1 Exporter les Données Locales

```bash
# Depuis votre machine locale
pg_dump -h localhost -U votre_user -d votre_db > backup.sql
```

### 9.2 Transférer le Fichier sur O2Switch

```bash
# Via SCP
scp backup.sql cire1827@109.234.167.45:~/backup.sql
```

### 9.3 Importer les Données

```bash
# Sur le serveur O2Switch
psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite < ~/backup.sql
```

**OU** via phpPgAdmin dans cPanel :
1. Connectez-vous à cPanel
2. Ouvrez phpPgAdmin
3. Sélectionnez la base `cire1827_2nbsite`
4. Importez le fichier SQL

---

## 🛠️ Commandes Utiles pour la Maintenance

### Redémarrer l'Application

```bash
pm2 restart 2nb-digital-api
```

### Voir les Logs

```bash
pm2 logs 2nb-digital-api
pm2 logs 2nb-digital-api --lines 100  # 100 dernières lignes
```

### Arrêter l'Application

```bash
pm2 stop 2nb-digital-api
```

### Mettre à Jour le Code

```bash
cd ~/2nb-digital-site
git pull origin main  # Si vous utilisez Git

# Rebuild le frontend
npm run build

# Redémarrer
cd server
npm run db:generate
pm2 restart 2nb-digital-api
```

### Appliquer de Nouvelles Migrations

```bash
cd ~/2nb-digital-site/server
npm run db:migrate:deploy
pm2 restart 2nb-digital-api
```

---

## 🐛 Dépannage

### Erreur 502 Bad Gateway

1. **Vérifier que Node.js tourne** :
   ```bash
   pm2 list
   pm2 logs 2nb-digital-api
   ```

2. **Vérifier que le port 3001 est accessible** :
   ```bash
   curl http://localhost:3001
   ```

3. **Vérifier que mod_proxy est activé** (contactez le support O2Switch)

### Le Frontend ne s'Affiche pas

1. **Vérifier que le dossier dist/ existe** :
   ```bash
   ls -la ~/2nb-digital-site/dist/
   ```

2. **Rebuild le frontend** :
   ```bash
   cd ~/2nb-digital-site
   VITE_API_URL=/api npm run build
   ```

3. **Redémarrer l'application** :
   ```bash
   pm2 restart 2nb-digital-api
   ```

### Erreur de Connexion à la Base de Données

1. **Vérifier les identifiants dans .env** :
   ```bash
   cat ~/2nb-digital-site/server/.env
   ```

2. **Tester la connexion PostgreSQL** :
   ```bash
   psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
   ```

3. **Vérifier que PostgreSQL est en cours d'exécution** (contactez le support O2Switch si nécessaire)

### Erreur "Cannot find module"

1. **Réinstaller les dépendances** :
   ```bash
   cd ~/2nb-digital-site/server
   rm -rf node_modules
   npm install --production
   npm run db:generate
   ```

---

## 📝 Checklist de Déploiement

- [ ] Node.js installé et fonctionnel
- [ ] Fichiers transférés sur le serveur
- [ ] Dépendances frontend installées
- [ ] Frontend buildé (`dist/` existe)
- [ ] Dépendances backend installées
- [ ] Fichier `.env` créé avec les bonnes informations
- [ ] Client Prisma généré
- [ ] Migrations appliquées
- [ ] Admin par défaut créé
- [ ] PM2 installé et application démarrée
- [ ] Fichier `.htaccess` créé dans `public_html`
- [ ] Site accessible sur `https://2nbdigital.com`
- [ ] API accessible sur `https://2nbdigital.com/api/health`
- [ ] Admin accessible sur `https://2nbdigital.com/admin/login`

---

## 🎉 Félicitations !

Votre site est maintenant déployé sur O2Switch et accessible sur **2nbdigital.com** !

Pour toute question ou problème, consultez la section Dépannage ci-dessus ou contactez le support O2Switch.

---

## 📞 Support

- **Documentation O2Switch**: https://faq.o2switch.fr
- **Support Node.js O2Switch**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
- **Support PostgreSQL O2Switch**: https://faq.o2switch.fr/cpanel/bases-de-donnees/postgresql/
