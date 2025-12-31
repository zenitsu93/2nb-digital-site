# Backend API - 2NB Digital

API backend pour la gestion des services, projets et articles de blog.

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (installé et en cours d'exécution)

## Installation

1. Installer les dépendances :
```bash
cd server
npm install
```

2. Configurer la base de données :
   - Créer un fichier `.env` à la racine du dossier `server`
   - Copier le contenu de `.env.example` et remplir les informations de connexion PostgreSQL :
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/2nb_digital?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. Initialiser la base de données :
```bash
# Générer le client Prisma
npm run db:generate

# Créer les migrations
npm run db:migrate

# (Optionnel) Remplir avec des données de test
npm run db:seed
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## API Endpoints

### Services
- `GET /api/services` - Liste tous les services
- `GET /api/services/:id` - Récupère un service par ID
- `POST /api/services` - Crée un nouveau service
- `PUT /api/services/:id` - Met à jour un service
- `DELETE /api/services/:id` - Supprime un service

### Projets
- `GET /api/projects` - Liste tous les projets (optionnel: `?category=Web`)
- `GET /api/projects/:id` - Récupère un projet par ID
- `POST /api/projects` - Crée un nouveau projet
- `PUT /api/projects/:id` - Met à jour un projet
- `DELETE /api/projects/:id` - Supprime un projet

### Articles
- `GET /api/articles` - Liste tous les articles (optionnel: `?published=true&category=Technologie`)
- `GET /api/articles/:id` - Récupère un article par ID
- `POST /api/articles` - Crée un nouvel article
- `PUT /api/articles/:id` - Met à jour un article
- `DELETE /api/articles/:id` - Supprime un article

## Prisma Studio

Pour visualiser et gérer la base de données via une interface graphique :
```bash
npm run db:studio
```

## Structure de la base de données

- **Service** : Services proposés par l'entreprise
- **Project** : Projets réalisés (avec images/vidéos)
- **Article** : Articles de blog (avec statut publié/brouillon)

