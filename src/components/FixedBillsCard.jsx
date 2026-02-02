import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { formatBRL } from "../utils/money";

export default function FixedBillsCard({ bills, onToggle, busy }) {
  const [confirm, setConfirm] = useState({ open: false, bill: null });

  function ask(bill) {
    setConfirm({ open: true, bill });
  }

  async function doToggle() {
    if (!confirm.bill) return;
    await onToggle(confirm.bill);
    setConfirm({ open: false, bill: null });
  }

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Contas fixas</div>
        <div className="text-xs text-(--muted)">{bills.length} itens</div>
      </div>

      {bills.length === 0 ? (
        <div className="mt-3 text-sm text-(--muted)">
          Nenhuma conta fixa cadastrada.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5">
          {bills.map((b) => (
            <button
              key={b.fixedBillId}
              disabled={busy}
              onClick={() => ask(b)}
              className="w-full text-left px-4 py-3 hover:bg-black/3 disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{b.name}</div>
                  <div className="mt-0.5 text-xs text-(--muted)">
                    vence dia {b.dueDay} • {formatBRL(b.amount)}
                  </div>
                </div>

                <span
                  className={[
                    "text-xs font-semibold px-2 py-1 rounded-full border",
                    b.paid
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-700 border-black/10",
                  ].join(" ")}
                >
                  {b.paid ? "Pago" : "Pendente"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirm.open}
        title={confirm.bill?.paid ? "Desmarcar pagamento?" : "Confirmar pagamento?"}
        message={
          confirm.bill?.paid
            ? `Isso vai desfazer o pagamento de "${confirm.bill?.name}" neste mês.`
            : `Isso vai marcar "${confirm.bill?.name}" como paga e criar a despesa automaticamente.`
        }
        confirmText={confirm.bill?.paid ? "Desmarcar" : "Confirmar"}
        danger={!!confirm.bill?.paid}
        loading={busy}
        onConfirm={doToggle}
        onClose={() => setConfirm({ open: false, bill: null })}
      />
    </section>
  );
}
