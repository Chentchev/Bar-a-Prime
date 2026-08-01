import { useState } from 'react';
import { api } from '../api/client';
import { usePlayer } from '../context/PlayerContext';
import { useConfig } from '../context/ConfigContext';
import { usePolling } from '../hooks/usePolling';
import CreateEventForm from '../components/events/CreateEventForm';
import { starterEvents } from '../data/starterEvents';
import { betOdds } from '../data/betOdds';

function AdminEventRow({ event, onChanged }) {
  const { player } = usePlayer();
  const [busy, setBusy] = useState(false);
  const [editingOdds, setEditingOdds] = useState(false);
  const [oddsInputs, setOddsInputs] = useState({});

  async function toggleStatus() {
    setBusy(true);
    try {
      await api.updateEvent(player.id, event.id, { status: event.status === 'open' ? 'closed' : 'open' });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function resolve(outcome) {
    if (!confirm(`Confirmer "${outcome.label}" comme issue gagnante ? Cette action est définitive.`)) return;
    setBusy(true);
    try {
      await api.resolveEvent(player.id, event.id, outcome.id);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Supprimer définitivement "${event.title}" ?`)) return;
    setBusy(true);
    try {
      await api.deleteEvent(player.id, event.id);
      onChanged();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  function startEditOdds() {
    const initial = {};
    for (const o of event.outcomes) {
      initial[o.id] = String(o.odds);
    }
    setOddsInputs(initial);
    setEditingOdds(true);
  }

  async function saveOdds() {
    const outcomes = [];
    for (const o of event.outcomes) {
      const odds = Number(oddsInputs[o.id]);
      if (!Number.isFinite(odds) || odds < 1) {
        alert(`Cote invalide pour "${o.label}" (minimum 1.0)`);
        return;
      }
      outcomes.push({ id: o.id, odds });
    }

    setBusy(true);
    try {
      await api.updateEvent(player.id, event.id, { outcomes });
      onChanged();
      setEditingOdds(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{event.title}</h3>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={toggleStatus}
            disabled={busy}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          >
            {event.status === 'open' ? 'Clôturer les mises' : 'Rouvrir les mises'}
          </button>
          {!editingOdds && (
            <button
              onClick={startEditOdds}
              disabled={busy}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 disabled:opacity-50 dark:bg-emerald-950 dark:text-emerald-400"
            >
              Modifier les cotes
            </button>
          )}
          <button
            onClick={remove}
            disabled={busy}
            className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-50 dark:bg-red-950 dark:text-red-400"
          >
            Supprimer
          </button>
        </div>
      </div>

      {editingOdds ? (
        <div className="flex flex-col gap-2">
          {event.outcomes.map((o) => (
            <div key={o.id} className="flex items-center gap-2">
              <span className="w-24 shrink-0 truncate text-sm">{o.label}</span>
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="0.1"
                value={oddsInputs[o.id] ?? ''}
                onChange={(e) => setOddsInputs((prev) => ({ ...prev, [o.id]: e.target.value }))}
                className="w-24 rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800"
              />
            </div>
          ))}
          <div className="mt-1 flex gap-2">
            <button
              onClick={() => setEditingOdds(false)}
              disabled={busy}
              className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
            >
              Annuler
            </button>
            <button
              onClick={saveOdds}
              disabled={busy}
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Enregistrer
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-2 text-xs text-slate-400">Cliquer sur une issue pour la déclarer gagnante :</p>
          <div className="flex flex-wrap gap-2">
            {event.outcomes.map((o) => (
              <button
                key={o.id}
                onClick={() => resolve(o)}
                disabled={busy}
                className="rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200 disabled:opacity-50 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-900"
              >
                {o.label} (x{o.odds}) — {o.totalStaked} pts
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StarterImport({ existingEvents, onImported }) {
  const { player } = usePlayer();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);

  async function handleImport() {
    setBusy(true);
    setProgress(null);
    const existingTitles = new Set((existingEvents ?? []).map((e) => e.title.trim().toLowerCase()));
    let created = 0;
    let skipped = 0;

    for (let i = 0; i < starterEvents.length; i++) {
      const item = starterEvents[i];
      setProgress({ done: i + 1, total: starterEvents.length, created, skipped });
      if (existingTitles.has(item.title.trim().toLowerCase())) {
        skipped += 1;
        continue;
      }
      try {
        await api.createEvent(player.id, item);
        created += 1;
      } catch {
        skipped += 1;
      }
    }

    setProgress({ done: starterEvents.length, total: starterEvents.length, created, skipped });
    setBusy(false);
    onImported();
  }

  return (
    <div className="mb-4 rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-200 dark:bg-violet-950 dark:ring-violet-900">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
        Import de départ
      </h2>
      <p className="mb-3 text-sm text-violet-800 dark:text-violet-200">
        Crée d'un coup les {starterEvents.length} paris nettoyés de la liste du groupe, directement{' '}
        <strong>ouverts</strong> (cotes 2/2 par défaut, à ajuster ensuite dans chaque pari). Les titres déjà
        présents sont ignorés, pas de doublons.
      </p>
      <button
        onClick={handleImport}
        disabled={busy}
        className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy
          ? `Import en cours… ${progress?.done ?? 0}/${starterEvents.length}`
          : `Importer les ${starterEvents.length} paris de base`}
      </button>
      {!busy && progress && (
        <p className="mt-2 text-sm text-violet-700 dark:text-violet-300">
          {progress.created} créés, {progress.skipped} ignorés (déjà présents).
        </p>
      )}
    </div>
  );
}

function ApplyOdds({ existingEvents, onApplied }) {
  const { player } = usePlayer();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);

  const matches = (existingEvents ?? []).filter((e) => betOdds[e.title]);

  async function handleApply() {
    setBusy(true);
    setProgress(null);
    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < matches.length; i++) {
      const event = matches[i];
      setProgress({ done: i + 1, total: matches.length, updated, skipped });
      const [oddsOui, oddsNon] = betOdds[event.title];
      const outcomesPayload = event.outcomes.map((o) => {
        if (o.label === 'Oui') return { id: o.id, odds: oddsOui };
        if (o.label === 'Non') return { id: o.id, odds: oddsNon };
        return null;
      });

      if (outcomesPayload.some((o) => o === null)) {
        skipped += 1;
        continue;
      }

      try {
        await api.updateEvent(player.id, event.id, { outcomes: outcomesPayload });
        updated += 1;
      } catch {
        skipped += 1;
      }
    }

    setProgress({ done: matches.length, total: matches.length, updated, skipped });
    setBusy(false);
    onApplied();
  }

  return (
    <div className="mb-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:ring-emerald-900">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
        Appliquer les cotes
      </h2>
      <p className="mb-3 text-sm text-emerald-800 dark:text-emerald-200">
        Met à jour les cotes des paris existants d'après <code>betOdds.js</code> ({matches.length} correspondance
        {matches.length > 1 ? 's' : ''}). Les paris que tu as supprimés toi-même sont ignorés automatiquement.
      </p>
      <button
        onClick={handleApply}
        disabled={busy || matches.length === 0}
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy
          ? `Application… ${progress?.done ?? 0}/${matches.length}`
          : `Appliquer les cotes (${matches.length})`}
      </button>
      {!busy && progress && (
        <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
          {progress.updated} mis à jour, {progress.skipped} ignorés.
        </p>
      )}
    </div>
  );
}

function DangerZone({ onReset }) {
  const { player, refreshPlayer } = usePlayer();
  const { startingBalance } = useConfig();
  const [busy, setBusy] = useState(false);

  async function handleReset() {
    const confirmed = confirm(
      `Réinitialiser TOUTE la partie ?\n\nTous les paris et mises seront supprimés, et chaque joueur repart avec ${startingBalance} points. Les profils (pseudos, admins) sont conservés. Cette action est définitive.`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await api.resetGame(player.id);
      await refreshPlayer();
      onReset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
        Zone dangereuse
      </h2>
      <p className="mb-3 text-sm text-red-700 dark:text-red-300">
        Supprime tous les paris et remet tout le monde à zéro. Pratique pour démarrer une nouvelle partie.
      </p>
      <button
        onClick={handleReset}
        disabled={busy}
        className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white disabled:opacity-50"
      >
        Réinitialiser la partie
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: events, refresh } = usePolling(() => api.listEvents(), { interval: 6000 });

  const pending = events?.filter((e) => e.status !== 'resolved') ?? [];

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-xl font-bold">⚙️ Admin</h1>

      <button
        onClick={() => setShowForm((v) => !v)}
        className="mb-4 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white"
      >
        {showForm ? 'Fermer' : '+ Nouveau pari'}
      </button>

      {showForm && (
        <div className="mb-4">
          <CreateEventForm
            onCreated={() => {
              setShowForm(false);
              refresh();
            }}
          />
        </div>
      )}

      <StarterImport existingEvents={events} onImported={refresh} />
      <ApplyOdds existingEvents={events} onApplied={refresh} />

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Paris en cours</h2>
      {pending.length === 0 && <p className="text-sm text-slate-400">Aucun pari à gérer.</p>}
      <div className="flex flex-col gap-3">
        {pending.map((event) => (
          <AdminEventRow key={event.id} event={event} onChanged={refresh} />
        ))}
      </div>

      <DangerZone onReset={refresh} />
    </div>
  );
}
