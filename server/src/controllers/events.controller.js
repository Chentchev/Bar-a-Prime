const db = require('../db');
const { HttpError } = require('../middleware/errorHandler');
const { resolveEvent: resolveEventPayout } = require('../services/payout.service');

function outcomesWithStats(eventId) {
  return db
    .prepare(
      `SELECT
        outcomes.id, outcomes.label, outcomes.odds,
        COALESCE(SUM(bets.amount), 0) AS totalStaked,
        COUNT(bets.id) AS betCount
      FROM outcomes
      LEFT JOIN bets ON bets.outcome_id = outcomes.id
      WHERE outcomes.event_id = ?
      GROUP BY outcomes.id
      ORDER BY outcomes.id`
    )
    .all(eventId);
}

function serializeEvent(row) {
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
    outcomes: outcomesWithStats(row.id).map((outcome) => ({
      ...outcome,
      isWinner: row.resolved_outcome_id === outcome.id,
    })),
  };
}

function listEvents(req, res) {
  const { status } = req.query;
  let rows;
  if (status) {
    rows = db.prepare('SELECT * FROM events WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    rows = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();
  }
  res.json(rows.map(serializeEvent));
}

function getEvent(req, res) {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!row) {
    throw new HttpError(404, 'Pari introuvable');
  }
  res.json(serializeEvent(row));
}

// Cree un pari avec ses issues possibles (au moins 2), chacune avec sa cote
// fixee a la main par l'admin.
function createEvent(req, res) {
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

  const createEventTx = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO events (title, description, category, betting_deadline, created_by)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(title.trim(), description || null, category || null, bettingDeadline || null, req.player.id);

    const insertOutcome = db.prepare('INSERT INTO outcomes (event_id, label, odds) VALUES (?, ?, ?)');
    for (const outcome of outcomes) {
      insertOutcome.run(info.lastInsertRowid, outcome.label.trim(), Number(outcome.odds));
    }

    return info.lastInsertRowid;
  });

  const eventId = createEventTx();
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
  res.status(201).json(serializeEvent(row));
}

// Permet a l'admin de rouvrir/clore les mises, ou d'ajuster les infos tant
// que le pari n'est pas resolu.
function updateEvent(req, res) {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
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

  db.prepare(
    `UPDATE events SET
      status = COALESCE(?, status),
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      betting_deadline = COALESCE(?, betting_deadline)
    WHERE id = ?`
  ).run(status || null, title || null, description || null, category || null, bettingDeadline || null, event.id);

  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(event.id);
  res.json(serializeEvent(row));
}

// Marque l'issue gagnante et declenche la redistribution des points
function resolveEvent(req, res) {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) {
    throw new HttpError(404, 'Pari introuvable');
  }
  if (event.status === 'resolved') {
    throw new HttpError(409, 'Ce pari est deja resolu');
  }

  const { outcomeId } = req.body;
  const outcome = db
    .prepare('SELECT * FROM outcomes WHERE id = ? AND event_id = ?')
    .get(outcomeId, event.id);
  if (!outcome) {
    throw new HttpError(400, "Cette issue n'appartient pas a ce pari");
  }

  resolveEventPayout(event.id, outcome.id);

  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(event.id);
  res.json(serializeEvent(row));
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, resolveEvent };
