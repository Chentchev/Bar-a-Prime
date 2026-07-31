import { useCallback, useEffect, useRef, useState } from 'react';

// Rafraichit periodiquement une source de donnees (liste des paris,
// leaderboard...) pour simuler du "temps reel" sans websockets, suffisant
// pour un petit groupe d'amis sur la meme soiree.
export function usePolling(fetcher, { interval = 4000, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function tick() {
      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    tick();
    const id = setInterval(tick, interval);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refresh = useCallback(async () => {
    const result = await fetcherRef.current();
    setData(result);
    return result;
  }, []);

  return { data, error, loading, refresh };
}
