import { useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';
import { useConfig } from '../../context/ConfigContext';

export default function BetModal({ event, outcome, onClose, onPlaced }) {
  const { player, refreshPlayer } = usePlayer();
  const { minBetAmount } = useConfig();
  const [amount, setAmount] = useState(String(minBetAmount));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const numericAmount = Number(amount) || 0;
  const potentialGain = Math.round(numericAmount * outcome.odds);
  const overBudget = numericAmount > player.balance;
  const belowMinimum = numericAmount < minBetAmount;

  async function handleSubmit(e) {
    e.preventDefault();
    if (belowMinimum || overBudget) return;
    setBusy(true);
    setError('');
    try {
      await api.placeBet(player.id, outcome.id, numericAmount);
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

        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Mise (solde : {player.balance} pts)
        </label>
        <input
          type="number"
          inputMode="numeric"
          min={minBetAmount}
          step="1"
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
        />
        <p className="mt-1 text-xs text-slate-400">Mise minimum : {minBetAmount} pts</p>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 dark:bg-violet-950">
          <span className="text-sm text-slate-500">Gain potentiel</span>
          <span className="text-lg font-bold text-violet-700 dark:text-violet-400">{potentialGain} pts</span>
        </div>

        {overBudget && <p className="mt-2 text-sm text-red-500">Solde insuffisant.</p>}
        {!overBudget && belowMinimum && (
          <p className="mt-2 text-sm text-red-500">La mise minimum est de {minBetAmount} points.</p>
        )}
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
            disabled={busy || belowMinimum || overBudget}
            className="flex-1 rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            Miser
          </button>
        </div>
      </form>
    </div>
  );
}
