# Bar à Prime

Web app "pronos entre potes" : on parie des points virtuels sur ce qui va se passer pendant le séjour, avec des cotes fixées à la main par les admins.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/chentchev/bar-a-prime)

## Stack

- **Backend** : Node.js / Express + PostgreSQL (`pg`)
- **Frontend** : React + Vite + Tailwind CSS v4 + React Router, installable en PWA

## Backend

Il faut un Postgres accessible. En local, le plus simple est d'en lancer un via Docker :

```bash
docker run --name bar-a-prime-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bar_a_prime -p 5432:5432 -d postgres:16
```

Puis :

```bash
cd server
cp .env.example .env   # ajuster DATABASE_URL et ADMIN_PSEUDOS
npm install
npm start               # ou npm run dev (redémarre au changement de fichier)
```

L'API écoute sur `http://localhost:3001` (configurable via `PORT`). Les tables sont créées automatiquement au démarrage si elles n'existent pas encore (`server/src/db/schema.sql`).

### Identification

Pas de mot de passe : un joueur crée son profil (`POST /api/players`) et récupère un `id`. Cet `id` doit ensuite être envoyé dans le header `x-player-id` sur les requêtes qui en ont besoin (miser, créer/résoudre un pari en admin). Les pseudos listés dans `ADMIN_PSEUDOS` (env) deviennent admin dès la création de leur profil.

### Endpoints principaux

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/players` | Créer un profil (`{ pseudo }`) |
| GET | `/api/players` | Lister les profils existants |
| GET | `/api/players/:id/bets` | Historique des paris d'un joueur |
| GET | `/api/leaderboard` | Classement par solde |
| GET | `/api/events` | Lister les paris (`?status=open`) |
| POST | `/api/events` | Créer un pari (admin) |
| PATCH | `/api/events/:id` | Ouvrir/clôturer/éditer un pari (admin) |
| POST | `/api/events/:id/resolve` | Résoudre un pari et redistribuer les gains (admin) |
| POST | `/api/bets` | Miser sur une issue |
| GET | `/api/players/:id/pending-events` | Paris ouverts sur lesquels ce joueur n'a pas encore misé |
| GET | `/api/config` | Réglages exposés au frontend (`minBetAmount`, `startingBalance`) |
| POST | `/api/admin/reset` | Réinitialise la partie : vide paris/mises, remet les soldes à `STARTING_BALANCE` (admin) |

### Règle : mise obligatoire

Chaque pari ouvert doit recevoir au moins `MIN_BET_AMOUNT` points (défaut 10, configurable en env) de la part de chaque joueur. Tant qu'il reste des paris non couverts, le frontend affiche un écran plein écran non fermable (sauf pour changer de profil) obligeant à choisir une issue et miser dessus — jamais de mise automatique choisie par le système, c'est toujours au joueur de trancher. Un joueur dont le solde passe sous ce minimum est exempté (impossible d'exiger ce qu'il n'a plus).

## Frontend

```bash
cd client
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173` (le dev server proxy `/api` vers `http://localhost:3001`, donc lancez aussi le backend en parallèle).

- **Profil** : pas de mot de passe, le choix/création du pseudo est proposé au premier accès et l'id du joueur est gardé en `localStorage`.
- **Pages** : Paris (liste filtrable ouverts/clôturés/résolus), détail d'un pari avec mise, Classement, Mon profil (solde + historique), Admin (création/clôture/résolution — visible seulement si `isAdmin`).
- **"Temps réel"** : polling léger (toutes les 4-6s) sur les listes et le classement, pas de websockets.

## Tout lancer en une commande (dev)

Depuis la racine (Postgres doit déjà tourner, cf. plus haut) :

```bash
npm run install:all   # installe server + client
npm run dev            # lance les deux en parallèle (concurrently)
```

## Déploiement gratuit sur Render (recommandé)

Le bouton en haut du README déploie directement le blueprint `render.yaml` : un service web Node (build `npm run install:all && npm run build`, start `npm start`) + une base Postgres gratuite, reliés automatiquement via `DATABASE_URL`.

Pourquoi Postgres plutôt que SQLite : les services web gratuits de Render redémarrent à zéro après une période d'inactivité (le disque local n'est pas persistant sur ce plan), ce qui aurait remis les scores à zéro entre deux sessions de jeu. La base Postgres gratuite, elle, est un service managé à part qui garde ses données indépendamment des redémarrages du serveur web — parfait pour un séjour de plusieurs jours. Seule limite : une base Postgres gratuite Render expire au bout de 30 jours, largement suffisant pour des vacances.

Après le déploiement, va dans les paramètres du service pour ajuster `ADMIN_PSEUDOS` avec les pseudos de vos admins, puis partage l'URL Render à tes potes.

## Déploiement self-hosted (PC perso)

En production, le backend sert directement le build du frontend : un seul process, un seul port.

```bash
npm run install:all
npm run build   # build le client dans client/dist
npm start        # démarre express, qui sert l'API + le front sur le même port (PORT, def. 3001)
```

Il faut toujours un `DATABASE_URL` valide (Postgres local via Docker, ou une instance distante).

## Installer l'app sur son téléphone (PWA)

L'app est une PWA installable : pas de store, pas de compte développeur. Une fois le site ouvert (Render ou même WiFi local) :

- **Android (Chrome)** : menu ⋮ → "Installer l'application" (ou un bandeau propose direct l'installation).
- **iPhone (Safari)** : bouton Partager 􀈂 → "Sur l'écran d'accueil".

Ça ajoute une icône comme une vraie app (plein écran, sans barre d'adresse). Le service worker précharge l'interface pour un démarrage rapide, mais les données (paris, mises, soldes) viennent toujours du réseau en direct — pas de mode hors-ligne pour jouer, juste pour l'affichage de l'app.
