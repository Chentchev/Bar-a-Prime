const db = require('../db');
const { STARTING_BALANCE } = require('../config');

// Reinitialise la partie : supprime tous les paris/issues/mises et remet
// chaque joueur a son solde de depart. Les profils (pseudos, statut admin)
// sont conserves pour que personne n'ait a se reinscrire.
async function resetGame(req, res) {
  await db.withTransaction(async (client) => {
    await client.query('TRUNCATE bets, outcomes, events RESTART IDENTITY CASCADE');
    await client.query('UPDATE players SET balance = $1', [STARTING_BALANCE]);
  });
  res.json({ ok: true });
}

module.exports = { resetGame };
