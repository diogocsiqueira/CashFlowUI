import { formatBRL } from "../utils/money";

function Kpi({ label, value, kind }) {
  const isPositive = Number(value ?? 0) >= 0;

  let valueClass = "text-[var(--text)]";
  if (kind === "income") valueClass = "text-emerald-700";
  if (kind === "expense") valueClass = "text-red-700";
  if (kind === "balance") valueClass = isPositive ? "text-emerald-700" : "text-red-700";

  return (
    <div className="rounded-2xl border border-(--border) bg-(--surface) p-4">
      <div className="text-xs text-(--muted)">{label}</div>
      <div className={`mt-1 font-extrabold ${kind === "balance" ? "text-2xl" : "text-lg"} ${valueClass}`}>
        {formatBRL(value)}
      </div>
    </div>
  );
}

export default function SummaryCard({ summary }) {
  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="text-sm font-semibold">Resumo</div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Kpi label="Ganhos" value={summary.totalIncome} kind="income" />
        <Kpi label="Gastos" value={summary.totalExpense} kind="expense" />
        <Kpi label="Saldo" value={summary.balance} kind="balance" />
      </div>
    </section>
  );
}
