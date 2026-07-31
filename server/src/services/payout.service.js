const db = require('../db');

// La mise (amount) a deja ete debitee du solde au moment du pari (voir
// bets.controller.js). A la resolution, on credite donc uniquement le gain
// des gagnants : amount * odds_at_bet_time. Les perdants ne recuperent rien,
// leur solde a deja ete ampute de leur mise.
const resolveEvent = db.transaction((eventId, winningOutcomeId) => {
  const outcomes = db.prepare('SELECT id FROM outcomes WHERE event_id = ?').all(eventId);
  const outcomeIds = outcomes.map((o) => o.id);

  const allBets = db
    .prepare(`SELECT * FROM bets WHERE outcome_id IN (${outcomeIds.map(() => '?').join(',')})`)
    .all(...outcomeIds);

  const markWon = db.prepare('UPDATE bets SET result = ?, payout = ? WHERE id = ?');
  const creditPlayer = db.prepare('UPDATE players SET balance = balance + ? WHERE id = ?');

  for (const bet of allBets) {
    if (bet.outcome_id === winningOutcomeId) {
      const payout = Math.round(bet.amount * bet.odds_at_bet_time);
      markWon.run('won', payout, bet.id);
      creditPlayer.run(payout, bet.player_id);
    } else {
      markWon.run('lost', 0, bet.id);
    }
  }

  db.prepare(
    `UPDATE events SET status = 'resolved', resolved_outcome_id = ?, resolved_at = datetime('now') WHERE id = ?`
  ).run(winningOutcomeId, eventId);
});

module.exports = { resolveEvent };
