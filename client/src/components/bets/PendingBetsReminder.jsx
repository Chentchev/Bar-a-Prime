import { useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';
import { useConfig } from '../../context/ConfigContext';
import { usePolling } from '../../hooks/usePolling';
import OutcomeButton from '../events/OutcomeButton';
import BetModal from './BetModal';

// Rappel non bloquant (pas d'ecran plein ecran) : liste les paris ouverts
// sur lesquels le joueur n'a pas encore mise le minimum requis. On peut
// naviguer partout ailleurs dans l'app, ce bandeau est juste la pour ne
// pas oublier - cf mise obligatoire.
export default function PendingBetsReminder() {
  const { player } = usePlayer();
  const { minBetAmount } = useConfig();
  const { data: pendingEvents, refresh } = usePolling(() => api.getPendingEvents(player.id), {
    interval: 8000,
    deps: [player.id],
  });
  const [selected, setSelected] = useState(null);

  if (!pendingEvents || pendingEvents.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950 dark:ring-amber-900">
      <h2 className="mb-1 text-sm font-semibold text-amber-700 dark:text-amber-400">
        ⚠️ Encore {pendingEvents.length} pari{pendingEvents.length > 1 ? 's' : ''} sans ta mise
      </h2>
      <p className="mb-3 text-sm text-amber-800 dark:text-amber-300">
        Rappel : chaque pari ouvert doit recevoir au moins {minBetAmount} points de ta part.
      </p>

      <div className="flex flex-col gap-3">
        {pendingEvents.map((event) => (
          <div key={event.id} className="rounded-xl bg-white p-3 dark:bg-slate-900">
            <p className="mb-2 text-sm font-medium">{event.title}</p>
            <div className="flex flex-col gap-2">
              {event.outcomes.map((outcome) => (
                <OutcomeButton key={outcome.id} outcome={outcome} onClick={() => setSelected({ event, outcome })} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <BetModal
          event={selected.event}
          outcome={selected.outcome}
          onClose={() => setSelected(null)}
          onPlaced={refresh}
        />
      )}
    </div>
  );
}
