# 2NB Digital - Site Web & API

Site web et API backend pour l'entreprise 2NB Digital.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (installé et en cours d'exécution)
- npm ou yarn

### Installation

1. **Cloner le projet** (si nécessaire)

2. **Installer les dépendances frontend** :
```bash
npm install
```

3. **Installer les dépendances backend** :
```bash
cd server
npm install
```

4. **Configurer la base de données** :
   - Créer un fichier `.env` dans le dossier `server`
   - Ajouter les variables suivantes :
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/2nb_digital?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production
   JWT_EXPIRES_IN=7d
   ```

5. **Initialiser la base de données** :
```bash
cd server
npm run db:generate
npm run db:migrate
npm run create-default-admin
```

6. **Démarrer les serveurs** :

   **Backend** (dans un terminal) :
   ```bash
   cd server
   npm run dev
   ```

   **Frontend** (dans un autre terminal) :
   ```bash
   npm run dev
   ```

## 📁 Structure du projet

```
2nb-digital-site/
├── src/                    # Code source frontend
│   ├── layouts/           # Layouts (Entreprise, Admin)
│   ├── views/             # Pages du site
│   ├── components/        # Composants React
│   ├── services/          # Services API
│   ├── routes/            # Configuration des routes
│   └── contexts/          # Contextes React (Auth)
├── server/                # Backend API
│   ├── routes/            # Routes API
│   ├── middleware/        # Middlewares (auth)
│   ├── prisma/            # Schéma et migrations Prisma
│   └── scripts/          # Scripts utilitaires
└── README.md              # Ce fichier
```

## 🔐 Authentification Admin

### Identifiants par défaut

- **Nom d'utilisateur** : `christian`
- **Mot de passe** : `j20023700`

### Accès au dashboard admin

Une fois le serveur démarré, accédez à :
```
http://localhost:5173/admin/login
```

### Créer l'admin par défaut

Si l'admin n'existe pas encore :
```bash
cd server
npm run create-default-admin
```

## 📡 API Endpoints

### Services
- `GET /api/services` - Liste tous les services
- `GET /api/services/:id` - Récupère un service
- `POST /api/services` - Crée un service (admin)
- `PUT /api/services/:id` - Met à jour un service (admin)
- `DELETE /api/services/:id` - Supprime un service (admin)

### Projets
- `GET /api/projects` - Liste tous les projets (`?category=Web`)
- `GET /api/projects/:id` - Récupère un projet
- `POST /api/projects` - Crée un projet (admin)
- `PUT /api/projects/:id` - Met à jour un projet (admin)
- `DELETE /api/projects/:id` - Supprime un projet (admin)

### Articles
- `GET /api/articles` - Liste tous les articles (`?published=true&category=Technologie`)
- `GET /api/articles/:id` - Récupère un article
- `POST /api/articles` - Crée un article (admin)
- `PUT /api/articles/:id` - Met à jour un article (admin)
- `DELETE /api/articles/:id` - Supprime un article (admin)

### Partenaires
- `GET /api/partners` - Liste tous les partenaires
- `GET /api/partners/:id` - Récupère un partenaire
- `POST /api/partners` - Crée un partenaire (admin)
- `PUT /api/partners/:id` - Met à jour un partenaire (admin)
- `DELETE /api/partners/:id` - Supprime un partenaire (admin)

### Authentification
- `POST /api/auth/login` - Connexion admin
- `POST /api/auth/verify` - Vérification du token
- `POST /api/auth/logout` - Déconnexion

**Note** : Les routes POST, PUT, DELETE nécessitent une authentification (token JWT).

## 🌐 Pages du site

- `/` - Accueil
- `/services` - Services
- `/realisations` - Réalisations
- `/realisations/:id` - Détail d'un projet
- `/actualites` - Actualités/Blog
- `/actualites/:id` - Détail d'un article
- `/contact` - Contact
- `/admin/login` - Connexion admin
- `/admin` - Dashboard admin (protégé)

## 🛠️ Commandes utiles

### Frontend
```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build pour la production
```

### Backend
```bash
cd server
npm run dev                    # Démarre le serveur API
npm run db:migrate            # Crée/applique les migrations
npm run db:generate           # Génère le client Prisma
npm run db:studio             # Ouvre Prisma Studio
npm run create-default-admin  # Crée l'admin par défaut
```

## 🗄️ Base de données

Le projet utilise Prisma ORM avec PostgreSQL. Les modèles disponibles :

- **Service** : Services proposés par l'entreprise
- **Project** : Projets réalisés (avec images/vidéos)
- **Article** : Articles de blog (avec statut publié/brouillon)
- **Partner** : Partenaires de l'entreprise
- **Admin** : Comptes administrateurs

### Visualiser la base de données

```bash
cd server
npm run db:studio
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 7 jours (configurable)
- Les routes sensibles sont protégées par middleware
- Les routes GET sont publiques, les routes POST/PUT/DELETE nécessitent une authentification

## 📝 Notes

- Le serveur backend tourne sur `http://localhost:3001`
- Le frontend tourne sur `http://localhost:5173`
- Assurez-vous que PostgreSQL est en cours d'exécution avant de lancer les migrations

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez la variable `DATABASE_URL` dans `.env`
- Arrêtez tous les processus Node.js si nécessaire : `Get-Process node | Stop-Process -Force`

### Erreur "Token manquant"
- Vérifiez que vous êtes connecté
- Videz le localStorage et reconnectez-vous

### Erreur de migration
- Arrêtez tous les processus Node.js
- Vérifiez que PostgreSQL est accessible
- Réessayez `npm run db:migrate`