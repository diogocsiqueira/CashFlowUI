import { monthLabel } from "../utils/dates";

export default function MonthPicker({ month, setMonth }) {

  return (
    
    <div className="flex items-end justify-between gap-3">

      <div>
        <div className="text-2xl font-black tracking-tight">Caixa</div>
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
