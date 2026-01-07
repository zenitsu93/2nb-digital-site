# 🔧 Réinstallation Complète - Vite et Prisma

**Guide pour nettoyer et réinstaller TOUTES les dépendances proprement**

---

## 📋 Ce qu'on va faire

1. Vérifier ce qui est installé AVANT
2. Supprimer tous les node_modules (nettoyer)
3. Réinstaller proprement
4. Vérifier que TOUT est installé APRÈS

---

## ✅ ÉTAPE 1 : VÉRIFICATION AVANT (sur le serveur)

Exécutez ces commandes pour voir l'état actuel :

```bash
# Activer l'environnement (OBLIGATOIRE)
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Aller à la racine
cd ~/site-2nbdigital

# Vérifier vite (devrait être vide ou erreur)
echo "=== VÉRIFICATION VITE (racine) ==="
npm list vite 2>&1 | head -5

# Aller dans server
cd server

# Vérifier prisma et dotenv
echo "=== VÉRIFICATION PRISMA (server/) ==="
npm list prisma 2>&1 | head -5
npm list dotenv 2>&1 | head -5
npm list @prisma/client 2>&1 | head -5
```

---

## 🗑️ ÉTAPE 2 : NETTOYAGE COMPLET

```bash
# Aller à la racine
cd ~/site-2nbdigital

# Supprimer node_modules à la racine
echo "Suppression node_modules racine..."
rm -rf node_modules
rm -rf package-lock.json

# Supprimer node_modules dans server
echo "Suppression node_modules server..."
rm -rf server/node_modules
rm -rf server/package-lock.json

echo "✅ Nettoyage terminé"
```

---

## 📦 ÉTAPE 3 : INSTALLATION RACINE (VITE)

```bash
# Être à la racine
cd ~/site-2nbdigital

# Activer l'environnement (OBLIGATOIRE)
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Installer TOUTES les dépendances de la racine
echo "=== INSTALLATION RACINE (vite) ==="
npm install

# Vérifier que vite est installé
echo "=== VÉRIFICATION VITE ==="
npm list vite

# Vérifier la version de vite
npx vite --version

# Si ça affiche une version, vite est OK ✅
# Si erreur, il y a un problème
```

---

## 📦 ÉTAPE 4 : INSTALLATION SERVER (PRISMA)

```bash
# Aller dans server
cd ~/site-2nbdigital/server

# Activer l'environnement (OBLIGATOIRE)
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Installer TOUTES les dépendances de server
echo "=== INSTALLATION SERVER (prisma) ==="
npm install

# Vérifier que prisma est installé
echo "=== VÉRIFICATION PRISMA ==="
npm list prisma

# Vérifier que dotenv est installé
echo "=== VÉRIFICATION DOTENV ==="
npm list dotenv

# Vérifier que @prisma/client est installé
echo "=== VÉRIFICATION @PRISMA/CLIENT ==="
npm list @prisma/client

# Vérifier que @prisma/adapter-pg est installé
echo "=== VÉRIFICATION @PRISMA/ADAPTER-PG ==="
npm list @prisma/adapter-pg
```

---

## 🔧 ÉTAPE 5 : GÉNÉRER LE CLIENT PRISMA

```bash
# Toujours dans server/ avec environnement activé
cd ~/site-2nbdigital/server
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Générer le client Prisma
echo "=== GÉNÉRATION CLIENT PRISMA ==="
npm run db:generate

# Vérifier que le client est généré
echo "=== VÉRIFICATION CLIENT GÉNÉRÉ ==="
ls -la node_modules/.prisma/client/package.json

# Si le fichier existe, c'est OK ✅
```

---

## ✅ ÉTAPE 6 : VÉRIFICATION FINALE

