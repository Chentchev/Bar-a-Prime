import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const STORAGE_KEY = 'bar-a-prime:player-id';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recharge le profil depuis l'API (utile apres une mise ou une resolution
  // pour rafraichir le solde affiche)
  const refreshPlayer = useCallback(async (id) => {
    const playerId = id || player?.id;
    if (!playerId) return;
    try {
      const fresh = await api.getPlayer(playerId);
      setPlayer(fresh);
    } catch {
      // pas grave, on garde la derniere version connue jusqu'au prochain refresh
    }
  }, [player?.id]);

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) {
      setLoading(false);
      return;
    }
    api
      .getPlayer(storedId)
      .then((data) => setPlayer(data))
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  // Rafraichit le solde en tache de fond (reinitialisation par un admin,
  // resolution d'un pari...) sans attendre une action du joueur lui-meme.
  useEffect(() => {
    if (!player?.id) return;
    const playerId = player.id;
    const intervalId = setInterval(() => refreshPlayer(playerId), 6000);
    return () => clearInterval(intervalId);
  }, [player?.id, refreshPlayer]);

  const selectPlayer = useCallback((p) => {
    localStorage.setItem(STORAGE_KEY, p.id);
    setPlayer(p);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
  }, []);

  const value = useMemo(
    () => ({ player, loading, selectPlayer, logout, refreshPlayer }),
    [player, loading, selectPlayer, logout, refreshPlayer]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer doit etre utilise dans un PlayerProvider');
  return ctx;
}
