# 🚀 Guide Complet de Déploiement sur O2Switch

Guide étape par étape pour déployer votre site Node.js + PostgreSQL sur O2Switch et le rendre accessible sur **2nbdigital.com**.

---

## 🔄 Workflow de Synchronisation

Ce guide utilise un **workflow Git** pour synchroniser vos modifications :

1. **Modifications locales** : Vous modifiez le code sur votre machine locale
2. **Push vers Git** : Vous commitez et poussez vos changements vers le repository
3. **Synchronisation serveur** : Sur le serveur, vous faites `git pull` pour récupérer les modifications
4. **Déploiement** : Rebuild et redémarrage de l'application

**Pour chaque modification** : Suivez l'**ÉTAPE 8 : Synchronisation des Modifications** qui détaille ce processus.

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

## 🔧 ÉTAPE 1 : Préparation Locale et Workflow Git

### 1.1 Vérifier que le Projet est dans Git

Assurez-vous que votre projet est bien versionné avec Git et que vous avez un repository distant (GitHub, GitLab, etc.).

```bash
# Dans le dossier du projet
cd C:\Users\asus\Documents\site-2nbdigital

# Vérifier le statut Git
git status

# Vérifier le remote
git remote -v
```

### 1.2 Workflow de Synchronisation

**Quand vous modifiez le code localement** :

1. **Faire vos modifications** dans le projet
2. **Tester localement** (optionnel) :
   ```bash
   npm install
   npm run build
   ```
3. **Commiter et pousser** :
   ```bash
   git add .
   git commit -m "Description de vos modifications"
   git push origin main  # ou master
   ```
4. **Synchroniser sur le serveur** (voir ÉTAPE 8 pour la procédure complète)

### 1.3 Vérifier les Fichiers de Configuration

Assurez-vous que les fichiers suivants existent :
- ✅ `ecosystem.config.cjs` (configuration PM2)
- ✅ `server/env.o2switch.example` (template de configuration)
- ✅ `.gitignore` (pour exclure `node_modules`, `.env`, etc.)

---

## 🔧 ÉTAPE 2 : Installation de Node.js sur O2Switch

### 2.1 Vérifier si Node.js est Installé

```bash
node --version
npm --version
```

### 2.2 Installer Node.js via nvm (si nécessaire)

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

## 📦 ÉTAPE 3 : Installation des Dépendances

### 3.1 Se Connecter et Aller dans le Dossier du Projet

```bash
# Se connecter au serveur
ssh cire1827@109.234.167.45

# Aller dans le dossier du projet (déjà cloné)
cd ~/site-2nbdigital
```

### 3.2 Installer les Dépendances Frontend

```bash
cd ~/site-2nbdigital
npm install
```

### 3.3 Build du Frontend

```bash
# Build avec l'URL de production
VITE_API_URL=/api npm run build
```

### 3.4 Installer les Dépendances Backend

```bash
cd ~/site-2nbdigital/server
npm install --production
```

### 3.5 Générer le Client Prisma

```bash
npm run db:generate
```

---

## 🗄️ ÉTAPE 4 : Configuration de la Base de Données

### 4.1 Créer le Fichier .env

```bash
cd ~/site-2nbdigital/server

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

### 4.2 Vérifier la Connexion à la Base de Données

```bash
# Tester la connexion PostgreSQL
psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite

# Si ça fonctionne, vous verrez le prompt PostgreSQL
# Tapez \q pour quitter
```

### 4.3 Appliquer les Migrations Prisma

```bash
cd ~/site-2nbdigital/server

# Appliquer toutes les migrations
npm run db:migrate:deploy
```

**Note**: Cette commande applique toutes les migrations en attente. Si la base de données est déjà créée mais vide, cela créera toutes les tables.

### 4.4 Créer l'Administrateur par Défaut

```bash
cd ~/site-2nbdigital/server
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

---

## 🚀 ÉTAPE 5 : Configuration PM2 (Gestionnaire de Processus)

### 5.1 Installer PM2 Globalement

```bash
npm install -g pm2
```

### 5.2 Démarrer l'Application avec PM2

**Important** : Si vous aviez déjà démarré l'application avec l'ancien nom de dossier, supprimez-la d'abord :

```bash
# Arrêter et supprimer l'ancienne configuration
pm2 delete 2nb-digital-api
# OU si le nom est différent
pm2 delete all
```

Puis démarrez avec la nouvelle configuration :

```bash
cd ~/site-2nbdigital
pm2 start ecosystem.config.cjs
```

### 5.3 Vérifier que l'Application Tourne

```bash
pm2 list
pm2 logs 2nb-digital-api
```

Vous devriez voir :
```
🚀 Server running on http://localhost:3001
```

### 5.4 Configurer PM2 pour Démarrer au Redémarrage

```bash
pm2 startup
# Suivez les instructions affichées
pm2 save
```

---

## 🌐 ÉTAPE 6 : Configuration Apache (Proxy vers Node.js)

### 6.1 Trouver le Dossier public_html

```bash
# Vérifier où se trouve public_html
ls -la ~/public_html
# OU
ls -la ~/domains/2nbdigital.com/public_html
```

### 6.2 Créer le Fichier .htaccess

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

### 6.3 Vérifier que mod_proxy est Activé

Si vous obtenez une erreur 502 Bad Gateway, contactez le support O2Switch pour activer :
- `mod_proxy`
- `mod_proxy_http`

---

