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

### 1.3 ⚠️ IMPORTANT : Supprimer les dossiers node_modules

**CloudLinux NodeJS Selector** crée automatiquement un symlink `node_modules` vers un environnement virtuel. Si des dossiers `node_modules` existent déjà, cela crée un conflit.

```bash
# Supprimer node_modules à la racine (s'il existe)
rm -rf ~/site-2nbdigital/node_modules

# Supprimer node_modules dans server (s'il existe)
rm -rf ~/site-2nbdigital/server/node_modules
```

**Note** : CloudLinux créera automatiquement les symlinks `node_modules` nécessaires lors de la création de l'application dans cPanel.

---

## 🚀 ÉTAPE 2 : Configuration via cPanel "Setup Node.js App"

### 2.1 Accéder à l'Outil

1. Connectez-vous à votre **cPanel**
2. Dans la section **Logiciels** ou **Applications**, trouvez **"Setup Node.js App"**
3. Cliquez sur **"Create Application"**

### 2.2 Configuration de l'Application

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

### 2.3 Variables d'Environnement

Dans la section **Environment Variables** de cPanel, ajoutez **TOUTES** les variables suivantes (une par ligne) :

```
DATABASE_URL=postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://2nbdigital.com
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT** : 
- **Générez un JWT_SECRET sécurisé** avec cette commande (sur le serveur) :
  ```bash
  openssl rand -base64 32
  ```
  Copiez le résultat et remplacez `votre-secret-jwt-tres-securise` dans les variables d'environnement.
- **Toutes ces variables sont nécessaires** pour que l'application fonctionne correctement

**Variables requises** :
- `DATABASE_URL` : Connexion à PostgreSQL (obligatoire)
- `PORT` : Port sur lequel l'application écoute (par défaut 3001)
- `NODE_ENV` : Environnement (production)
- `FRONTEND_URL` : URL du site en production (pour CORS)
- `JWT_SECRET` : Secret pour signer les tokens JWT (obligatoire, doit être sécurisé)
- `JWT_EXPIRES_IN` : Durée de validité des tokens (par défaut 7d)

### 2.4 Créer l'Application

Cliquez sur **"Create"** ou **"Créer"**

### 2.5 Installer les Dépendances

Après avoir créé l'application, CloudLinux va automatiquement :
1. Créer le symlink `node_modules` vers l'environnement virtuel
2. Installer les dépendances depuis `package.json`

Cliquez sur le bouton **"Run NPM Install"** ou **"Installer les dépendances"** si disponible.

**⚠️ IMPORTANT** : Si vous obtenez une erreur concernant `node_modules`, assurez-vous d'avoir supprimé tous les dossiers `node_modules` existants (voir étape 1.3).

### 2.6 Démarrer l'Application

Une fois les dépendances installées, cliquez sur **"Restart App"** ou **"Redémarrer l'application"**.

---

## 📦 ÉTAPE 3 : Configuration Post-Déploiement (via SSH)

Une fois l'application créée et démarrée dans cPanel, effectuez ces étapes via SSH :

### 3.1 Générer le Client Prisma

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital/server
npm run db:generate
```

### 3.2 Appliquer les Migrations Prisma

```bash
cd ~/site-2nbdigital/server
npm run db:migrate:deploy
```

### 3.3 Créer l'Administrateur par Défaut

```bash
cd ~/site-2nbdigital/server
npm run create-default-admin
```

**Identifiants par défaut** :
- **Username**: `christian`
- **Password**: `j20023700`

**⚠️ IMPORTANT**: Changez le mot de passe après la première connexion !

### 3.4 Build du Frontend

```bash
cd ~/site-2nbdigital
VITE_API_URL=/api npm run build
```

### 3.5 Redémarrer l'Application

Retournez dans cPanel > Setup Node.js App et cliquez sur **"Restart App"** pour redémarrer l'application avec toutes les configurations.

---

## ✅ ÉTAPE 4 : Tests et Vérification

### 4.1 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

### 4.2 Vérifier les Logs dans cPanel

Dans l'outil "Setup Node.js App", vous pouvez :
- Voir les **logs de l'application**
- Voir le **statut** (Running/Stopped)
- **Redémarrer** l'application
- **Arrêter/Démarrer** l'application

