# Réinitialiser le mot de passe PostgreSQL

## Méthode 1 : Via pgAdmin (Recommandé)

1. Ouvrez **pgAdmin**
2. Cliquez sur votre serveur PostgreSQL (généralement "PostgreSQL 15" ou similaire)
3. Si vous êtes connecté, faites un clic droit sur le serveur → **Properties**
4. Allez dans l'onglet **Connection** pour voir/modifier les paramètres
5. Si vous n'êtes pas connecté, vous pouvez réinitialiser via les fichiers de configuration

## Méthode 2 : Réinitialisation via les fichiers de configuration

### Étape 1 : Arrêter le service PostgreSQL

1. Ouvrez **Services** (Win + R, tapez `services.msc`)
2. Trouvez **postgresql-x64-XX** (où XX est votre version)
3. Clic droit → **Stop**

### Étape 2 : Modifier le fichier pg_hba.conf

1. Trouvez le fichier `pg_hba.conf` (généralement dans `C:\Program Files\PostgreSQL\XX\data\`)
2. Ouvrez-le avec un éditeur de texte en tant qu'administrateur
3. Trouvez la ligne qui commence par :
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
4. Remplacez `scram-sha-256` par `trust` :
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```
5. Sauvegardez le fichier

### Étape 3 : Redémarrer PostgreSQL

1. Dans **Services**, redémarrez le service PostgreSQL

### Étape 4 : Se connecter sans mot de passe et changer le mot de passe

Ouvrez PowerShell ou CMD en tant qu'administrateur et exécutez :

```bash
# Se connecter à PostgreSQL (sans mot de passe maintenant)
psql -U postgres

# Une fois connecté, changez le mot de passe :
ALTER USER postgres WITH PASSWORD 'votre_nouveau_mot_de_passe';

# Quittez
\q
```

### Étape 5 : Remettre la sécurité

1. Remettez `scram-sha-256` dans le fichier `pg_hba.conf`
2. Redémarrez le service PostgreSQL

## Méthode 3 : Utiliser un utilisateur Windows

Si PostgreSQL a été installé avec l'authentification Windows activée :

```bash
psql -U votre_nom_utilisateur_windows
```

## Méthode 4 : Réinitialisation complète (si rien ne fonctionne)

Si vous n'avez pas de données importantes :

1. Désinstallez PostgreSQL
2. Supprimez le dossier de données (généralement `C:\Program Files\PostgreSQL\XX\data\`)
3. Réinstallez PostgreSQL avec un nouveau mot de passe

## Après avoir réinitialisé le mot de passe

Mettez à jour votre fichier `.env` dans le dossier `server` :

```
DATABASE_URL="postgresql://postgres:votre_nouveau_mot_de_passe@localhost:5432/2nb_digital?schema=public"
```

