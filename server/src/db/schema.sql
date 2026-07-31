-- Joueurs : pas de mot de passe, juste un pseudo + un id genere cote serveur
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  pseudo TEXT NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 1000,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Un pari peut avoir plusieurs issues possibles (outcomes), chacune avec sa propre cote
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
  betting_deadline TEXT,
  created_by TEXT NOT NULL REFERENCES players(id),
  resolved_outcome_id INTEGER REFERENCES outcomes(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS outcomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  odds REAL NOT NULL CHECK (odds >= 1.0)
);

-- La cote est figee au moment de la mise (odds_at_bet_time) pour ne pas etre
-- impactee si un admin modifie la cote apres coup.
CREATE TABLE IF NOT EXISTS bets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id TEXT NOT NULL REFERENCES players(id),
  outcome_id INTEGER NOT NULL REFERENCES outcomes(id),
  amount INTEGER NOT NULL CHECK (amount > 0),
  odds_at_bet_time REAL NOT NULL,
  placed_at TEXT NOT NULL DEFAULT (datetime('now')),
  result TEXT NOT NULL DEFAULT 'pending' CHECK (result IN ('pending', 'won', 'lost')),
  payout INTEGER
);

CREATE INDEX IF NOT EXISTS idx_bets_player ON bets(player_id);
CREATE INDEX IF NOT EXISTS idx_bets_outcome ON bets(outcome_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_event ON outcomes(event_id);
