# Guide de dépannage - Déploiement O2Switch

## ❌ Erreur: `npm: command not found`

### Symptôme
```
deploy-hook.sh: line 29: npm: command not found
```

### Solution 1: Installer Node.js via nvm (Recommandé)

1. Connectez-vous en SSH :
   ```bash
   ssh cire1827@109.234.167.45
   ```

2. Exécutez le script d'installation :
   ```bash
   cd ~/2nb-digital-site
   bash install-nodejs.sh
   ```

3. Rechargez votre session :
   ```bash
   source ~/.bashrc
   ```

4. Vérifiez l'installation :
   ```bash
   node --version
   npm --version
   ```

### Solution 2: Installation manuelle de nvm

Si le script ne fonctionne pas, installez nvm manuellement :

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Charger nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Installer Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Ajouter au .bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# Recharger
source ~/.bashrc
```

### Solution 3: Vérifier si Node.js est déjà installé ailleurs

```bash
# Chercher Node.js
which node
which npm

# Chercher dans les chemins communs
ls -la /usr/local/bin/node
ls -la /usr/bin/node
ls -la ~/.nvm/versions/node/

# Si trouvé, ajouter au PATH
export PATH="/chemin/vers/node/bin:$PATH"
```

### Solution 4: Contacter le support O2Switch

Si aucune des solutions ci-dessus ne fonctionne, contactez le support O2Switch pour installer Node.js sur votre serveur.

---

## ❌ Erreur: `pm2: command not found`

### Solution

Installez PM2 globalement :

```bash
npm install -g pm2
```

Vérifiez l'installation :
```bash
pm2 --version
```

---

## ❌ Erreur: `Permission denied` lors de l'installation npm

### Solution

Utilisez `--prefix` pour installer dans votre dossier home :

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## ❌ Erreur: `Cannot find module` lors du build

### Solution

Vérifiez que toutes les dépendances sont installées :

```bash
cd ~/2nb-digital-site
npm ci

cd server
npm ci --production
```

---

## ❌ Erreur: `Prisma Client` non généré

### Solution

Générez le client Prisma manuellement :

```bash
cd ~/2nb-digital-site/server
npm run db:generate
```

---

## ❌ Erreur: Connexion à la base de données échoue

### Solution

1. Vérifiez le fichier `.env` :
   ```bash
   cd ~/2nb-digital-site/server
   cat .env
   ```

2. Vérifiez la connexion :
   ```bash
   psql -h 127.0.0.1 -U cire1827_christian -d cire1827_2nbsite
   ```

3. Vérifiez que PostgreSQL est en cours d'exécution :
   ```bash
   ps aux | grep postgres
   ```

---

## ❌ Le hook Git ne s'exécute pas

### Solution

1. Vérifiez les permissions :
   ```bash
   chmod +x ~/2nb-digital-site/.git/hooks/post-receive
   chmod +x ~/2nb-digital-site/deploy-hook.sh
   ```

2. Testez le hook manuellement :
   ```bash
   cd ~/2nb-digital-site
   bash .git/hooks/post-receive
   ```

3. Vérifiez les logs Git :
   ```bash
   tail -f ~/2nb-digital-site/.git/hooks/post-receive.log
   ```

---

## ✅ Vérifications de base

Avant de déployer, vérifiez :

```bash
# 1. Node.js est installé
node --version  # Doit afficher v20.x.x ou supérieur

# 2. npm est installé
npm --version  # Doit afficher 10.x.x ou supérieur

# 3. PM2 est installé (optionnel)
pm2 --version  # Doit afficher une version

# 4. Le fichier .env existe
ls -la ~/2nb-digital-site/server/.env

# 5. Les permissions sont correctes
ls -la ~/2nb-digital-site/deploy-hook.sh
ls -la ~/2nb-digital-site/.git/hooks/post-receive
```

---

## 📞 Support

Si vous rencontrez d'autres problèmes :

1. Vérifiez les logs du script :
   ```bash
   cd ~/2nb-digital-site
   bash deploy-hook.sh
   ```

2. Vérifiez les logs PM2 :
   ```bash
   pm2 logs 2nb-digital-api
   ```

3. Contactez le support O2Switch pour les problèmes d'infrastructure
