import { usePlayer } from '../../context/PlayerContext';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardTable({ players }) {
  const { player: me } = usePlayer();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      {players.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center justify-between px-4 py-3 ${
            i > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''
          } ${p.id === me?.id ? 'bg-violet-50 dark:bg-violet-950' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className="w-6 text-center text-lg">{MEDALS[i] || i + 1}</span>
            <span className="font-medium">
              {p.pseudo}
              {p.isAdmin && <span className="ml-1 text-xs text-slate-400">(admin)</span>}
            </span>
          </div>
          <span className="font-bold text-violet-600 dark:text-violet-400">{p.balance} pts</span>
        </div>
      ))}
    </div>
  );
}