## ✅ ÉTAPE 7 : Tests et Vérification

### 7.1 Tester Node.js Directement

```bash
# Sur le serveur
curl http://localhost:3001
curl http://localhost:3001/api/health
```

Vous devriez voir des réponses JSON.

### 7.2 Tester via le Domaine

```bash
# Depuis votre machine locale
curl https://2nbdigital.com
curl https://2nbdigital.com/api/health
```

### 7.3 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

---

## 🔄 ÉTAPE 8 : Synchronisation des Modifications (Workflow Quotidien)

Cette étape est à répéter **chaque fois que vous modifiez le code** et que vous voulez déployer les changements.

### 8.1 Sur votre Machine Locale

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

### 8.2 Sur le Serveur O2Switch

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

# 9. Redémarrer l'application
cd ~/site-2nbdigital
pm2 restart 2nb-digital-api

# 10. Vérifier que tout fonctionne
pm2 logs 2nb-digital-api --lines 50
```

### 8.3 Vérification Rapide

```bash
# Vérifier que l'application tourne
pm2 list

# Tester l'API
curl http://localhost:3001/api/health

# Voir les logs en temps réel
pm2 logs 2nb-digital-api
```

---

## 📦 ÉTAPE 9 : Migration des Données (si nécessaire)

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

### Appliquer de Nouvelles Migrations

```bash
cd ~/site-2nbdigital/server
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
   ls -la ~/site-2nbdigital/dist/
   ```

2. **Rebuild le frontend** :
   ```bash
   cd ~/site-2nbdigital
   VITE_API_URL=/api npm run build
   ```

3. **Redémarrer l'application** :
   ```bash
   pm2 restart 2nb-digital-api
   ```

### Erreur de Connexion à la Base de Données

1. **Vérifier les identifiants dans .env** :
   ```bash
   cat ~/site-2nbdigital/server/.env
   ```

2. **Tester la connexion PostgreSQL** :
   ```bash
   psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
   ```

3. **Vérifier que PostgreSQL est en cours d'exécution** (contactez le support O2Switch si nécessaire)

### Erreur "Environment variable not found: DATABASE_URL" lors de create-default-admin

Si vous obtenez cette erreur lors de l'exécution de `npm run create-default-admin` :

1. **Vérifier que le fichier .env existe** :
   ```bash
   ls -la ~/site-2nbdigital/server/.env
   ```

2. **Vérifier le contenu du fichier .env** :
   ```bash
   cat ~/site-2nbdigital/server/.env
   ```
   Assurez-vous que la ligne `DATABASE_URL=...` est présente et correcte.

3. **Vérifier que vous êtes dans le bon dossier** :
   ```bash
   cd ~/site-2nbdigital/server
   npm run create-default-admin
   ```

4. **Si le problème persiste**, le script a été corrigé pour charger automatiquement le fichier .env. Assurez-vous d'avoir la dernière version :
   ```bash
   cd ~/site-2nbdigital
   git pull origin main
   cd server
   npm run create-default-admin
   ```

### Erreur "Cannot find module '/home/cire1827/2nb-digital-site/server/server.js'"

Si vous voyez cette erreur dans les logs PM2, c'est que la configuration PM2 utilise encore l'ancien nom de dossier :

1. **Vérifier la configuration PM2** :
   ```bash
   cat ~/site-2nbdigital/ecosystem.config.cjs
   ```
   Le `cwd` doit être `/home/cire1827/site-2nbdigital` et non `/home/cire1827/2nb-digital-site`

2. **Supprimer l'ancienne configuration PM2** :
   ```bash
   pm2 delete 2nb-digital-api
   # OU
   pm2 delete all
   ```

3. **Redémarrer avec la bonne configuration** :
   ```bash
   cd ~/site-2nbdigital
   pm2 start ecosystem.config.cjs
   ```

4. **Vérifier que ça fonctionne** :
   ```bash
   pm2 list
   pm2 logs 2nb-digital-api
   ```

### Erreur "Cannot find module" (général)

1. **Réinstaller les dépendances** :
   ```bash
   cd ~/site-2nbdigital/server
   rm -rf node_modules
   npm install --production
   npm run db:generate
   ```

---

## 📝 Checklist de Déploiement Initial

- [ ] Repository Git configuré et accessible
- [ ] Node.js installé et fonctionnel sur le serveur
- [ ] Projet cloné dans `/home/cire1827/site-2nbdigital` sur le serveur O2Switch
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

## 🔄 Checklist de Synchronisation (À répéter à chaque modification)

- [ ] Modifications committées localement
- [ ] Modifications poussées vers le repository Git
- [ ] `git pull` effectué sur le serveur
- [ ] Dépendances mises à jour si nécessaire
- [ ] Frontend rebuildé (`npm run build`)
- [ ] Client Prisma régénéré si le schéma a changé
- [ ] Migrations appliquées si nécessaire
- [ ] Application redémarrée avec PM2
- [ ] Vérification des logs et tests fonctionnels

---

## 🎉 Félicitations !

Votre site est maintenant déployé sur O2Switch et accessible sur **2nbdigital.com** !

Pour toute question ou problème, consultez la section Dépannage ci-dessus ou contactez le support O2Switch.

---

## 📞 Support

- **Documentation O2Switch**: https://faq.o2switch.fr
- **Support Node.js O2Switch**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
- **Support PostgreSQL O2Switch**: https://faq.o2switch.fr/cpanel/bases-de-donnees/postgresql/
