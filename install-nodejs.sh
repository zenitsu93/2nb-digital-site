#!/bin/bash

# Script d'installation de Node.js via nvm pour O2Switch
# Exécutez ce script si Node.js n'est pas installé

set -e

echo "🔧 Installation de Node.js via nvm..."

# Vérifier si nvm est déjà installé
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "✅ nvm est déjà installé"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
else
    echo "📥 Installation de nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Charger nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Installer Node.js 20
echo ""
echo "📦 Installation de Node.js 20..."
nvm install 20
nvm use 20
nvm alias default 20

# Vérifier l'installation
echo ""
echo "✅ Installation terminée!"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"

# Ajouter nvm au .bashrc si ce n'est pas déjà fait
if ! grep -q "NVM_DIR" "$HOME/.bashrc" 2>/dev/null; then
    echo ""
    echo "📝 Ajout de nvm au .bashrc..."
    cat >> "$HOME/.bashrc" << 'EOF'

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
    echo "✅ nvm ajouté au .bashrc"
    echo "   Rechargez votre session SSH ou exécutez: source ~/.bashrc"
fi

echo ""
echo "🎉 Node.js est maintenant installé et configuré!"
echo ""
echo "📋 Pour utiliser Node.js dans un nouveau terminal:"
echo "   source ~/.bashrc"
echo "   nvm use 20"
