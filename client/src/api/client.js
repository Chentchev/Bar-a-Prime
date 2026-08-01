// Wrapper fetch minimal : prefixe l'URL de l'API et attache le header
// x-player-id du profil courant (pas de mot de passe, cf PlayerContext).
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, playerId } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (playerId) {
    headers['x-player-id'] = playerId;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Erreur ${res.status}`);
  }

  return data;
}

export const api = {
  listPlayers: () => request('/players'),
  createPlayer: (pseudo) => request('/players', { method: 'POST', body: { pseudo } }),
  getPlayer: (playerId) => request(`/players/${playerId}`),
  getPlayerBets: (playerId) => request(`/players/${playerId}/bets`, { playerId }),
  getPendingEvents: (playerId) => request(`/players/${playerId}/pending-events`, { playerId }),
  getLeaderboard: () => request('/leaderboard'),
  getConfig: () => request('/config'),

  listEvents: (status) => request(`/events${status ? `?status=${status}` : ''}`),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (playerId, payload) => request('/events', { method: 'POST', body: payload, playerId }),
  updateEvent: (playerId, id, payload) => request(`/events/${id}`, { method: 'PATCH', body: payload, playerId }),
  resolveEvent: (playerId, id, outcomeId) =>
    request(`/events/${id}/resolve`, { method: 'POST', body: { outcomeId }, playerId }),

  placeBet: (playerId, outcomeId, amount) =>
    request('/bets', { method: 'POST', body: { outcomeId, amount }, playerId }),

  resetGame: (playerId) => request('/admin/reset', { method: 'POST', playerId }),
};
