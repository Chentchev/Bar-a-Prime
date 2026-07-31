export default function PlayerBadge({ player }) {
  if (!player) return null;
  return (
    <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-900">
      <span>{player.pseudo}</span>
      <span className="font-bold">{player.balance} pts</span>
    </div>
  );
}
