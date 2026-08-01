const db = require('../db');
const { HttpError } = require('../middleware/errorHandler');
const { resolveEvent: resolveEventPayout } = require('../services/payout.service');
const { MIN_BET_AMOUNT } = require('../config');

async function outcomesWithStats(eventId) {
  const { rows } = await db.query(
    `SELECT
      outcomes.id, outcomes.label, outcomes.odds,
      COALESCE(SUM(bets.amount), 0)::int AS "totalStaked",
      COUNT(bets.id)::int AS "betCount"
    FROM outcomes
    LEFT JOIN bets ON bets.outcome_id = outcomes.id
    WHERE outcomes.event_id = $1
    GROUP BY outcomes.id
    ORDER BY outcomes.id`,
    [eventId]
  );
  return rows;
}

async function serializeEvent(row) {
  const outcomes = await outcomesWithStats(row.id);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    bettingDeadline: row.betting_deadline,
    createdBy: row.created_by,
    resolvedOutcomeId: row.resolved_outcome_id,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
    outcomes: outcomes.map((outcome) => ({
      ...outcome,
      isWinner: row.resolved_outcome_id === outcome.id,
    })),
  };
}

async function listEvents(req, res) {
  const { status } = req.query;
  const { rows } = status
    ? await db.query('SELECT * FROM events WHERE status = $1 ORDER BY created_at DESC', [status])
    : await db.query('SELECT * FROM events ORDER BY created_at DESC');
  res.json(await Promise.all(rows.map(serializeEvent)));
}

async function getEvent(req, res) {
  const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  if (!rows[0]) {
    throw new HttpError(404, 'Pari introuvable');
  }
  res.json(await serializeEvent(rows[0]));
}

// Cree un pari avec ses issues possibles (au moins 2), chacune avec sa cote
// fixee a la main par l'admin.
async function createEvent(req, res) {
  const { title, description, category, bettingDeadline, outcomes } = req.body;

  if (!title || !title.trim()) {
    throw new HttpError(400, 'Titre requis');
  }
  if (!Array.isArray(outcomes) || outcomes.length < 2) {
    throw new HttpError(400, 'Il faut au moins deux issues possibles');
  }
  for (const outcome of outcomes) {
    if (!outcome.label || !outcome.label.trim()) {
      throw new HttpError(400, 'Chaque issue doit avoir un libelle');
    }
    const odds = Number(outcome.odds);
    if (!Number.isFinite(odds) || odds < 1) {
      throw new HttpError(400, `Cote invalide pour "${outcome.label}" (minimum 1.0)`);
    }
  }

  const eventId = await db.withTransaction(async (client) => {
    const { rows } = await client.query(
      `INSERT INTO events (title, description, category, betting_deadline, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title.trim(), description || null, category || null, bettingDeadline || null, req.player.id]
    );

    const insertOutcome = 'INSERT INTO outcomes (event_id, label, odds) VALUES ($1, $2, $3)';
    for (const outcome of outcomes) {
      await client.query(insertOutcome, [rows[0].id, outcome.label.trim(), Number(outcome.odds)]);
    }

    return rows[0].id;
  });

  const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
  res.status(201).json(await serializeEvent(rows[0]));
}

// Permet a l'admin de rouvrir/clore les mises, ou d'ajuster les infos tant
// que le pari n'est pas resolu.
async function updateEvent(req, res) {
  const { rows: eventRows } = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  const event = eventRows[0];
  if (!event) {
    throw new HttpError(404, 'Pari introuvable');
  }
  if (event.status === 'resolved') {
    throw new HttpError(409, 'Ce pari est deja resolu, il ne peut plus etre modifie');
  }

  const { status, title, description, category, bettingDeadline } = req.body;
  if (status && !['open', 'closed'].includes(status)) {
    throw new HttpError(400, 'Statut invalide (open ou closed uniquement ici)');
  }

  await db.query(
    `UPDATE events SET
      status = COALESCE($1, status),
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      category = COALESCE($4, category),
      betting_deadline = COALESCE($5, betting_deadline)
    WHERE id = $6`,
    [status || null, title || null, description || null, category || null, bettingDeadline || null, event.id]
  );

  const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [event.id]);
  res.json(await serializeEvent(rows[0]));
}

// Marque l'issue gagnante et declenche la redistribution des points
async function resolveEvent(req, res) {
  const { rows: eventRows } = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  const event = eventRows[0];
  if (!event) {
    throw new HttpError(404, 'Pari introuvable');
  }
  if (event.status === 'resolved') {
    throw new HttpError(409, 'Ce pari est deja resolu');
  }

  const { outcomeId } = req.body;
  const { rows: outcomeRows } = await db.query('SELECT * FROM outcomes WHERE id = $1 AND event_id = $2', [
    outcomeId,
    event.id,
  ]);
  const outcome = outcomeRows[0];
  if (!outcome) {
    throw new HttpError(400, "Cette issue n'appartient pas a ce pari");
  }

  await resolveEventPayout(event.id, outcome.id);

  const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [event.id]);
  res.json(await serializeEvent(rows[0]));
}

// Paris ouverts sur lesquels ce joueur n'a encore place aucune mise : sert a
// la mise obligatoire (chaque pari dispo doit recevoir au moins
// MIN_BET_AMOUNT points de chaque joueur). Un joueur dont le solde ne
// permet plus d'atteindre ce minimum est exempte (on ne peut pas exiger ce
// qu'il n'a pas).
async function getPendingEvents(req, res) {
  const { rows: playerRows } = await db.query('SELECT * FROM players WHERE id = $1', [req.params.id]);
  const player = playerRows[0];
  if (!player) {
    throw new HttpError(404, 'Joueur introuvable');
  }

  if (player.balance < MIN_BET_AMOUNT) {
    return res.json([]);
  }

  const { rows } = await db.query(
    `SELECT * FROM events
     WHERE status = 'open'
       AND (betting_deadline IS NULL OR betting_deadline > now())
       AND id NOT IN (
         SELECT outcomes.event_id FROM bets
         JOIN outcomes ON outcomes.id = bets.outcome_id
         WHERE bets.player_id = $1
       )
     ORDER BY created_at ASC`,
    [req.params.id]
  );

  res.json(await Promise.all(rows.map(serializeEvent)));
}

// Supprime un pari qui n'a encore recu aucune mise (sinon on perdrait des
// points deja engages : dans ce cas mieux vaut le cloturer que le supprimer).
async function deleteEvent(req, res) {
  const { rows: eventRows } = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
  const event = eventRows[0];
  if (!event) {
    throw new HttpError(404, 'Pari introuvable');
  }

  const { rows: betRows } = await db.query(
    `SELECT COUNT(*)::int AS count FROM bets
     JOIN outcomes ON outcomes.id = bets.outcome_id
     WHERE outcomes.event_id = $1`,
    [event.id]
  );
  if (betRows[0].count > 0) {
    throw new HttpError(409, 'Ce pari a déjà des mises, impossible à supprimer (clôture-le plutôt)');
  }

  await db.query('DELETE FROM events WHERE id = $1', [event.id]);
  res.json({ ok: true });
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, resolveEvent, getPendingEvents, deleteEvent };
