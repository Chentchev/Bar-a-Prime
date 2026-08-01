import { useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';
import { useConfig } from '../../context/ConfigContext';

// La mise est fixe (BET_AMOUNT, cf config serveur) : pas de champ libre,
// tout le monde mise le meme montant sur chaque pari.
export default function BetModal({ event, outcome, onClose, onPlaced }) {
  const { player, refreshPlayer } = usePlayer();
  const { betAmount } = useConfig();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const potentialGain = Math.round(betAmount * outcome.odds);
  const overBudget = betAmount > player.balance;

  async function handleSubmit(e) {
    e.preventDefault();
    if (overBudget) return;
    setBusy(true);
    setError('');
    try {
      await api.placeBet(player.id, outcome.id, betAmount);
      await refreshPlayer();
      onPlaced();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <p className="mb-4 text-sm text-slate-500">
          Miser sur <span className="font-semibold text-violet-600 dark:text-violet-400">{outcome.label}</span> (cote x{outcome.odds})
        </p>

        <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
          <span className="text-sm text-slate-500">Mise (solde : {player.balance} pts)</span>
          <span className="text-lg font-bold">{betAmount} pts</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 dark:bg-violet-950">
          <span className="text-sm text-slate-500">Gain potentiel</span>
          <span className="text-lg font-bold text-violet-700 dark:text-violet-400">{potentialGain} pts</span>
        </div>

        {overBudget && <p className="mt-2 text-sm text-red-500">Solde insuffisant.</p>}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={busy || overBudget}
            className="flex-1 rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            Miser
          </button>
        </div>
      </form>
    </div>
  );
}
