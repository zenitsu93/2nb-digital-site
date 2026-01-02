#!/bin/bash

# Script de déploiement pour O2Switch
# Ce script prépare l'application pour le déploiement en production

echo "🚀 Préparation du déploiement 2NB Digital..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier que nous sommes à la racine du projet
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté à la racine du projet${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installation des dépendances frontend...${NC}"
npm install

echo -e "${YELLOW}🔨 Build du frontend...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erreur: Le build du frontend a échoué (dossier dist introuvable)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build frontend réussi${NC}"

echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
cd server
npm install --production

echo -e "${YELLOW}🔧 Génération du client Prisma...${NC}"
npm run db:generate

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    if [ -f "env.example" ]; then
        echo -e "${YELLOW}📝 Copiez env.example vers .env et remplissez les valeurs${NC}"
        echo -e "${YELLOW}   cp env.example .env${NC}"
    fi
else
    echo -e "${GREEN}✅ Fichier .env trouvé${NC}"
fi

echo -e "${GREEN}✅ Préparation terminée !${NC}"
echo -e "${YELLOW}📝 N'oubliez pas de :${NC}"
echo -e "   1. Configurer le fichier server/.env avec vos variables d'environnement"
echo -e "   2. Appliquer les migrations : cd server && npm run db:migrate"
echo -e "   3. Créer un administrateur : cd server && npm run create-default-admin"
echo -e "   4. Redémarrer l'application Node.js dans le panneau O2Switch"

cd ..
