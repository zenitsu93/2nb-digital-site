#!/bin/bash

# Script d'installation du hook Git pour déploiement automatique
# Exécutez ce script une fois après avoir cloné le dépôt sur O2Switch

set -e

PROJECT_DIR="/home/cire1827/2nb-digital-site"
HOOK_FILE="$PROJECT_DIR/.git/hooks/post-receive"
DEPLOY_SCRIPT="$PROJECT_DIR/deploy-hook.sh"

echo "🔧 Installation du hook Git pour déploiement automatique..."

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "$DEPLOY_SCRIPT" ]; then
    echo "❌ Erreur: deploy-hook.sh non trouvé dans $PROJECT_DIR"
    echo "   Assurez-vous d'être dans le dossier du projet"
    exit 1
fi

# Créer le dossier hooks s'il n'existe pas
mkdir -p "$PROJECT_DIR/.git/hooks"

# Créer le hook post-receive
cat > "$HOOK_FILE" << 'HOOK_EOF'
#!/bin/bash
# Hook Git post-receive pour déploiement automatique O2Switch
cd /home/cire1827/2nb-digital-site
bash deploy-hook.sh
HOOK_EOF

# Rendre les scripts exécutables
chmod +x "$HOOK_FILE"
chmod +x "$DEPLOY_SCRIPT"

echo "✅ Hook Git installé avec succès!"
echo ""
echo "📋 Fichiers créés:"
echo "   - Hook: $HOOK_FILE"
echo "   - Script: $DEPLOY_SCRIPT"
echo ""
echo "🚀 Le déploiement se fera automatiquement après chaque 'git pull'"
echo ""
echo "📝 Pour tester, exécutez:"
echo "   cd $PROJECT_DIR"
echo "   git pull origin main"
echo "   # Le hook s'exécutera automatiquement"
