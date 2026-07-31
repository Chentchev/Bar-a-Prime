import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { usePolling } from '../hooks/usePolling';
import OutcomeButton from '../components/events/OutcomeButton';
import BetModal from '../components/bets/BetModal';

export default function EventDetailPage() {
  const { id } = useParams();
  const { data: event, loading, refresh } = usePolling(() => api.getEvent(id), { deps: [id] });
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  if (loading && !event) {
    return <p className="text-center text-sm text-slate-400">Chargement…</p>;
  }
  if (!event) {
    return <p className="text-center text-sm text-slate-400">Pari introuvable.</p>;
  }

  const deadlinePassed = event.bettingDeadline && new Date(event.bettingDeadline) < new Date();
  const canBet = event.status === 'open' && !deadlinePassed;

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/" className="mb-3 inline-block text-sm text-slate-400">
        ← Retour
      </Link>

      <h1 className="text-xl font-bold">{event.title}</h1>
      {event.category && <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">{event.category}</p>}
      {event.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>}

      {!canBet && event.status !== 'resolved' && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
          Les mises sont clôturées pour ce pari.
        </p>
      )}
      {event.status === 'resolved' && (
        <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Résolu — issue gagnante : {event.outcomes.find((o) => o.isWinner)?.label}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {event.outcomes.map((outcome) => (
          <div key={outcome.id}>
            <OutcomeButton
              outcome={outcome}
              resolved={event.status === 'resolved'}
              onClick={() => canBet && setSelectedOutcome(outcome)}
            />
            <p className="mt-1 px-1 text-xs text-slate-400">
              {outcome.totalStaked} pts misés · {outcome.betCount} pari{outcome.betCount > 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      {selectedOutcome && (
        <BetModal
          event={event}
          outcome={selectedOutcome}
          onClose={() => setSelectedOutcome(null)}
          onPlaced={refresh}
        />
      )}
    </div>
  );
}