---

## 🔄 ÉTAPE 5 : Synchronisation des Modifications (Workflow Quotidien)

Cette étape est à répéter **chaque fois que vous modifiez le code** et que vous voulez déployer les changements.

### 5.1 Sur votre Machine Locale

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

### 5.2 Sur le Serveur O2Switch

```bash
# 1. Se connecter au serveur
ssh cire1827@109.234.167.45

# 2. Aller dans le dossier du projet
cd ~/site-2nbdigital

# 3. Récupérer les dernières modifications
git pull origin main  # ou master

# 4. Rebuild le frontend avec les nouvelles modifications
VITE_API_URL=/api npm run build

# 5. Si des dépendances backend ont changé
cd server
npm run db:generate  # Si le schéma Prisma a changé
npm run db:migrate:deploy  # Si vous avez de nouvelles migrations

# 6. Redémarrer l'application via cPanel
# Allez dans cPanel > Setup Node.js App > Cliquez sur "Restart App"
```

### 5.3 Vérification Rapide

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

### Erreur "node_modules folder/file should not exist"

Si vous obtenez cette erreur lors de la création de l'application dans cPanel :

1. **Supprimer tous les dossiers node_modules** :
   ```bash
   ssh cire1827@109.234.167.45
   cd ~/site-2nbdigital
   rm -rf node_modules
   rm -rf server/node_modules
   ```

2. **Vérifier qu'ils sont bien supprimés** :
   ```bash
   ls -la | grep node_modules
   ls -la server/ | grep node_modules
   ```

3. **Réessayer de créer l'application dans cPanel**

CloudLinux créera automatiquement les symlinks `node_modules` nécessaires vers l'environnement virtuel.

### L'Application ne Démarre pas

1. **Vérifier les logs dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Cliquez sur **"View Logs"** pour voir les erreurs

2. **Vérifier que le fichier server.js existe** :
   ```bash
   ls -la ~/site-2nbdigital/server/server.js
   ```

3. **Vérifier que les symlinks node_modules existent** :
   ```bash
   ls -la ~/site-2nbdigital/node_modules
   ls -la ~/site-2nbdigital/server/node_modules
   ```
   Ils doivent être des symlinks (flèche →), pas des dossiers normaux.

4. **Vérifier les variables d'environnement dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que toutes les variables d'environnement sont correctement définies

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

1. **Vérifier les variables d'environnement dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que `DATABASE_URL` est correctement définie

2. **Tester la connexion PostgreSQL** :
   ```bash
   psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
   ```

### Erreur "Environment variable not found: DATABASE_URL"

1. **Vérifier les variables d'environnement dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que toutes les variables d'environnement sont bien définies (voir étape 2.3)

2. **Redémarrer l'application** après avoir ajouté/modifié les variables

### Erreur "Cannot find module"

1. **Réinstaller les dépendances via cPanel** :
   - Allez dans **Setup Node.js App**
   - Cliquez sur **"Run NPM Install"**

2. **Redémarrer l'application via cPanel**

---

## 📝 Checklist de Déploiement Initial

- [ ] Repository Git configuré et accessible
- [ ] Projet cloné dans `/home/cire1827/site-2nbdigital` sur le serveur O2Switch
- [ ] Dossiers `node_modules` supprimés (étape 1.3)
- [ ] Application créée dans cPanel "Setup Node.js App"
- [ ] Variables d'environnement configurées dans cPanel (étape 2.3)
- [ ] Dépendances installées via cPanel (étape 2.5)
- [ ] Client Prisma généré (étape 3.1)
- [ ] Migrations appliquées (étape 3.2)
- [ ] Admin par défaut créé (étape 3.3)
- [ ] Frontend buildé (étape 3.4)
- [ ] Application démarrée et fonctionnelle
- [ ] Site accessible sur `https://2nbdigital.com`
- [ ] API accessible sur `https://2nbdigital.com/api/health`
- [ ] Admin accessible sur `https://2nbdigital.com/admin/login`

## 🔄 Checklist de Synchronisation (À répéter à chaque modification)

- [ ] Modifications committées localement
- [ ] Modifications poussées vers le repository Git
- [ ] `git pull` effectué sur le serveur
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
