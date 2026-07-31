import PlayerBadge from '../players/PlayerBadge';
import { usePlayer } from '../../context/PlayerContext';

export default function NavBar() {
  const { player, logout } = usePlayer();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <span className="text-lg font-black text-violet-700 dark:text-violet-400">🍹 Bar à Prime</span>
      <div className="flex items-center gap-2">
        <PlayerBadge player={player} />
        <button
          onClick={logout}
          className="text-xs font-medium text-slate-400 underline underline-offset-2"
        >
          changer
        </button>
      </div>
    </header>
  );
}
