import { formatBRL } from "../utils/money";

export default function TransactionsCard({ transactions, loading }) {
  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Transações</div>
        <div className="text-xs text-(--muted)">
          {loading ? "Carregando..." : `${transactions.length} itens`}
        </div>
      </div>

      {loading ? (
        <div className="mt-3 text-sm text-(--muted)">Carregando...</div>
      ) : transactions.length === 0 ? (
        <div className="mt-3 text-sm text-(--muted)">Nenhuma transação neste mês.</div>
      ) : (
        <div className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5">
          {transactions
            .slice()
            .reverse()
            .map((t) => {
              const isExpense = t.type === "EXPENSE";
              return (
                <div key={t.id} className="px-4 py-3 hover:bg-[color-mix(in_srgb,var(--surface),#000 5%)]
 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {t.description || t.category}
                      </div>
                      <div className="mt-0.5 text-xs text-(--muted)">
                        {t.date} • {t.category}
                      </div>
                    </div>

                    <div className={`font-bold whitespace-nowrap ${isExpense ? "text-red-700" : "text-emerald-700"}`}>
                      {isExpense ? "-" : "+"}{formatBRL(t.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}
