import { NavLink } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

const linkClass = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition ${
    isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
  }`;

// Navigation en bas d'ecran : pensee pour etre utilisable au pouce, sur
// telephone, depuis un bar ou une plage.
export default function BottomNav() {
  const { player } = usePlayer();

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <NavLink to="/" end className={linkClass}>
        <span className="text-xl">🎲</span>
        Paris
      </NavLink>
      <NavLink to="/leaderboard" className={linkClass}>
        <span className="text-xl">🏆</span>
        Classement
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <span className="text-xl">👤</span>
        Mon profil
      </NavLink>
      {player?.isAdmin && (
        <NavLink to="/admin" className={linkClass}>
          <span className="text-xl">⚙️</span>
          Admin
        </NavLink>
      )}
    </nav>
  );
}
