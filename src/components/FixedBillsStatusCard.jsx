import { formatBRL } from "../utils/money";

export default function FixedBillsStatusCard({ bills = [] }) {
  const total = bills.length;
  const paidBills = bills.filter((b) => b.paid);

  const paid = paidBills.length;

  const totalExpected = bills.reduce(
    (acc, b) => acc + Number(b.defaultAmount ?? b.amount ?? 0),
    0
  );

  const totalPaid = paidBills.reduce(
    (acc, b) => acc + Number(b.amount ?? b.defaultAmount ?? 0),
    0
  );

  const pending = Math.max(totalExpected - totalPaid, 0);
  const progress = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-(--muted)">Contas fixas</div>
          <div className="mt-1 text-2xl font-extrabold text-(--text)">
            {paid} / {total}
          </div>
          <div className="text-sm text-(--muted)">pagas neste mês</div>
        </div>

        <div className="rounded-2xl border border-(--border) px-3 py-2 text-sm font-bold">
          {progress}%
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid gap-3">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-(--muted)">Previsto</span>
          <strong>{formatBRL(totalExpected)}</strong>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-(--muted)">Pago</span>
          <strong className="text-emerald-700">{formatBRL(totalPaid)}</strong>
        </div>

        <div className="flex justify-between gap-4 text-sm">
          <span className="text-(--muted)">Pendente</span>
          <strong className="text-red-700">{formatBRL(pending)}</strong>
        </div>
      </div>
    </section>
  );
}