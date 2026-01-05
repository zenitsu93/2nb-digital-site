# Configuration pour servir tout avec Node.js

## 🎯 Solution : Tout via Node.js

Votre serveur Express sert maintenant :
- ✅ Le frontend React (fichiers statiques depuis `dist/`)
- ✅ L'API backend (`/api/*`)
- ✅ Les uploads (`/uploads/*`)

Tout est accessible sur le port 3001.

## 📋 Configuration Apache

### Étape 1 : Créer le fichier .htaccess

Dans votre dossier `public_html` (ou le dossier de votre domaine) :

```bash
ssh cire1827@109.234.167.45
cd ~/public_html
# OU
cd ~/domains/2nbdigital.com/public_html

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

Sauvegardez : `Ctrl+O`, `Entrée`, `Ctrl+X`

### Étape 2 : Vérifier que mod_proxy est activé

Si ça ne fonctionne pas, contactez le support O2Switch pour activer :
- `mod_proxy`
- `mod_proxy_http`

### Étape 3 : Redémarrer l'application Node.js

```bash
cd ~/2nb-digital-site
pm2 restart 2nb-digital-api
# OU si ce n'est pas encore démarré
pm2 start ecosystem.config.js
```

### Étape 4 : Tester

1. **Tester directement Node.js :**
   ```bash
   curl http://localhost:3001
   curl http://localhost:3001/api/health
   ```

2. **Tester via le domaine :**
   ```bash
   curl https://2nbdigital.com
   curl https://2nbdigital.com/api/health
   ```

3. **Ouvrir dans le navigateur :**
   Allez sur `https://2nbdigital.com` - votre site devrait s'afficher !

## ✅ Avantages de cette approche

- ✅ Tout géré par Node.js (plus simple)
- ✅ Pas besoin de copier les fichiers dans public_html
- ✅ Le frontend se met à jour automatiquement après chaque déploiement
- ✅ Une seule application à gérer (PM2)

## 🔧 Si vous avez des erreurs

### Erreur 502 Bad Gateway

1. Vérifiez que Node.js tourne :
   ```bash
   pm2 list
   pm2 logs 2nb-digital-api
   ```

2. Vérifiez que le port 3001 est accessible :
   ```bash
   curl http://localhost:3001
   ```

3. Vérifiez que mod_proxy est activé (contactez le support O2Switch)

### Le frontend ne s'affiche pas

1. Vérifiez que le dossier `dist/` existe :
   ```bash
   ls -la ~/2nb-digital-site/dist/
   ```

2. Rebuilder le frontend si nécessaire :
   ```bash
   cd ~/2nb-digital-site
   VITE_API_URL=/api npm run build
   ```

3. Redémarrer l'application :
   ```bash
   pm2 restart 2nb-digital-api
   ```

## 📝 Résumé

1. ✅ Le serveur Express sert maintenant le frontend + API
2. ✅ Apache proxifie tout vers `http://localhost:3001`
3. ✅ Tout est accessible sur `https://2nbdigital.com`

C'est tout ! Plus simple et tout en Node.js. 🚀
