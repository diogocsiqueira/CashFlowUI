import { formatBRL } from "../utils/money";

export default function TransactionsCard({
  transactions = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) shadow-(--shadow)">
      <div className="flex items-center justify-between gap-4 border-b border-(--border) p-5">
        <div>
          <h2 className="text-lg font-extrabold">Transações</h2>
          <p className="mt-1 text-sm text-(--muted)">
            Entradas e saídas do mês.
          </p>
        </div>

        <div className="rounded-full border border-(--border) px-3 py-1 text-xs font-semibold text-(--muted)">
          {loading ? "Carregando..." : `${transactions.length} itens`}
        </div>
      </div>

      {loading ? (
        <div className="p-5 text-sm text-(--muted)">Carregando transações...</div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="font-bold">Nenhuma transação neste mês.</div>
          <p className="mt-1 text-sm text-(--muted)">
            Crie uma transação para começar o controle.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-(--border) text-left text-xs uppercase tracking-wide text-(--muted)">
                <th className="px-5 py-3 font-semibold">Transação</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Data</th>
                <th className="px-5 py-3 text-right font-semibold">Valor</th>
                <th className="px-5 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {transactions.map((t) => {
                const isExpense = t.type === "EXPENSE";

                return (
                  <tr
                    key={t.id}
                    className="transition hover:bg-[color-mix(in_srgb,var(--surface),#000_4%)]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-(--text)">{t.name}</div>
                      <div className="mt-1 max-w-[360px] truncate text-xs text-(--muted)">
                        {t.description || "Sem descrição"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-(--border) px-3 py-1 text-xs font-semibold text-(--muted)">
                        {t.categoryName || "Sem categoria"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-(--muted)">
                      {t.date}
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-extrabold ${
                        isExpense ? "text-red-700" : "text-emerald-700"
                      }`}
                    >
                      {isExpense ? "-" : "+"}
                      {formatBRL(t.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(t)}
                          className="rounded-xl border border-(--border) px-3 py-2 text-xs font-semibold text-(--text) transition hover:opacity-75"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(t)}
                          className="rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition hover:opacity-75"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}