import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';

// Premier ecran vu par un joueur : choisir un profil existant ou en creer
// un nouveau. Pas de mot de passe, c'est un groupe ferme entre potes.
export default function ProfilePicker() {
  const { selectPlayer } = usePlayer();
  const [players, setPlayers] = useState([]);
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.listPlayers().then(setPlayers).catch(() => setPlayers([]));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!pseudo.trim()) return;
    setBusy(true);
    setError('');
    try {
      const created = await api.createPlayer(pseudo.trim());
      selectPlayer(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight text-violet-700 dark:text-violet-400">🍹 Barça Prime 2012</h1>
        <p className="mt-1 text-sm text-slate-500">Les pronos entre potes pendant le séjour</p>
      </div>

      {players.length > 0 && (
        <div className="w-full max-w-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Je suis déjà inscrit
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPlayer(p)}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-left shadow-sm ring-1 ring-slate-200 transition active:scale-95 dark:bg-slate-900 dark:ring-slate-800"
              >
                <span className="font-medium">{p.pseudo}</span>
                <span className="text-xs text-slate-400">{p.balance} pts</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} className="w-full max-w-sm">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Nouveau profil</h2>
        <div className="flex gap-2">
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Ton pseudo"
            maxLength={30}
            className="w-full rounded-xl border-none bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-900 dark:ring-slate-800"
          />
          <button
            type="submit"
            disabled={busy || !pseudo.trim()}
            className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-sm transition active:scale-95 disabled:opacity-50"
          >
            OK
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
}
