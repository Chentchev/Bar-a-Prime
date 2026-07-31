import { Link } from 'react-router-dom';

const STATUS_LABEL = {
  open: { text: 'Ouvert', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  closed: { text: 'Clôturé', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  resolved: { text: 'Résolu', className: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

function formatDeadline(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  return date.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function EventCard({ event }) {
  const status = STATUS_LABEL[event.status];
  const deadline = formatDeadline(event.bettingDeadline);

  return (
    <Link
      to={`/events/${event.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{event.title}</h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
          {status.text}
        </span>
      </div>

      {event.category && <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">{event.category}</p>}

      <div className="flex flex-wrap gap-1.5">
        {event.outcomes.map((o) => (
          <span
            key={o.id}
            className={`rounded-lg px-2 py-1 text-xs font-medium ring-1 ${
              o.isWinner
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-slate-50 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
            }`}
          >
            {o.label} x{o.odds}
          </span>
        ))}
      </div>

      {deadline && <p className="mt-2 text-xs text-slate-400">⏳ mises jusqu'au {deadline}</p>}
    </Link>
  );
}
