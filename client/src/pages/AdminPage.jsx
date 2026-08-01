import { useState } from 'react';
import { api } from '../api/client';
import { usePlayer } from '../context/PlayerContext';
import { useConfig } from '../context/ConfigContext';
import { usePolling } from '../hooks/usePolling';
import CreateEventForm from '../components/events/CreateEventForm';
import { starterEvents } from '../data/starterEvents';

function AdminEventRow({ event, onChanged }) {
  const { player } = usePlayer();
  const [busy, setBusy] = useState(false);

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

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{event.title}</h3>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={toggleStatus}
            disabled={busy}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
          >
            {event.status === 'open' ? 'Clôturer les mises' : 'Rouvrir les mises'}
          </button>
          <button
            onClick={remove}
            disabled={busy}
            className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 disabled:opacity-50 dark:bg-red-950 dark:text-red-400"
          >
            Supprimer
          </button>
        </div>
      </div>

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
