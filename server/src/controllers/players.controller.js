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
    isAdmin: row.is_admin,
    createdAt: row.created_at,
  };
}

// Liste des profils existants, pour l'ecran de selection au premier acces
async function listPlayers(req, res) {
  const { rows } = await db.query('SELECT * FROM players ORDER BY LOWER(pseudo)');
  res.json(rows.map(serializePlayer));
}

// Cree un nouveau profil (pas de mot de passe). Si le pseudo fait partie de
// ADMIN_PSEUDOS, le joueur devient admin des sa creation.
async function createPlayer(req, res) {
  const pseudo = (req.body.pseudo || '').trim();
  if (!pseudo) {
    throw new HttpError(400, 'Pseudo requis');
  }
  if (pseudo.length > 30) {
    throw new HttpError(400, 'Pseudo trop long (30 caracteres max)');
  }

  const { rows: existing } = await db.query('SELECT id FROM players WHERE LOWER(pseudo) = LOWER($1)', [pseudo]);
  if (existing.length > 0) {
    throw new HttpError(409, 'Ce pseudo est deja pris');
  }

  const id = randomUUID();
  const isAdmin = ADMIN_PSEUDOS.includes(pseudo.toLowerCase());

  await db.query('INSERT INTO players (id, pseudo, balance, is_admin) VALUES ($1, $2, $3, $4)', [
    id,
    pseudo,
    STARTING_BALANCE,
    isAdmin,
  ]);

  const { rows } = await db.query('SELECT * FROM players WHERE id = $1', [id]);
  res.status(201).json(serializePlayer(rows[0]));
}

async function getPlayer(req, res) {
  const { rows } = await db.query('SELECT * FROM players WHERE id = $1', [req.params.id]);
  if (!rows[0]) {
    throw new HttpError(404, 'Joueur introuvable');
  }
  res.json(serializePlayer(rows[0]));
}

// Historique des paris d'un joueur, avec le libelle de l'issue et du pari
async function getPlayerBets(req, res) {
  const { rows: playerRows } = await db.query('SELECT id FROM players WHERE id = $1', [req.params.id]);
  if (!playerRows[0]) {
    throw new HttpError(404, 'Joueur introuvable');
  }

  const { rows } = await db.query(
    `SELECT
      bets.id, bets.amount, bets.odds_at_bet_time AS "oddsAtBetTime",
      bets.result, bets.payout, bets.placed_at AS "placedAt",
      outcomes.label AS "outcomeLabel",
      events.id AS "eventId", events.title AS "eventTitle", events.status AS "eventStatus"
    FROM bets
    JOIN outcomes ON outcomes.id = bets.outcome_id
    JOIN events ON events.id = outcomes.event_id
    WHERE bets.player_id = $1
    ORDER BY bets.placed_at DESC`,
    [req.params.id]
  );

  res.json(rows);
}

async function getLeaderboard(req, res) {
  const { rows } = await db.query('SELECT * FROM players ORDER BY balance DESC, LOWER(pseudo)');
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
