# Instructions pour finaliser le site isolé 2NB Digital

## ✅ Fichiers déjà créés

Les fichiers suivants ont déjà été créés dans `2nb-digital-site/` :
- Configuration (package.json, vite.config.ts, tsconfig.json, index.html)
- App.tsx, main.tsx
- Router.tsx
- Loadable.tsx
- Spinner.tsx et spinner.css
- CardBox.tsx
- CSS (globals.css, layouts, override)

## 📋 Fichiers à copier manuellement

### Option 1 : Utiliser le script PowerShell (Recommandé)

1. Ouvrez PowerShell dans le dossier `2nb-digital-site/`
2. Exécutez : `.\copy-files.ps1`
3. Le script copiera automatiquement tous les fichiers nécessaires

### Option 2 : Copie manuelle

Copiez les fichiers suivants depuis `package/src/` vers `2nb-digital-site/src/` :

#### 1. Layouts
```
layouts/entreprise/EntrepriseLayout.tsx
layouts/entreprise/Header.tsx
layouts/entreprise/Footer.tsx
```

#### 2. Views (Pages)
```
views/accueil/Accueil.tsx
views/services/Services.tsx
views/realisations/Realisations.tsx
views/realisations/ProjetDetail.tsx
views/actualites/Actualites.tsx
views/actualites/ArticleDetail.tsx
views/contact/Contact.tsx
```

#### 3. Components
```
components/entreprise/Logo.tsx
components/entreprise/Testimonials.tsx
components/entreprise/Features.tsx
```

#### 4. Utils
```
utils/theme/custom-theme.tsx
```

#### 5. Assets (optionnel - seulement les images utilisées)
```
assets/images/blog/ (toutes les images)
assets/images/profile/ (images de profil)
assets/logo-icon.svg
```

Copiez aussi `logo-icon.svg` dans `public/`

## 🚀 Après la copie

1. **Installer les dépendances** :
   ```bash
   cd 2nb-digital-site
   npm install
   ```

2. **Placer votre logo** :
   - Placez votre logo dans `public/logo.png`
   - Le composant Logo l'utilisera automatiquement

3. **Lancer le site** :
   ```bash
   npm run dev
   ```

## 📁 Structure finale

```
2nb-digital-site/
├── public/
│   ├── logo.png (votre logo)
│   └── logo-icon.svg
├── src/
│   ├── layouts/
│   │   ├── entreprise/
│   │   │   ├── EntrepriseLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── full/shared/loadable/
│   │       └── Loadable.tsx
│   ├── views/
│   │   ├── accueil/
│   │   ├── services/
│   │   ├── realisations/
│   │   ├── actualites/
│   │   ├── contact/
│   │   └── spinner/
│   ├── components/
│   │   ├── entreprise/
│   │   └── shared/
│   ├── routes/
│   ├── css/
│   ├── utils/
│   └── assets/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── README.md
```

## ✨ Avantages

- **Léger** : Seulement les fichiers nécessaires
- **Portable** : Facile à partager
- **Propre** : Pas de fichiers du template inutilisés
- **Autonome** : Fonctionne indépendamment du template

