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

# Build du frontend
echo ""
echo "🔨 Build du frontend..."
npm run build

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
        pm2 restart ecosystem.config.js --update-env
    else
        echo "▶️ Démarrage de l'application..."
        pm2 start ecosystem.config.js
    fi
    
    # Afficher le statut
    echo ""
    echo "📊 Statut de l'application:"
    pm2 list | grep "2nb-digital-api" || echo "⚠️ Application non trouvée dans PM2"
else
    echo "⚠️ PM2 n'est pas installé, redémarrez manuellement l'application"
    echo "   Pour installer PM2: npm install -g pm2"
    echo "   Pour démarrer: cd $PROJECT_DIR && pm2 start ecosystem.config.js"
fi

echo ""
echo "✅ Déploiement terminé avec succès!"
echo "🌐 Vérifiez votre application sur: https://votre-domaine.com"
