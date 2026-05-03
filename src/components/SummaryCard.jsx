import { formatBRL } from "../utils/money";

function Kpi({ label, value, kind }) {
  const isPositive = Number(value ?? 0) >= 0;

  let valueClass = "text-(--text)";
  if (kind === "income") valueClass = "text-emerald-700";
  if (kind === "expense") valueClass = "text-red-700";
  if (kind === "balance") valueClass = isPositive ? "text-emerald-700" : "text-red-700";

  return (
    <div className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
        {label}
      </div>

      <div className={`mt-2 text-2xl font-extrabold tracking-tight ${valueClass}`}>
        {formatBRL(value)}
      </div>
    </div>
  );
}

export default function SummaryCard({ summary }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Resumo financeiro</h2>
          <p className="mt-1 text-sm text-(--muted)">
            Visão geral do mês selecionado.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Kpi label="Ganhos" value={summary.totalIncome} kind="income" />
        <Kpi label="Gastos" value={summary.totalExpense} kind="expense" />
        <Kpi label="Saldo atual" value={summary.balance} kind="balance" />
      </div>
    </section>
  );
}