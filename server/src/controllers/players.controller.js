const { randomUUID } = require('crypto');
const db = require('../db');
const { HttpError } = require('../middleware/errorHandler');

const STARTING_BALANCE = Number(process.env.STARTING_BALANCE || 1000);
const ADMIN_PSEUDOS = (process.env.ADMIN_PSEUDOS || '')
  .split(',')
  .map((p) => p.trim().toLowerCase())
  .filter(Boolean);

function serializePlayer(row) {
  return {
    id: row.id,
    pseudo: row.pseudo,
    balance: row.balance,
    isAdmin: !!row.is_admin,
    createdAt: row.created_at,
  };
}

// Liste des profils existants, pour l'ecran de selection au premier acces
function listPlayers(req, res) {
  const rows = db.prepare('SELECT * FROM players ORDER BY pseudo COLLATE NOCASE').all();
  res.json(rows.map(serializePlayer));
}

// Cree un nouveau profil (pas de mot de passe). Si le pseudo fait partie de
// ADMIN_PSEUDOS, le joueur devient admin des sa creation.
function createPlayer(req, res) {
  const pseudo = (req.body.pseudo || '').trim();
  if (!pseudo) {
    throw new HttpError(400, 'Pseudo requis');
  }
  if (pseudo.length > 30) {
    throw new HttpError(400, 'Pseudo trop long (30 caracteres max)');
  }

  const existing = db.prepare('SELECT id FROM players WHERE pseudo = ? COLLATE NOCASE').get(pseudo);
  if (existing) {
    throw new HttpError(409, 'Ce pseudo est deja pris');
  }

  const id = randomUUID();
  const isAdmin = ADMIN_PSEUDOS.includes(pseudo.toLowerCase()) ? 1 : 0;

  db.prepare(
    'INSERT INTO players (id, pseudo, balance, is_admin) VALUES (?, ?, ?, ?)'
  ).run(id, pseudo, STARTING_BALANCE, isAdmin);

  const row = db.prepare('SELECT * FROM players WHERE id = ?').get(id);
  res.status(201).json(serializePlayer(row));
}

function getPlayer(req, res) {
  const row = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
  if (!row) {
    throw new HttpError(404, 'Joueur introuvable');
  }
  res.json(serializePlayer(row));
}

// Historique des paris d'un joueur, avec le libelle de l'issue et du pari
function getPlayerBets(req, res) {
  const player = db.prepare('SELECT id FROM players WHERE id = ?').get(req.params.id);
  if (!player) {
    throw new HttpError(404, 'Joueur introuvable');
  }

  const rows = db
    .prepare(
      `SELECT
        bets.id, bets.amount, bets.odds_at_bet_time AS oddsAtBetTime,
        bets.result, bets.payout, bets.placed_at AS placedAt,
        outcomes.label AS outcomeLabel,
        events.id AS eventId, events.title AS eventTitle, events.status AS eventStatus
      FROM bets
      JOIN outcomes ON outcomes.id = bets.outcome_id
      JOIN events ON events.id = outcomes.event_id
      WHERE bets.player_id = ?
      ORDER BY bets.placed_at DESC`
    )
    .all(req.params.id);

  res.json(rows);
}

function getLeaderboard(req, res) {
  const rows = db
    .prepare('SELECT * FROM players ORDER BY balance DESC, pseudo COLLATE NOCASE')
    .all();
  res.json(rows.map(serializePlayer));
}

module.exports = {
  listPlayers,
  createPlayer,
  getPlayer,
  getPlayerBets,
  getLeaderboard,
  serializePlayer,
};
