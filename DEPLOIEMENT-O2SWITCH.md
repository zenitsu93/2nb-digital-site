# 🚀 Guide Simple de Déploiement sur O2Switch

Guide étape par étape pour déployer votre site Node.js sur O2Switch avec cPanel.

---

## 📋 Informations Importantes

- **Domaine** : `2nbdigital.com`
- **Dossier du projet** : `/home/cire1827/site-2nbdigital`
- **Base de données** : `cire1827_2nbsite`
- **Utilisateur DB** : `cire1827_christian`
- **Mot de passe DB** : `siriusj20023700`

---

## ÉTAPE 1 : Préparer le Projet sur le Serveur

### 1.1 Se Connecter et Cloner le Projet

```bash
ssh cire1827@109.234.167.45
cd ~
git clone https://votre-url-repo/site-2nbdigital.git site-2nbdigital
cd ~/site-2nbdigital
```

### 1.2 ⚠️ IMPORTANT : Supprimer les node_modules

**OBLIGATOIRE** avant de créer l'application dans cPanel :

```bash
rm -rf node_modules
rm -rf server/node_modules
```

Vérifier qu'ils sont bien supprimés :
```bash
ls -la | grep node_modules
ls -la server/ | grep node_modules
```

**Résultat attendu** : Aucun résultat (les dossiers sont supprimés).

---

## ÉTAPE 2 : Créer l'Application dans cPanel

### 2.1 Accéder à cPanel

1. Connectez-vous à votre **cPanel**
2. Trouvez **"Setup Node.js App"** dans la section **Logiciels** ou **Applications**
3. Cliquez sur **"Create Application"**

### 2.2 Remplir les Champs

Remplissez **exactement** comme suit :

- **Node.js Version** : `20.x` (ou la dernière version disponible)

- **Application Root** : 
  ```
  /home/cire1827/site-2nbdigital
  ```

- **Application URL** : 
  ```
  2nbdigital.com
  ```
  (Sélectionnez dans la liste déroulante)

- **Application Startup File** : 
  ```
  server/server.js
  ```

- **Application Mode** : `Production`

### 2.3 Ajouter les Variables d'Environnement

Dans la section **Environment Variables**, ajoutez **TOUTES** ces variables (une par ligne) :

```
DATABASE_URL=postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://2nbdigital.com
JWT_SECRET=votre-secret-jwt-ici
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT** : 
- Générez un `JWT_SECRET` sécurisé avec cette commande (sur le serveur) :
  ```bash
  openssl rand -base64 32
  ```
- Copiez le résultat et remplacez `votre-secret-jwt-ici` dans les variables d'environnement

### 2.4 Créer l'Application

Cliquez sur **"Create"** ou **"Créer"**

### 2.5 Installer les Dépendances

Après la création, cliquez sur **"Run NPM Install"** ou **"Installer les dépendances"**

Attendez que l'installation se termine.

### 2.6 Démarrer l'Application

Cliquez sur **"Start App"** ou **"Restart App"**

---

## ÉTAPE 3 : Configuration Post-Déploiement (via SSH)

Une fois l'application créée et démarrée dans cPanel, faites ces étapes :

### 3.1 Se Connecter au Serveur

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital
```

### 3.2 Générer Prisma

```bash
cd server
npm run db:generate
```

### 3.3 Appliquer les Migrations

```bash
npm run db:migrate:deploy
```

### 3.4 Créer l'Admin

```bash
npm run create-default-admin
```

**Identifiants** :
- Username : `christian`
- Password : `j20023700`

### 3.5 Build le Frontend

```bash
cd ~/site-2nbdigital
VITE_API_URL=/api npm run build
```

### 3.6 Redémarrer l'Application

Retournez dans **cPanel > Setup Node.js App** et cliquez sur **"Restart App"**

---

## ÉTAPE 4 : Configurer le Proxy Apache

### 4.1 Créer le fichier .htaccess

```bash
ssh cire1827@109.234.167.45

# Trouver le bon dossier public_html
cd ~/public_html
# OU
cd ~/domains/2nbdigital.com/public_html

# Créer le fichier .htaccess
nano .htaccess
```

### 4.2 Contenu du .htaccess

Collez ce contenu :

```apache
# Proxy vers Node.js sur le port 3001
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

Sauvegardez : `Ctrl+O`, `Entrée`, `Ctrl+X`

---

## ÉTAPE 5 : Tester

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

---

## 🔄 Pour Mettre à Jour le Site (Après Modifications)

### Sur votre Machine Locale

```bash
cd C:\Users\asus\Documents\site-2nbdigital
git add .
git commit -m "Vos modifications"
git push origin main
```

### Sur le Serveur

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital

# Récupérer les modifications
git pull origin main

# Rebuild le frontend
VITE_API_URL=/api npm run build

# Si le schéma Prisma a changé
cd server
npm run db:generate
npm run db:migrate:deploy

# Redémarrer dans cPanel
# Allez dans cPanel > Setup Node.js App > Restart App
```

---

## 🐛 Dépannage

### Erreur "node_modules folder/file should not exist"

**Solution** :
```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital
rm -rf node_modules
rm -rf server/node_modules
```

Puis réessayez de créer l'application dans cPanel.

### Erreur ".htaccess file not found"

**Solution** :
```bash
ssh cire1827@109.234.167.45
touch ~/public_html/.htaccess
# OU
touch ~/domains/2nbdigital.com/public_html/.htaccess
```

### Le Site ne s'Affiche pas (Page Blanche)

**Vérifications** :

1. **Vérifier que Node.js tourne** :
   ```bash
   curl http://localhost:3001
   ```
   Doit retourner du HTML.

2. **Vérifier que dist/ existe** :
   ```bash
   ls -la ~/site-2nbdigital/dist/
   ```
   Doit contenir `index.html` et `assets/`.

3. **Vérifier le statut dans cPanel** :
   - Allez dans **Setup Node.js App**
   - Vérifiez que le statut est **"Running"**

4. **Vérifier les logs** :
   - Dans cPanel > Setup Node.js App > View Logs
   - Copiez les erreurs

### Erreur 500 Internal Server Error

1. **Vérifier les variables d'environnement dans cPanel**
2. **Vérifier les logs dans cPanel**
3. **Générer Prisma** :
   ```bash
   cd ~/site-2nbdigital/server
   npm run db:generate
   ```

---

## ✅ Checklist Complète

- [ ] Projet cloné sur le serveur
- [ ] Dossiers `node_modules` supprimés
- [ ] Application créée dans cPanel "Setup Node.js App"
- [ ] Variables d'environnement configurées (6 variables)
- [ ] Dépendances installées via cPanel
- [ ] Application démarrée dans cPanel
- [ ] Prisma généré (`npm run db:generate`)
- [ ] Migrations appliquées (`npm run db:migrate:deploy`)
- [ ] Admin créé (`npm run create-default-admin`)
- [ ] Frontend buildé (`npm run build`)
- [ ] Fichier `.htaccess` créé dans `public_html`
- [ ] Site accessible sur `https://2nbdigital.com`

---

## 📞 Support

- **Documentation O2Switch**: https://faq.o2switch.fr
- **Support Node.js**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
