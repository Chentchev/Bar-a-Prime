import { api } from '../api/client';
import { usePolling } from '../hooks/usePolling';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  const { data: players, loading } = usePolling(() => api.getLeaderboard(), { interval: 5000 });

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-xl font-bold">🏆 Classement</h1>
      {loading && !players && <p className="text-center text-sm text-slate-400">Chargement…</p>}
      {players && <LeaderboardTable players={players} />}
    </div>
  );
}
