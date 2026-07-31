const db = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// Place une mise : verifie que le pari est ouvert, que la deadline n'est pas
// depassee et que le joueur a assez de solde, puis debite immediatement le
// solde (evite qu'un joueur mise plusieurs fois plus que ce qu'il possede).
const placeBet = db.transaction((player, outcomeId, amount) => {
  const outcome = db.prepare('SELECT * FROM outcomes WHERE id = ?').get(outcomeId);
  if (!outcome) {
    throw new HttpError(404, 'Issue introuvable');
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(outcome.event_id);
  if (event.status !== 'open') {
    throw new HttpError(409, "Ce pari n'accepte plus de mises");
  }
  if (event.betting_deadline && new Date(event.betting_deadline) < new Date()) {
    throw new HttpError(409, 'La date limite de mise est depassee');
  }

  if (amount > player.balance) {
    throw new HttpError(400, 'Solde insuffisant');
  }

  db.prepare('UPDATE players SET balance = balance - ? WHERE id = ?').run(amount, player.id);

  const info = db
    .prepare(
      `INSERT INTO bets (player_id, outcome_id, amount, odds_at_bet_time)
       VALUES (?, ?, ?, ?)`
    )
    .run(player.id, outcomeId, amount, outcome.odds);

  return info.lastInsertRowid;
});

function createBet(req, res) {
  const { outcomeId, amount } = req.body;
  const parsedAmount = Number(amount);

  if (!outcomeId) {
    throw new HttpError(400, 'outcomeId requis');
  }
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    throw new HttpError(400, 'La mise doit etre un nombre entier positif');
  }

  const betId = placeBet(req.player, outcomeId, parsedAmount);

  const row = db
    .prepare(
      `SELECT bets.*, players.balance AS playerBalance
       FROM bets JOIN players ON players.id = bets.player_id
       WHERE bets.id = ?`
    )
    .get(betId);

  res.status(201).json({
    id: row.id,
    playerId: row.player_id,
    outcomeId: row.outcome_id,
    amount: row.amount,
    oddsAtBetTime: row.odds_at_bet_time,
    placedAt: row.placed_at,
    result: row.result,
    playerBalance: row.playerBalance,
  });
}

module.exports = { createBet };
