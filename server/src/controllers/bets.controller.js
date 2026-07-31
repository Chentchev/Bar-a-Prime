const db = require('../db');
const { HttpError } = require('../middleware/errorHandler');

// Place une mise : verifie que le pari est ouvert, que la deadline n'est pas
// depassee et que le joueur a assez de solde, puis debite immediatement le
// solde (evite qu'un joueur mise plusieurs fois plus que ce qu'il possede).
async function placeBet(player, outcomeId, amount) {
  return db.withTransaction(async (client) => {
    const { rows: outcomeRows } = await client.query('SELECT * FROM outcomes WHERE id = $1', [outcomeId]);
    const outcome = outcomeRows[0];
    if (!outcome) {
      throw new HttpError(404, 'Issue introuvable');
    }

    const { rows: eventRows } = await client.query('SELECT * FROM events WHERE id = $1', [outcome.event_id]);
    const event = eventRows[0];
    if (event.status !== 'open') {
      throw new HttpError(409, "Ce pari n'accepte plus de mises");
    }
    if (event.betting_deadline && new Date(event.betting_deadline) < new Date()) {
      throw new HttpError(409, 'La date limite de mise est depassee');
    }

    if (amount > player.balance) {
      throw new HttpError(400, 'Solde insuffisant');
    }

    await client.query('UPDATE players SET balance = balance - $1 WHERE id = $2', [amount, player.id]);

    const { rows } = await client.query(
      `INSERT INTO bets (player_id, outcome_id, amount, odds_at_bet_time)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [player.id, outcomeId, amount, outcome.odds]
    );

    return rows[0].id;
  });
}

async function createBet(req, res) {
  const { outcomeId, amount } = req.body;
  const parsedAmount = Number(amount);

  if (!outcomeId) {
    throw new HttpError(400, 'outcomeId requis');
  }
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    throw new HttpError(400, 'La mise doit etre un nombre entier positif');
  }

  const betId = await placeBet(req.player, outcomeId, parsedAmount);

  const { rows } = await db.query(
    `SELECT bets.*, players.balance AS "playerBalance"
     FROM bets JOIN players ON players.id = bets.player_id
     WHERE bets.id = $1`,
    [betId]
  );
  const row = rows[0];

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
