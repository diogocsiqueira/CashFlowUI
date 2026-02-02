export default function FixedBillsStatusCard({ bills = [] }) {
  const total = bills.length;
  const paid = bills.filter(b => b.paid).length;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) flex flex-col justify-center">
      <div className="text-sm font-medium text-(--muted)">
        Contas fixas
      </div>

      {total === 0 ? (
        <>
          <div className="mt-2 text-lg font-semibold text-(--text)">
            Nenhuma cadastrada
          </div>
          <div className="mt-1 text-sm text-(--muted)">
            Adicione contas para acompanhar pagamentos.
          </div>
        </>
      ) : (
        <>
          <div className="mt-2 text-3xl font-bold text-(--text)">
            {paid} / {total}
          </div>
          <div className="mt-1 text-sm text-(--muted)">
            pagas neste mês
          </div>
        </>
      )}
    </section>
  );
}