```bash
# Activer l'environnement
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Vérification racine (vite)
cd ~/site-2nbdigital
echo "=== RACINE - VITE ==="
npm list vite | grep vite@
npx vite --version

# Vérification server (prisma)
cd server
echo "=== SERVER - PRISMA ==="
npm list prisma | grep prisma@
npm list @prisma/client | grep @prisma/client@
npm list dotenv | grep dotenv@
npx prisma --version

# Vérifier que le client est généré
echo "=== CLIENT PRISMA GÉNÉRÉ ==="
ls node_modules/.prisma/client/package.json && echo "✅ Client généré" || echo "❌ Client NON généré"
```

---

## 🎯 TOUT EN UNE FOIS (copier-coller)

```bash
# ============================================
# RÉINSTALLATION COMPLÈTE EN UNE FOIS
# ============================================

# 1. Activer l'environnement
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# 2. Nettoyer TOUT
cd ~/site-2nbdigital
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
echo "✅ Nettoyage terminé"

# 3. Installer racine (vite)
echo "=== Installation racine (vite) ==="
npm install
echo "Vérification vite:"
npm list vite | grep vite@ || echo "❌ Vite manquant"
npx vite --version

# 4. Installer server (prisma)
echo "=== Installation server (prisma) ==="
cd server
npm install
echo "Vérification prisma:"
npm list prisma | grep prisma@ || echo "❌ Prisma manquant"
npm list dotenv | grep dotenv@ || echo "❌ dotenv manquant"
npm list @prisma/client | grep @prisma/client@ || echo "❌ @prisma/client manquant"

# 5. Générer client Prisma
echo "=== Génération client Prisma ==="
npm run db:generate
ls node_modules/.prisma/client/package.json && echo "✅ Client généré" || echo "❌ Client NON généré"

# 6. Vérification finale
echo ""
echo "=== RÉSUMÉ FINAL ==="
cd ~/site-2nbdigital
echo "Vite:" && (npm list vite | grep vite@ && echo "✅") || echo "❌"
cd server
echo "Prisma:" && (npm list prisma | grep prisma@ && echo "✅") || echo "❌"
echo "dotenv:" && (npm list dotenv | grep dotenv@ && echo "✅") || echo "❌"
echo "Client généré:" && (ls node_modules/.prisma/client/package.json > /dev/null 2>&1 && echo "✅") || echo "❌"
```

---

## 🐛 SI ÇA NE MARCHE TOUJOURS PAS

### Vérifier l'environnement Node.js

```bash
# Vérifier la version de Node
node --version
npm --version

# Vérifier que l'environnement est bien activé
which node
which npm
# Doivent pointer vers: /home/cire1827/nodevenv/site-2nbdigital/20/bin/
```

### Réinstaller avec cache vidé

```bash
cd ~/site-2nbdigital
source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate

# Installer avec cache vidé
npm cache clean --force
npm install

cd server
npm cache clean --force
npm install
npm run db:generate
```

### Vérifier les permissions

```bash
# Vérifier les permissions des dossiers
ls -la ~/site-2nbdigital | head -5
ls -la ~/site-2nbdigital/server | head -5

# Si problème de permissions:
chmod -R u+w ~/site-2nbdigital
```

---

## 📝 CHECKLIST DE VÉRIFICATION

Après l'installation, vous DEVEZ avoir :

- [ ] `node_modules/` existe à la racine
- [ ] `node_modules/vite/` existe
- [ ] `server/node_modules/` existe
- [ ] `server/node_modules/prisma/` existe
- [ ] `server/node_modules/dotenv/` existe
- [ ] `server/node_modules/@prisma/client/` existe
- [ ] `server/node_modules/.prisma/client/` existe (client généré)

---

## 💡 NOTES IMPORTANTES

1. **TOUJOURS activer l'environnement** avant npm :
   ```bash
   source /home/cire1827/nodevenv/site-2nbdigital/20/bin/activate
   ```

2. **Vite = à la racine**, **Prisma = dans server/**

3. **Après chaque npm install dans server/**, il faut :
   ```bash
   npm run db:generate
   ```

4. **Si vite ou prisma ne sont pas trouvés**, c'est que :
   - L'environnement n'est pas activé
   - npm install n'a pas été exécuté
   - Vous êtes dans le mauvais dossier
