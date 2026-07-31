import { api } from '../api/client';
import { usePlayer } from '../context/PlayerContext';
import { usePolling } from '../hooks/usePolling';
import BetHistoryItem from '../components/bets/BetHistoryItem';

export default function ProfilePage() {
  const { player } = usePlayer();
  const { data: bets, loading } = usePolling(() => api.getPlayerBets(player.id), {
    interval: 5000,
    deps: [player.id],
  });

  const stats = bets?.reduce(
    (acc, b) => {
      if (b.result === 'won') acc.won += 1;
      else if (b.result === 'lost') acc.lost += 1;
      else acc.pending += 1;
      return acc;
    },
    { won: 0, lost: 0, pending: 0 }
  );

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm text-slate-400">{player.pseudo}</p>
        <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{player.balance} pts</p>
        {stats && (
          <p className="mt-1 text-xs text-slate-400">
            {stats.won} gagnés · {stats.lost} perdus · {stats.pending} en cours
          </p>
        )}
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Historique</h2>

      {loading && !bets && <p className="text-center text-sm text-slate-400">Chargement…</p>}
      {bets && bets.length === 0 && <p className="text-center text-sm text-slate-400">Aucun pari pour le moment.</p>}

      <div className="flex flex-col gap-2">
        {bets?.map((bet) => (
          <BetHistoryItem key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}
