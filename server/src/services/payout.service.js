const db = require('../db');

// La mise (amount) a deja ete debitee du solde au moment du pari (voir
// bets.controller.js). A la resolution, on credite donc uniquement le gain
// des gagnants : amount * odds_at_bet_time. Les perdants ne recuperent rien,
// leur solde a deja ete ampute de leur mise.
async function resolveEvent(eventId, winningOutcomeId) {
  await db.withTransaction(async (client) => {
    const { rows: outcomes } = await client.query('SELECT id FROM outcomes WHERE event_id = $1', [eventId]);
    const outcomeIds = outcomes.map((o) => o.id);

    const { rows: allBets } = await client.query('SELECT * FROM bets WHERE outcome_id = ANY($1::int[])', [
      outcomeIds,
    ]);

    for (const bet of allBets) {
      if (bet.outcome_id === winningOutcomeId) {
        const payout = Math.round(bet.amount * bet.odds_at_bet_time);
        await client.query('UPDATE bets SET result = $1, payout = $2 WHERE id = $3', ['won', payout, bet.id]);
        await client.query('UPDATE players SET balance = balance + $1 WHERE id = $2', [payout, bet.player_id]);
      } else {
        await client.query('UPDATE bets SET result = $1, payout = $2 WHERE id = $3', ['lost', 0, bet.id]);
      }
    }

    await client.query(
      `UPDATE events SET status = 'resolved', resolved_outcome_id = $1, resolved_at = now() WHERE id = $2`,
      [winningOutcomeId, eventId]
    );
  });
}

module.exports = { resolveEvent };
