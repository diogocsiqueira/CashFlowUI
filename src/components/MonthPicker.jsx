import { monthLabel } from "../utils/dates";
import { useTheme } from "../hooks/useTheme";

export default function MonthPicker({ month, setMonth }) {
    const { toggleTheme } = useTheme();

  return (
    
    <div className="flex items-end justify-between gap-3">
        <button
            onClick={toggleTheme}
            className="ml-3 rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs shadow-sm hover:bg-black/3">
            🌙
        </button>

      <div>
        <div className="text-2xl font-black tracking-tight">Caixa</div>
        <div className="mt-1 text-sm text-(--muted) capitalize">
          {monthLabel(month)}
        </div>
      </div>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="rounded-xl border border-(--border) bg-(--surface) px-3 py-2 text-sm text-(--text) shadow-sm outline-none focus:ring-2 focus:ring-black/10"
      />
    </div>
  );
}
