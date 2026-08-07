# Site de 2NB Digital

Le site public de l'agence, et l'interface d'administration qui l'alimente. Front React et TypeScript, API Node adossée à Supabase, le tout dans un seul dépôt.

Rien n'est codé en dur côté contenu : services, réalisations, actualités, témoignages, partenaires et promotions se gèrent depuis l'administration, sans redéploiement.

## Les deux faces

### Côté visiteur

| Page | Contenu |
| --- | --- |
| Accueil | Présentation, services mis en avant, témoignages, partenaires |
| Services | Le catalogue, servi depuis la base |
| Réalisations | Les projets, avec une page de détail par projet |
| Actualités | Les articles, avec une page de détail par article |
| Contact | Formulaire de prise de contact |
| Mentions légales · Confidentialité | Pages réglementaires |

### Côté administration

Derrière une authentification, un tableau de bord et une gestion complète pour chacune des six collections : articles, services, réalisations, témoignages, partenaires et promotions. Plus une section de configuration générale du site.

L'accès est gardé par `ProtectedRoute` côté interface et par un intergiciel d'authentification côté serveur — les deux, parce que cacher un bouton ne protège pas une route d'API.

## Architecture

```
src/          interface React + TypeScript
  views/        pages publiques et écrans d'administration
  components/   composants partagés et animations
  routes/       routage
server/       API Node/Express
  routes/       une route par collection, plus auth et upload
  middleware/   authentification, cache
  utils/        cache, génération de slugs
  migrations/   évolutions du schéma
  lib/          client Supabase
```

## Quelques choix

**Les slugs plutôt que les identifiants.** Les articles et projets sont adressés par un slug lisible, pas par un UUID. Le répertoire `migrations/` en garde la trace : ajout des colonnes, puis correction des slugs cassés, puis troncature de ceux qui étaient trop longs. Une décision de référencement qui a demandé trois passes pour être propre.

**L'analytique attend le consentement.** `ConsentBanner` conditionne le chargement de Google Analytics. Le script n'est pas simplement masqué : il n'est pas chargé tant que le visiteur n'a pas accepté.

**Un cache côté serveur.** Un intergiciel dédié évite de retaper Supabase à chaque affichage d'une liste qui bouge peu.

**Les vidéos YouTube en chargement différé.** `YoutubeLazyEmbed` remplace l'iframe par une vignette jusqu'au clic — un lecteur YouTube embarqué coûte cher au chargement d'une page d'accueil.

## Interface et animations

La bibliothèque de composants partagés fait une bonne part de l'identité visuelle : curseur personnalisé, étincelles au clic, texte qui se compose lettre par lettre, cartes inclinées au survol, bordures animées, défilement continu des logos partenaires. GSAP et Framer Motion pour le mouvement, Flowbite et Tailwind pour le socle.

## Mise en route

```bash
npm install
npm run dev
```

L'API se lance séparément :

```bash
cd server
npm install
npm start
```

Les deux ont besoin d'un `.env` — clés Supabase côté serveur, adresse de l'API côté interface. Le premier compte administrateur se crée avec `node server/scripts/createDefaultAdmin.js`.

## Pile technique

**Interface** — React, TypeScript, Vite, Tailwind, Flowbite, Framer Motion, GSAP, React Router

**Serveur** — Node, Express, Supabase

**Contenu** — rendu Markdown des articles via `react-markdown`
