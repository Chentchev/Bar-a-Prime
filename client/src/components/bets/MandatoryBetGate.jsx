import { useState } from 'react';
import { api } from '../../api/client';
import { usePlayer } from '../../context/PlayerContext';
import { useConfig } from '../../context/ConfigContext';
import { usePolling } from '../../hooks/usePolling';
import OutcomeButton from '../events/OutcomeButton';
import BetModal from './BetModal';

// Regle du groupe : chaque pari ouvert doit recevoir au moins minBetAmount
// points de la part de chaque joueur. Cet ecran bloque le reste de l'app
// (overlay plein ecran, pas de fermeture) tant qu'il reste des paris sans
// mise du joueur courant - il faut choisir une issue soi-meme, pas de mise
// automatique.
export default function MandatoryBetGate() {
  const { player, logout } = usePlayer();
  const { minBetAmount } = useConfig();
  const { data: pendingEvents, refresh } = usePolling(() => api.getPendingEvents(player.id), {
    interval: 5000,
    deps: [player.id],
  });
  const [selected, setSelected] = useState(null);

  if (!pendingEvents || pendingEvents.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/97 px-4 py-6 text-slate-100">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-xl font-bold">🎯 Mises obligatoires</h1>
        <p className="mt-1 text-sm text-slate-300">
          Chaque pari ouvert doit recevoir au moins {minBetAmount} points de ta part. Choisis une issue pour
          continuer — il t'en reste {pendingEvents.length}.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {pendingEvents.map((event) => (
            <div key={event.id} className="rounded-2xl bg-slate-900 p-4 ring-1 ring-slate-800">
              <h2 className="mb-2 font-semibold">{event.title}</h2>
              <div className="flex flex-col gap-2">
                {event.outcomes.map((outcome) => (
                  <OutcomeButton key={outcome.id} outcome={outcome} onClick={() => setSelected({ event, outcome })} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={logout} className="mt-6 text-sm text-slate-400 underline underline-offset-2">
          Pas le bon profil ? Changer
        </button>
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
