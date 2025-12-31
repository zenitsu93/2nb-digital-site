# Site 2NB Digital

Site web de l'entreprise 2NB Digital - Version isolée et allégée

## Structure

Ce dossier contient uniquement les fichiers nécessaires pour le site 2NB Digital, sans les fichiers du template de base.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Structure des fichiers

- `src/` - Code source du site
  - `layouts/entreprise/` - Layout principal (Header, Footer, EntrepriseLayout)
  - `views/` - Pages du site (Accueil, Services, Réalisations, Actualités, Contact)
  - `components/entreprise/` - Composants spécifiques (Logo, Testimonials, Features)
  - `components/shared/` - Composants partagés (CardBox)
  - `routes/` - Configuration des routes
  - `css/` - Styles globaux
  - `utils/theme/` - Configuration du thème Flowbite

## Pages disponibles

- `/` - Accueil
- `/services` - Services
- `/realisations` - Réalisations
- `/realisations/:id` - Détail d'un projet
- `/actualites` - Actualités/Blog
- `/actualites/:id` - Détail d'un article
- `/contact` - Contact


