# 🚀 Guide de Déploiement O2Switch - Prisma 7

**Guide de mise à jour pour déployer votre application avec Prisma 7 sur O2Switch**

> ⚠️ **IMPORTANT** : Ce guide est spécifique à la mise à jour vers Prisma 7.

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

## 🔄 ÉTAPE 1 : Mettre à Jour le Code sur le Serveur

### 1.1 Se Connecter et Récupérer les Modifications

```bash
ssh cire1827@109.234.167.45
cd ~/site-2nbdigital

# Récupérer les dernières modifications depuis Git
git pull origin main
```

### 1.2 Vérifier les Fichiers Prisma 7

```bash
# Vérifier que les nouveaux fichiers existent
ls -la server/prisma.config.ts
ls -la server/lib/prisma.js
ls -la server/package.json
```

Ces fichiers doivent exister :
- ✅ `server/prisma.config.ts` (nouveau fichier de configuration Prisma 7)
- ✅ `server/lib/prisma.js` (nouveau fichier centralisé pour PrismaClient)
- ✅ `server/package.json` (doit contenir Prisma 7.2.0)

---

## 📦 ÉTAPE 2 : Mettre à Jour les Dépendances

### 2.1 Arrêter l'Application dans cPanel

1. Connectez-vous à **cPanel**
2. Allez dans **Setup Node.js App**
3. Cliquez sur **"Stop App"** pour arrêter l'application

### 2.2 Supprimer les Anciens node_modules

```bash
cd ~/site-2nbdigital

# Supprimer les node_modules (OBLIGATOIRE pour éviter les conflits)
rm -rf node_modules
rm -rf server/node_modules
```

### 2.3 Installer les Dépendances Racine (via cPanel)

1. Dans **cPanel > Setup Node.js App**
2. Cliquez sur **"Run NPM Install"** (installe les dépendances à la racine)

### 2.4 Installer les Dépendances Backend avec Prisma 7 (via SSH)

```bash
cd ~/site-2nbdigital/server

# Activer l'environnement Node.js (OBLIGATOIRE)
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Installer les nouvelles dépendances (Prisma 7 + adapter PostgreSQL)
npm install
```

**Vérification** :
```bash
# Vérifier que Prisma 7 est installé
npm list @prisma/client prisma @prisma/adapter-pg pg

# Doit afficher :
# @prisma/client@7.2.0
# prisma@7.2.0
# @prisma/adapter-pg@7.2.0
# pg@8.16.3
```

---

## 🔧 ÉTAPE 3 : Configuration Prisma 7

### 3.1 Générer le Client Prisma 7

```bash
# Toujours dans server/ et avec l'environnement activé
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Générer le client Prisma 7
npm run db:generate
```

**Vérification** :
```bash
# Vérifier que le client Prisma 7 est généré
ls -la node_modules/.prisma/client

# Vérifier la version générée
cat node_modules/.prisma/client/package.json | grep version
# Doit afficher "7.2.0"
```

### 3.2 Valider le Schéma Prisma

```bash
# Valider que le schéma est correct
npx prisma validate
```

**Résultat attendu** : `The schema at prisma/schema.prisma is valid 🚀`

### 3.3 Vérifier la Configuration Prisma

```bash
# Vérifier que prisma.config.ts est détecté
npx prisma --version
# Doit afficher Prisma 7.2.0
```

---

## 🗄️ ÉTAPE 4 : Migrations de Base de Données

### 4.1 Appliquer les Migrations (si nécessaire)

```bash
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Appliquer les migrations avec Prisma 7
npm run db:migrate:deploy
```

**Note** : Si vous avez déjà appliqué toutes les migrations, cette commande ne fera rien. C'est normal.

---

## 🏗️ ÉTAPE 5 : Rebuild le Frontend

```bash
cd ~/site-2nbdigital

# Activer l'environnement Node.js
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Build le frontend avec la bonne URL API
VITE_API_URL=/api npm run build
```

**Vérification** :
```bash
ls -la dist/
ls -la dist/index.html
ls -la dist/assets/
```

Tous ces fichiers doivent exister.

---

## 🚀 ÉTAPE 6 : Redémarrer l'Application

### 6.1 Démarrer l'Application dans cPanel

1. Retournez dans **cPanel > Setup Node.js App**
2. Cliquez sur **"Start App"** ou **"Restart App"**
3. Attendez quelques secondes
4. Vérifiez que le statut passe à **"Running"**

### 6.2 Vérifier les Logs

Dans **cPanel > Setup Node.js App** :
- Cliquez sur **"View Logs"** pour voir les logs
- Vérifiez qu'il n'y a pas d'erreurs liées à Prisma

