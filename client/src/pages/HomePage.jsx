import { useState } from 'react';
import { api } from '../api/client';
import { usePolling } from '../hooks/usePolling';
import EventCard from '../components/events/EventCard';
import PendingBetsReminder from '../components/bets/PendingBetsReminder';

const TABS = [
  { value: 'open', label: 'Ouverts' },
  { value: 'closed', label: 'Clôturés' },
  { value: 'resolved', label: 'Résolus' },
];

export default function HomePage() {
  const [tab, setTab] = useState('open');
  const { data: events, loading } = usePolling(() => api.listEvents(tab), { deps: [tab] });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex gap-2 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/60">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
              tab === t.value ? 'bg-white shadow-sm dark:bg-slate-900' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && !events && <p className="text-center text-sm text-slate-400">Chargement…</p>}

      {events && events.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-400">Aucun pari {TABS.find((t) => t.value === tab).label.toLowerCase()} pour le moment.</p>
      )}

      <div className="flex flex-col gap-3">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <PendingBetsReminder />
    </div>
  );
}
