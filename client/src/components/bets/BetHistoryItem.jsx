import { Link } from 'react-router-dom';

const RESULT_STYLE = {
  pending: { text: 'En cours', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  won: { text: 'Gagné', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  lost: { text: 'Perdu', className: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' },
};

export default function BetHistoryItem({ bet }) {
  const result = RESULT_STYLE[bet.result];

  return (
    <Link
      to={`/events/${bet.eventId}`}
      className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <div>
        <p className="text-sm font-medium leading-snug">{bet.eventTitle}</p>
        <p className="text-xs text-slate-400">
          {bet.outcomeLabel} · {bet.amount} pts x{bet.oddsAtBetTime}
        </p>
      </div>
      <div className="text-right">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${result.className}`}>{result.text}</span>
        {bet.result === 'won' && <p className="mt-1 text-xs font-semibold text-emerald-600">+{bet.payout} pts</p>}
      </div>
    </Link>
  );
}
