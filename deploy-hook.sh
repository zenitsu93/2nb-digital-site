#!/bin/bash

# Script de déploiement automatique pour O2Switch
# Ce script est exécuté automatiquement après chaque git pull
# Placez ce fichier dans .git/hooks/post-receive et rendez-le exécutable

set -e  # Arrêter en cas d'erreur

# Configuration
PROJECT_DIR="/home/cire1827/2nb-digital-site"
SERVER_DIR="$PROJECT_DIR/server"

echo "🚀 Démarrage du déploiement automatique..."
echo "📁 Dossier du projet: $PROJECT_DIR"

# Aller dans le dossier du projet
cd "$PROJECT_DIR" || exit 1

# Charger Node.js/npm - Essayer plusieurs méthodes
echo ""
echo "🔍 Recherche de Node.js/npm..."

# Méthode 1: Charger nvm si disponible
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📦 Chargement de nvm..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    # Utiliser la version par défaut ou Node 20
    nvm use default 2>/dev/null || nvm use 20 2>/dev/null || nvm use node 2>/dev/null || true
fi

# Méthode 2: Chercher dans les chemins communs
if ! command -v npm &> /dev/null; then
    # Chemins communs pour Node.js sur O2Switch
    NODE_PATHS=(
        "/usr/local/bin/node"
        "/usr/bin/node"
        "$HOME/.nvm/versions/node/*/bin/node"
        "$HOME/nodejs/bin/node"
        "/opt/nodejs/bin/node"
    )
    
    for NODE_PATH in "${NODE_PATHS[@]}"; do
        if [ -f "$NODE_PATH" ] || [ -d "$(dirname "$NODE_PATH")" ]; then
            NODE_DIR="$(dirname "$NODE_PATH")"
            if [ -f "$NODE_DIR/npm" ]; then
                echo "✅ Node.js trouvé dans: $NODE_DIR"
                export PATH="$NODE_DIR:$PATH"
                break
            fi
        fi
    done
fi

# Vérifier que npm est maintenant disponible
if ! command -v npm &> /dev/null; then
    echo ""
    echo "❌ ERREUR: npm n'est pas trouvé!"
    echo ""
    echo "📋 Solutions possibles:"
    echo "   1. Installer Node.js via nvm:"
    echo "      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "      source ~/.bashrc"
    echo "      nvm install 20"
    echo "      nvm use 20"
    echo ""
    echo "   2. Ou contacter le support O2Switch pour installer Node.js"
    echo ""
    echo "   3. Vérifier où Node.js est installé:"
    echo "      which node"
    echo "      which npm"
    echo "      ls -la ~/.nvm"
    echo ""
    exit 1
fi

# Afficher les versions
echo "✅ Node.js/npm trouvé!"
echo "   Node.js: $(node --version 2>/dev/null || echo 'non disponible')"
echo "   npm: $(npm --version 2>/dev/null || echo 'non disponible')"

# Pull les dernières modifications (si nécessaire)
# Note: Le hook post-receive est appelé après un push, donc le code est déjà là
# Mais on peut faire un pull pour être sûr
echo "📥 Vérification des dernières modifications..."
git fetch origin
git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || echo "⚠️ Branche non trouvée, continuons..."

# Installer les dépendances frontend
echo ""
echo "📦 Installation des dépendances frontend..."
npm ci

# Build du frontend avec l'URL de production
echo ""
echo "🔨 Build du frontend..."
VITE_API_URL=/api npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du frontend"
    exit 1
fi

# Installer les dépendances backend
echo ""
echo "📦 Installation des dépendances backend..."
cd "$SERVER_DIR"
npm ci --production

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances backend"
    exit 1
fi

# Générer le client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

# Appliquer les migrations
echo ""
echo "🗄️ Application des migrations de base de données..."
npm run db:migrate:deploy || echo "⚠️ Migration échouée, vérifiez manuellement"

# Redémarrer l'application avec PM2
echo ""
echo "🔄 Redémarrage de l'application..."
cd "$PROJECT_DIR"

if command -v pm2 &> /dev/null; then
    # Vérifier si l'application est déjà en cours d'exécution
    if pm2 list | grep -q "2nb-digital-api"; then
        echo "🔄 Redémarrage de l'application existante..."
        pm2 restart ecosystem.config.cjs --update-env
    else
        echo "▶️ Démarrage de l'application..."
        pm2 start ecosystem.config.cjs
    fi
    
    # Afficher le statut
    echo ""
    echo "📊 Statut de l'application:"
    pm2 list | grep "2nb-digital-api" || echo "⚠️ Application non trouvée dans PM2"
else
    echo "⚠️ PM2 n'est pas installé, redémarrez manuellement l'application"
    echo "   Pour installer PM2: npm install -g pm2"
    echo "   Pour démarrer: cd $PROJECT_DIR && pm2 start ecosystem.config.cjs"
fi

# Copier .htaccess vers public_html si nécessaire
echo ""
echo "📋 Mise à jour de .htaccess..."
PUBLIC_HTML_DIR="${PUBLIC_HTML_DIR:-$HOME/public_html}"
if [ -d "$PUBLIC_HTML_DIR" ] && [ -f "$PROJECT_DIR/.htaccess" ]; then
    cp "$PROJECT_DIR/.htaccess" "$PUBLIC_HTML_DIR/.htaccess"
    echo "   ✅ .htaccess mis à jour"
elif [ -d "$HOME/domains/2nbdigital.com/public_html" ] && [ -f "$PROJECT_DIR/.htaccess" ]; then
    cp "$PROJECT_DIR/.htaccess" "$HOME/domains/2nbdigital.com/public_html/.htaccess"
    echo "   ✅ .htaccess mis à jour"
fi

echo ""
echo "✅ Déploiement terminé avec succès!"
echo "🌐 Vérifiez votre application sur: https://2nbdigital.com"
