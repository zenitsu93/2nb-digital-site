# Guide de Configuration - Site 2NB Digital

## ✅ Fichiers copiés

Tous les fichiers nécessaires ont été copiés dans ce dossier isolé.

## 📋 Structure complète

```
2nb-digital-site/
├── public/
│   └── logo-icon.svg (à copier manuellement si nécessaire)
├── src/
│   ├── layouts/
│   │   ├── entreprise/
│   │   │   ├── EntrepriseLayout.tsx ✅
│   │   │   ├── Header.tsx ✅
│   │   │   └── Footer.tsx ✅
│   │   └── full/shared/loadable/
│   │       └── Loadable.tsx ✅
│   ├── views/
│   │   ├── accueil/Accueil.tsx ✅
│   │   ├── services/Services.tsx ✅
│   │   ├── realisations/
│   │   │   ├── Realisations.tsx ✅
│   │   │   └── ProjetDetail.tsx ✅
│   │   ├── actualites/
│   │   │   ├── Actualites.tsx ✅
│   │   │   └── ArticleDetail.tsx ✅
│   │   ├── contact/Contact.tsx ✅
│   │   └── spinner/
│   │       ├── Spinner.tsx ✅
│   │       └── spinner.css ✅
│   ├── components/
│   │   ├── entreprise/
│   │   │   ├── Logo.tsx ✅
│   │   │   ├── Testimonials.tsx ✅
│   │   │   └── Features.tsx ✅
│   │   └── shared/
│   │       └── CardBox.tsx ✅
│   ├── routes/
│   │   └── Router.tsx ✅
│   ├── css/
│   │   ├── globals.css ✅ (avec vos couleurs)
│   │   ├── layouts/ ✅
│   │   └── override/ ✅
│   ├── utils/theme/
│   │   └── custom-theme.tsx ✅
│   └── assets/
│       └── images/ (blog, profile, products) ✅
├── package.json ✅
├── vite.config.ts ✅
├── tsconfig.json ✅
├── index.html ✅
└── README.md ✅
```

## 🚀 Installation et Lancement

1. **Installer les dépendances** :
   ```bash
   cd 2nb-digital-site
   npm install
   ```

2. **Placer votre logo** :
   - Placez votre fichier logo dans `public/logo.png`
   - Le composant Logo l'utilisera automatiquement

3. **Lancer le site** :
   ```bash
   npm run dev
   ```

4. **Build pour production** :
   ```bash
   npm run build
   ```

## 📝 Notes importantes

- **Images** : Les images sont référencées avec `/src/assets/images/...`. Si vous avez des problèmes, vérifiez que les images sont bien copiées dans `src/assets/images/`.
- **Logo** : Placez votre logo dans `public/logo.png` pour qu'il s'affiche automatiquement.
- **Couleurs** : Les couleurs sont configurées dans `src/css/globals.css` avec votre palette (bleu foncé et jaune doré).

## ✨ Avantages de cette structure isolée

- ✅ **Léger** : Seulement les fichiers nécessaires
- ✅ **Portable** : Facile à partager et déployer
- ✅ **Propre** : Pas de fichiers du template inutilisés
- ✅ **Autonome** : Fonctionne indépendamment du template

