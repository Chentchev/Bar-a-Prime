# Bar à Prime

Web app "pronos entre potes" : on parie des points virtuels sur ce qui va se passer pendant le séjour, avec des cotes fixées à la main par les admins.

## Stack

- **Backend** : Node.js / Express + SQLite (`better-sqlite3`)
- **Frontend** : React + Vite + Tailwind CSS v4 + React Router

## Backend

```bash
cd server
cp .env.example .env   # ajuster ADMIN_PSEUDOS avec les pseudos des admins
npm install
npm start               # ou npm run dev (redémarre au changement de fichier)
```

L'API écoute sur `http://localhost:3001` (configurable via `PORT`). La base SQLite est créée automatiquement dans `server/data/pronos.db` au premier lancement.

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

Depuis la racine :

```bash
npm run install:all   # installe server + client
npm run dev            # lance les deux en parallèle (concurrently)
```

## Déploiement (self-hosted ou Render/Railway)

En production, le backend sert directement le build du frontend : un seul process, un seul port, rien d'autre à configurer côté hébergeur.

```bash
npm run install:all
npm run build   # build le client dans client/dist
npm start        # démarre express, qui sert l'API + le front sur le même port (PORT, def. 3001)
```

Sur Render/Railway : un seul service Node, build command `npm run install:all && npm run build`, start command `npm start`, variable d'env `ADMIN_PSEUDOS` (et `PORT` si besoin). La base SQLite vit dans `server/data/` — pensez à un disque persistant si l'hébergeur redémarre le conteneur entre les déploiements, sinon les points repartent de zéro.

## Installer l'app sur son téléphone (PWA)

L'app est une PWA installable : pas de store, pas de compte développeur. Une fois le site ouvert (en local sur le même WiFi ou déployé sur Render/Railway) :

- **Android (Chrome)** : menu ⋮ → "Installer l'application" (ou un bandeau propose direct l'installation).
- **iPhone (Safari)** : bouton Partager 􀈂 → "Sur l'écran d'accueil".

Ça ajoute une icône comme une vraie app (plein écran, sans barre d'adresse). Le service worker précharge l'interface pour un démarrage rapide, mais les données (paris, mises, soldes) viennent toujours du réseau en direct — pas de mode hors-ligne pour jouer, juste pour l'affichage de l'app.