---

## ✅ ÉTAPE 7 : Tests et Vérification

### 7.1 Tester dans le Navigateur

1. Ouvrez `https://2nbdigital.com` dans votre navigateur
2. Le site devrait s'afficher correctement
3. Testez l'API : `https://2nbdigital.com/api/health`
4. Testez l'admin : `https://2nbdigital.com/admin/login`

### 7.2 Vérifier que Prisma 7 Fonctionne

```bash
# Tester une requête Prisma (optionnel)
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Ouvrir Prisma Studio pour vérifier la connexion
# npm run db:studio
# (Ctrl+C pour quitter)
```

---

## 🐛 Dépannage Spécifique Prisma 7

### Erreur "The datasource property `url` is no longer supported"

**Solution** : Vérifiez que `server/prisma/schema.prisma` ne contient plus la propriété `url` dans le datasource :

```bash
cd ~/site-2nbdigital/server
cat prisma/schema.prisma | grep -A 3 "datasource"
```

Le datasource doit ressembler à :
```prisma
datasource db {
  provider = "postgresql"
}
```

**Pas de** `url = env("DATABASE_URL")` dans le datasource.

### Erreur "Cannot find module '@prisma/client'"

```bash
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
npm install
npm run db:generate
```

### Erreur "PrismaPg is not a constructor"

**Solution** : Vérifiez que `@prisma/adapter-pg` est installé :

```bash
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
npm list @prisma/adapter-pg
```

Si ce n'est pas installé :
```bash
npm install @prisma/adapter-pg pg
```

### Erreur "DATABASE_URL environment variable is not set"

**Solution** : Vérifiez que la variable d'environnement est bien configurée dans cPanel :

1. Allez dans **cPanel > Setup Node.js App**
2. Vérifiez que `DATABASE_URL` est bien dans les variables d'environnement :
   ```
   DATABASE_URL=postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public
   ```
3. Redémarrez l'application

### Erreur "prisma.config.ts not found"

**Solution** : Vérifiez que le fichier existe :

```bash
ls -la ~/site-2nbdigital/server/prisma.config.ts
```

Si le fichier n'existe pas, récupérez les modifications depuis Git :
```bash
cd ~/site-2nbdigital
git pull origin main
```

---

## 📝 Checklist de Mise à Jour Prisma 7

- [ ] Code mis à jour sur le serveur (`git pull`)
- [ ] Fichiers Prisma 7 présents (`prisma.config.ts`, `lib/prisma.js`)
- [ ] Application arrêtée dans cPanel
- [ ] Anciens `node_modules` supprimés
- [ ] Dépendances racine installées via cPanel
- [ ] Dépendances backend installées via SSH avec environnement activé
- [ ] Prisma 7.2.0 installé et vérifié
- [ ] Client Prisma 7 généré (`npm run db:generate`)
- [ ] Schéma Prisma validé (`npx prisma validate`)
- [ ] Migrations appliquées si nécessaire (`npm run db:migrate:deploy`)
- [ ] Frontend rebuildé (`VITE_API_URL=/api npm run build`)
- [ ] Application redémarrée dans cPanel (statut "Running")
- [ ] Site accessible sur `https://2nbdigital.com`
- [ ] API fonctionnelle (`https://2nbdigital.com/api/health`)
- [ ] Admin accessible (`https://2nbdigital.com/admin/login`)
- [ ] Pas d'erreurs dans les logs

---

## ⚠️ Notes Importantes Prisma 7

1. **Prisma 7 utilise un nouveau système de configuration** :
   - La configuration de la base de données est maintenant dans `prisma.config.ts`
   - Le schéma Prisma ne contient plus la propriété `url` dans le datasource
   - PrismaClient doit être instancié avec un adapter (PrismaPg pour PostgreSQL)

2. **Toujours activer l'environnement Node.js** avant d'exécuter npm/npx :
   ```bash
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   ```

3. **Les dépendances Prisma 7 requises** :
   - `@prisma/client@^7.2.0`
   - `prisma@^7.2.0`
   - `@prisma/adapter-pg@^7.2.0`
   - `pg@^8.16.3`

4. **Le fichier `lib/prisma.js` centralise l'instanciation** de PrismaClient avec l'adapter, évitant la duplication du code.

---

## 🎉 Félicitations !

Votre application est maintenant mise à jour avec Prisma 7 et déployée sur O2Switch !

---

## 📞 Support

- **Documentation Prisma 7**: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- **Documentation O2Switch Node.js**: https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/
