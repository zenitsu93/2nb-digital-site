# Instructions pour copier les fichiers

Pour compléter la structure, copiez manuellement les fichiers suivants depuis `package/src/` vers `2nb-digital-site/src/` :

## Fichiers à copier :

1. **Layouts** :
   - `layouts/entreprise/EntrepriseLayout.tsx`
   - `layouts/entreprise/Header.tsx`
   - `layouts/entreprise/Footer.tsx`
   - `layouts/full/shared/loadable/Loadable.tsx`

2. **Views** :
   - `views/accueil/Accueil.tsx`
   - `views/services/Services.tsx`
   - `views/realisations/Realisations.tsx`
   - `views/realisations/ProjetDetail.tsx`
   - `views/actualites/Actualites.tsx`
   - `views/actualites/ArticleDetail.tsx`
   - `views/contact/Contact.tsx`
   - `views/spinner/Spinner.tsx`
   - `views/spinner/spinner.css`

3. **Components** :
   - `components/entreprise/Logo.tsx`
   - `components/entreprise/Testimonials.tsx`
   - `components/entreprise/Features.tsx`
   - `components/shared/CardBox.tsx`

4. **Routes** :
   - `routes/Router.tsx`

5. **CSS** :
   - `css/globals.css`
   - `css/layouts/container.css`
   - `css/layouts/header.css`
   - `css/layouts/sidebar.css`
   - `css/override/reboot.css`

6. **Utils** :
   - `utils/theme/custom-theme.tsx`

7. **Root** :
   - `App.tsx`
   - `main.tsx`

8. **Assets** (optionnel - seulement les images utilisées) :
   - `assets/images/blog/` (toutes les images blog)
   - `assets/images/profile/` (images de profil pour testimonials)
   - `assets/logo-icon.svg`

9. **Public** :
   - Copiez `logo-icon.svg` dans `public/`
   - Placez votre logo dans `public/logo.png`

## Commandes PowerShell pour copier :

```powershell
# Depuis la racine du projet
cd package

# Créer les dossiers
New-Item -ItemType Directory -Force -Path "..\2nb-digital-site\src\layouts\entreprise"
New-Item -ItemType Directory -Force -Path "..\2nb-digital-site\src\layouts\full\shared\loadable"
New-Item -ItemType Directory -Force -Path "..\2nb-digital-site\src\views\accueil"
# ... (continuer pour tous les dossiers)

# Copier les fichiers
Copy-Item "src\layouts\entreprise\*" -Destination "..\2nb-digital-site\src\layouts\entreprise\" -Recurse
Copy-Item "src\layouts\full\shared\loadable\*" -Destination "..\2nb-digital-site\src\layouts\full\shared\loadable\" -Recurse
# ... (continuer pour tous les fichiers)
```

