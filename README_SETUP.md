# Guide de Configuration - PostgreSQL et Backend

Ce guide vous aidera à configurer PostgreSQL et le backend pour votre site 2NB Digital.

## Étape 1 : Configuration PostgreSQL

1. **Créer la base de données** :
   - Ouvrez pgAdmin ou utilisez la ligne de commande `psql`
   - Créez une nouvelle base de données nommée `2nb_digital`

2. **Via psql (ligne de commande)** :
```sql
CREATE DATABASE "2nb_digital";
```

3. **Notez vos informations de connexion** :
   - Host: `localhost` (par défaut)
   - Port: `5432` (par défaut)
   - Database: `2nb_digital`
   - Username: votre nom d'utilisateur PostgreSQL
   - Password: votre mot de passe PostgreSQL

## Étape 2 : Configuration du Backend

1. **Aller dans le dossier server** :
```bash
cd server
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Créer le fichier .env** :
   - Créez un fichier `.env` dans le dossier `server`
   - Ajoutez le contenu suivant en remplaçant avec vos informations :
   ```
   DATABASE_URL="postgresql://VOTRE_USERNAME:VOTRE_PASSWORD@localhost:5432/2nb_digital?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

   Exemple :
   ```
   DATABASE_URL="postgresql://postgres:monmotdepasse@localhost:5432/2nb_digital?schema=public"
   ```

4. **Initialiser la base de données** :
```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans PostgreSQL
npm run db:migrate

# (Optionnel) Ajouter des données de test
npm run db:seed
```

## Étape 3 : Démarrer le Backend

```bash
npm run dev
```

Le serveur API sera accessible sur `http://localhost:3001`

## Étape 4 : Configuration du Frontend

1. **Créer un fichier .env à la racine du projet** (si pas déjà présent) :
```
VITE_API_URL=http://localhost:3001/api
```

2. **Démarrer le frontend** (dans un autre terminal) :
```bash
npm run dev
```

## Étape 5 : Accéder à l'Interface Admin

1. Ouvrez votre navigateur et allez sur `http://localhost:5173/admin`
2. Vous pouvez maintenant :
   - Gérer les services
   - Gérer les projets (avec images/vidéos)
   - Gérer les articles de blog

## Vérification

Pour vérifier que tout fonctionne :

1. **Backend** : Visitez `http://localhost:3001/api/health` - vous devriez voir `{"status":"ok","message":"API is running"}`

2. **Frontend** : Les pages Services, Réalisations et Actualités devraient charger les données depuis la base de données

3. **Admin** : Connectez-vous à `/admin` et créez/modifiez des éléments

## Dépannage

### Erreur de connexion à PostgreSQL
- Vérifiez que PostgreSQL est bien démarré
- Vérifiez vos identifiants dans le fichier `.env`
- Vérifiez que la base de données `2nb_digital` existe

### Erreur "Prisma Client not generated"
- Exécutez `npm run db:generate` dans le dossier `server`

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL de votre frontend

### Les données ne s'affichent pas
- Vérifiez que le backend est bien démarré
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que `VITE_API_URL` est bien configuré dans le `.env` du frontend

