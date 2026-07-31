import { useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';

const EMPTY_OUTCOME = { label: '', odds: '' };

export default function CreateEventForm({ onCreated }) {
  const { player } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [bettingDeadline, setBettingDeadline] = useState('');
  const [outcomes, setOutcomes] = useState([{ ...EMPTY_OUTCOME }, { ...EMPTY_OUTCOME }]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function updateOutcome(index, field, value) {
    setOutcomes((prev) => prev.map((o, i) => (i === index ? { ...o, [field]: value } : o)));
  }

  function addOutcome() {
    setOutcomes((prev) => [...prev, { ...EMPTY_OUTCOME }]);
  }

  function removeOutcome(index) {
    setOutcomes((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setTitle('');
    setDescription('');
    setCategory('');
    setBettingDeadline('');
    setOutcomes([{ ...EMPTY_OUTCOME }, { ...EMPTY_OUTCOME }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.createEvent(player.id, {
        title,
        description,
        category,
        bettingDeadline: bettingDeadline ? new Date(bettingDeadline).toISOString() : null,
        outcomes: outcomes.map((o) => ({ label: o.label, odds: Number(o.odds) })),
      });
      reset();
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <h2 className="font-semibold">Nouveau pari</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre (ex: Qui craque en premier ?)"
        required
        className="rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optionnel)"
        rows={2}
        className="rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
      />
      <div className="flex gap-2">
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Catégorie (optionnel)"
          className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
        />
        <input
          type="datetime-local"
          value={bettingDeadline}
          onChange={(e) => setBettingDeadline(e.target.value)}
          className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Issues possibles</p>
        {outcomes.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={o.label}
              onChange={(e) => updateOutcome(i, 'label', e.target.value)}
              placeholder={`Issue ${i + 1}`}
              required
              className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
            />
            <input
              type="number"
              step="0.01"
              min="1"
              value={o.odds}
              onChange={(e) => updateOutcome(i, 'odds', e.target.value)}
              placeholder="Cote"
              required
              className="w-20 rounded-xl bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-slate-800"
            />
            {outcomes.length > 2 && (
              <button
                type="button"
                onClick={() => removeOutcome(i)}
                className="rounded-xl bg-slate-100 px-2 text-slate-400 dark:bg-slate-800"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addOutcome} className="text-sm font-medium text-violet-600 dark:text-violet-400">
          + Ajouter une issue
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-50"
      >
        Créer le pari
      </button>
    </form>
  );
}
