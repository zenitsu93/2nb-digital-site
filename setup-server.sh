#!/bin/bash

# Script de configuration automatique du serveur O2Switch
# Exécutez ce script une fois après avoir cloné le dépôt

set -e

PROJECT_DIR="/home/cire1827/2nb-digital-site"
SERVER_DIR="$PROJECT_DIR/server"
PUBLIC_HTML_DIR="${PUBLIC_HTML_DIR:-$HOME/public_html}"

echo "🔧 Configuration automatique du serveur O2Switch..."
echo "📁 Dossier du projet: $PROJECT_DIR"

# Charger Node.js/npm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use default 2>/dev/null || nvm use 20 2>/dev/null || true
fi

# Aller dans le dossier du projet
cd "$PROJECT_DIR" || exit 1

# Étape 1: Créer le fichier .env s'il n'existe pas
echo ""
echo "📝 Configuration du fichier .env..."
if [ ! -f "$SERVER_DIR/.env" ]; then
    echo "   Création du fichier .env..."
    
    # Générer un JWT_SECRET
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > "$SERVER_DIR/.env" << EOF
# Base de données PostgreSQL O2Switch
DATABASE_URL="postgresql://cire1827_christian:siriusj20023700@127.0.0.1:5432/cire1827_2nbsite?schema=public"

# Configuration serveur
PORT=3001
NODE_ENV=production

# URL du frontend en production
FRONTEND_URL=https://2nbdigital.com

# JWT Secret (généré automatiquement)
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
EOF
    echo "   ✅ Fichier .env créé avec JWT_SECRET généré"
else
    echo "   ✅ Fichier .env existe déjà"
fi

# Étape 2: Trouver le dossier public_html
echo ""
echo "🔍 Recherche du dossier public_html..."
if [ -d "$HOME/public_html" ]; then
    PUBLIC_HTML_DIR="$HOME/public_html"
    echo "   ✅ Trouvé: $PUBLIC_HTML_DIR"
elif [ -d "$HOME/domains/2nbdigital.com/public_html" ]; then
    PUBLIC_HTML_DIR="$HOME/domains/2nbdigital.com/public_html"
    echo "   ✅ Trouvé: $PUBLIC_HTML_DIR"
elif [ -d "$HOME/www" ]; then
    PUBLIC_HTML_DIR="$HOME/www"
    echo "   ✅ Trouvé: $PUBLIC_HTML_DIR"
else
    echo "   ⚠️ Dossier public_html non trouvé, utilisation de: $PUBLIC_HTML_DIR"
    mkdir -p "$PUBLIC_HTML_DIR"
fi

# Étape 3: Copier .htaccess vers public_html
echo ""
echo "📋 Configuration d'Apache (.htaccess)..."
if [ -f "$PROJECT_DIR/.htaccess" ]; then
    cp "$PROJECT_DIR/.htaccess" "$PUBLIC_HTML_DIR/.htaccess"
    echo "   ✅ .htaccess copié vers $PUBLIC_HTML_DIR"
else
    echo "   ⚠️ Fichier .htaccess non trouvé dans le projet"
fi

# Étape 4: Installer les dépendances backend
echo ""
echo "📦 Installation des dépendances backend..."
cd "$SERVER_DIR"
npm ci --production

# Étape 5: Générer le client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run db:generate

# Étape 6: Appliquer les migrations
echo ""
echo "🗄️ Application des migrations..."
npm run db:migrate:deploy || echo "   ⚠️ Migration échouée ou déjà appliquée"

# Étape 7: Créer l'admin par défaut (si nécessaire)
echo ""
echo "👤 Création de l'admin par défaut..."
npm run create-default-admin || echo "   ⚠️ Admin existe déjà ou erreur"

# Étape 8: Rebuilder le frontend
echo ""
echo "🔨 Build du frontend..."
cd "$PROJECT_DIR"
npm ci
VITE_API_URL=/api npm run build

# Étape 9: Démarrer avec PM2
echo ""
echo "🚀 Démarrage de l'application avec PM2..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "2nb-digital-api"; then
        echo "   🔄 Redémarrage de l'application existante..."
        pm2 restart ecosystem.config.cjs --update-env
    else
        echo "   ▶️ Démarrage de l'application..."
        pm2 start ecosystem.config.cjs
    fi
    
    # Afficher le statut
    echo ""
    echo "📊 Statut de l'application:"
    pm2 list | grep "2nb-digital-api" || echo "   ⚠️ Application non trouvée"
    
    # Configurer PM2 pour démarrer au boot
    echo ""
    echo "⚙️ Configuration de PM2 pour démarrer au boot..."
    pm2 startup 2>/dev/null || echo "   ⚠️ Commande startup déjà exécutée"
    pm2 save
else
    echo "   ⚠️ PM2 n'est pas installé"
    echo "   Installez-le avec: npm install -g pm2"
fi

echo ""
echo "✅ Configuration terminée avec succès!"
echo ""
echo "📋 Résumé:"
echo "   - Fichier .env créé dans: $SERVER_DIR/.env"
echo "   - .htaccess copié vers: $PUBLIC_HTML_DIR/.htaccess"
echo "   - Frontend buildé dans: $PROJECT_DIR/dist"
echo "   - Application démarrée avec PM2"
echo ""
echo "🌐 Testez votre site:"
echo "   - Frontend: https://2nbdigital.com"
echo "   - API: https://2nbdigital.com/api/health"
echo ""
echo "📝 Pour voir les logs:"
echo "   pm2 logs 2nb-digital-api"
