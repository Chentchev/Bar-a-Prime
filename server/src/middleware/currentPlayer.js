const db = require('../db');

// Le joueur courant est identifie par un header x-player-id (uuid stocke
// cote client en localStorage). Pas de session/mot de passe : c'est un
// groupe ferme entre potes, la securite n'a pas besoin d'etre poussee.
async function currentPlayer(req, res, next) {
  const playerId = req.header('x-player-id');
  if (playerId) {
    const { rows } = await db.query('SELECT * FROM players WHERE id = $1', [playerId]);
    req.player = rows[0] || null;
  } else {
    req.player = null;
  }
  next();
}

function requirePlayer(req, res, next) {
  if (!req.player) {
    return res.status(401).json({ error: 'Profil joueur requis (header x-player-id manquant ou invalide)' });
  }
  next();
}

module.exports = { currentPlayer, requirePlayer };
