export default function OutcomeButton({ outcome, selected, resolved, onClick }) {
  const isWinner = resolved && outcome.isWinner;
  const isLoser = resolved && !outcome.isWinner;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={resolved}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ring-1 transition active:scale-[0.98] disabled:active:scale-100 ${
        isWinner
          ? 'bg-emerald-50 ring-emerald-300 dark:bg-emerald-950 dark:ring-emerald-800'
          : isLoser
            ? 'bg-slate-50 opacity-50 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800'
            : selected
              ? 'bg-violet-600 text-white ring-violet-600'
              : 'bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-800'
      }`}
    >
      <span className="font-medium">
        {isWinner && '🏆 '}
        {outcome.label}
      </span>
      <span className={`font-bold ${selected && !resolved ? 'text-white' : 'text-violet-600 dark:text-violet-400'}`}>
        x{outcome.odds}
      </span>
    </button>
  );
}
