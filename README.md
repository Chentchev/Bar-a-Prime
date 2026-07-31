# Bar à Prime

Web app "pronos entre potes" : on parie des points virtuels sur ce qui va se passer pendant le séjour, avec des cotes fixées à la main par les admins.

## Stack

- **Backend** : Node.js / Express + SQLite (`better-sqlite3`)
- **Frontend** : React + Vite + Tailwind (à venir)

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

À venir.
