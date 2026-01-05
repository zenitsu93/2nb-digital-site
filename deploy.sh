#!/bin/bash

# Configuration O2Switch
# Modifiez ces variables selon votre configuration O2Switch
O2SWITCH_USER="${O2SWITCH_USER:-votre_utilisateur}"
O2SWITCH_HOST="${O2SWITCH_HOST:-votre_serveur.o2switch.net}"
O2SWITCH_DEPLOY_PATH="${O2SWITCH_DEPLOY_PATH:-/home/votre_utilisateur/2nb-digital-site}"
O2SWITCH_URL="${O2SWITCH_URL:-https://votre-domaine.com}"

echo "🚀 Déploiement sur O2Switch..."
echo "📍 Serveur: $O2SWITCH_USER@$O2SWITCH_HOST"
echo "📁 Chemin: $O2SWITCH_DEPLOY_PATH"

# Vérifier que les variables sont définies
if [ "$O2SWITCH_USER" = "votre_utilisateur" ]; then
  echo "❌ Erreur: Veuillez configurer les variables O2SWITCH_USER, O2SWITCH_HOST, O2SWITCH_DEPLOY_PATH"
  exit 1
fi

# Build du frontend
echo ""
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors du build du frontend"
  exit 1
fi

# Préparation du backend
echo ""
echo "🔨 Preparing backend..."
cd server
npm ci --production
if [ $? -ne 0 ]; then
  echo "❌ Erreur lors de l'installation des dépendances backend"
  exit 1
fi

npm run db:generate
if [ $? -ne 0 ]; then
  echo "❌ Erreur lors de la génération du client Prisma"
  exit 1
fi
cd ..

# Synchronisation des fichiers
echo ""
echo "📦 Syncing files..."

# Synchroniser le frontend
rsync -avz --delete dist/ $O2SWITCH_USER@$O2SWITCH_HOST:$O2SWITCH_DEPLOY_PATH/dist/

# Synchroniser le backend (exclure node_modules et .env)
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude '.env.production' --exclude '.git' \
  server/ $O2SWITCH_USER@$O2SWITCH_HOST:$O2SWITCH_DEPLOY_PATH/server/

# Synchroniser les fichiers de configuration
rsync -avz package.json package-lock.json \
  $O2SWITCH_USER@$O2SWITCH_HOST:$O2SWITCH_DEPLOY_PATH/

# Synchroniser ecosystem.config.cjs si présent
if [ -f "ecosystem.config.cjs" ]; then
  rsync -avz ecosystem.config.cjs \
    $O2SWITCH_USER@$O2SWITCH_HOST:$O2SWITCH_DEPLOY_PATH/
fi

# Déploiement sur le serveur
echo ""
echo "📥 Installing dependencies and deploying on server..."
ssh $O2SWITCH_USER@$O2SWITCH_HOST << ENDSSH
set -e
cd $O2SWITCH_DEPLOY_PATH/server

echo "📥 Installing backend dependencies..."
npm ci --production

echo "🔧 Generating Prisma client..."
npm run db:generate

echo "🗄️ Running database migrations..."
npm run db:migrate:deploy || echo "⚠️ Migration failed, check manually"

# Redémarrer avec PM2 si disponible
if command -v pm2 &> /dev/null; then
  echo "🔄 Restarting application with PM2..."
  cd ..
  pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
else
  echo "⚠️ PM2 not found, please restart manually"
fi

ENDSSH

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Déploiement terminé avec succès!"
  echo "🌐 URL: $O2SWITCH_URL"
else
  echo ""
  echo "❌ Erreur lors du déploiement"
  exit 1
fi
