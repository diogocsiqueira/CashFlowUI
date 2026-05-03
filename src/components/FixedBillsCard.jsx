import { useMemo, useState } from "react";
import { formatBRL } from "../utils/money";
import FixedBillModal from "./FixedBillModal";
import PayFixedBillModal from "./PayFixedBillModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function getBillId(bill) {
  return bill?.fixedBillId ?? bill?.id;
}

function getStatus(bill) {
  if (bill.paid) {
    return {
      label: "Pago",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  const dueDay = Number(bill.dueDay);
  const currentDay = new Date().getDate();

  if (dueDay < currentDay) {
    return {
      label: "Atrasada",
      className: "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (dueDay === currentDay) {
    return {
      label: "Vence hoje",
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    };
  }

  return {
    label: "Pendente",
    className: "border-black/10 bg-gray-50 text-gray-700",
  };
}

export default function FixedBillsCard({
  bills = [],
  categories = [],
  onPay,
  onUnpay,
  onCreate,
  onUpdate,
  onDelete,
  onOpenCreateCategory,
  busy = false,
}) {
  const [formModal, setFormModal] = useState({ open: false, bill: null });
  const [payModal, setPayModal] = useState({ open: false, bill: null });
  const [unpayModal, setUnpayModal] = useState({ open: false, bill: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, bill: null });

  const sortedBills = useMemo(() => {
    return [...bills].sort((a, b) => {
      if (a.paid !== b.paid) return a.paid ? 1 : -1;
      return Number(a.dueDay ?? 0) - Number(b.dueDay ?? 0);
    });
  }, [bills]);

  function openCreateBillModal() {
    setFormModal({ open: true, bill: null });
  }

  function openEditBillModal(bill) {
    setFormModal({ open: true, bill });
  }

  function openPayBillModal(bill) {
    setPayModal({ open: true, bill });
  }

  function openUnpayBillModal(bill) {
    setUnpayModal({ open: true, bill });
  }

  function openDeleteBillModal(bill) {
    setDeleteModal({ open: true, bill });
  }

  async function submitForm(payload) {
    if (payload.id) {
      await onUpdate?.(payload.id, payload);
    } else {
      await onCreate?.(payload);
    }

    setFormModal({ open: false, bill: null });
  }

  async function submitPay(payload) {
    if (!payModal.bill) return;

    await onPay?.(payModal.bill, payload);
    setPayModal({ open: false, bill: null });
  }

  async function submitUnpay() {
    if (!unpayModal.bill) return;

    await onUnpay?.(unpayModal.bill);
    setUnpayModal({ open: false, bill: null });
  }

  async function submitDelete() {
    if (!deleteModal.bill) return;

    await onDelete?.(deleteModal.bill);
    setDeleteModal({ open: false, bill: null });
  }

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) shadow-(--shadow)">
      <div className="flex items-center justify-between gap-4 border-b border-(--border) p-5">
        <div>
          <h2 className="text-lg font-extrabold">Contas fixas do mês</h2>
          <p className="mt-1 text-sm text-(--muted)">
            Controle pagamentos recorrentes com ações explícitas.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateBillModal}
          disabled={busy}
          className="rounded-2xl bg-[#111] px-4 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
        >
          + Nova conta
        </button>
      </div>

      {sortedBills.length === 0 ? (
        <div className="p-8 text-center">
          <div className="font-bold">Nenhuma conta fixa cadastrada.</div>
          <p className="mt-1 text-sm text-(--muted)">
            Cadastre aluguel, internet, energia e outras despesas recorrentes.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px]">
            <thead>
              <tr className="border-b border-(--border) text-left text-xs uppercase tracking-wide text-(--muted)">
                <th className="px-5 py-3 font-semibold">Conta</th>
                <th className="px-5 py-3 font-semibold">Categoria</th>
                <th className="px-5 py-3 font-semibold">Vencimento</th>
                <th className="px-5 py-3 text-right font-semibold">Valor</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {sortedBills.map((bill) => {
                const status = getStatus(bill);
                const billId = getBillId(bill);

                return (
                  <tr
                    key={billId}
                    className="transition hover:bg-[color-mix(in_srgb,var(--surface),#000_4%)]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold">{bill.name}</div>

                      {bill.defaultAmount != null &&
                        bill.amount != null &&
                        Number(bill.defaultAmount) !== Number(bill.amount) && (
                          <div className="mt-1 text-xs text-(--muted)">
                            Padrão: {formatBRL(bill.defaultAmount)}
                          </div>
                        )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-(--border) px-3 py-1 text-xs font-semibold text-(--muted)">
                        {bill.categoryName || "Sem categoria"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-(--muted)">
                      Dia {bill.dueDay}
                    </td>

                    <td className="px-5 py-4 text-right font-extrabold">
                      {formatBRL(bill.amount ?? bill.defaultAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {bill.paid ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => openUnpayBillModal(bill)}
                            className="rounded-xl border border-(--border) px-3 py-2 text-xs font-semibold hover:opacity-75 disabled:opacity-50"
                          >
                            Desmarcar
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => openPayBillModal(bill)}
                            className="rounded-xl bg-[#111] px-3 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50"
                          >
                            Pagar
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => openEditBillModal(bill)}
                          className="rounded-xl border border-(--border) px-3 py-2 text-xs font-semibold hover:opacity-75 disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => openDeleteBillModal(bill)}
                          className="rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 hover:opacity-75 disabled:opacity-50"
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

      <FixedBillModal
        open={formModal.open}
        bill={formModal.bill}
        loading={busy}
        categories={categories}
        onOpenCreateCategory={onOpenCreateCategory}
        onClose={() => setFormModal({ open: false, bill: null })}
        onSubmit={submitForm}
      />

      <PayFixedBillModal
        open={payModal.open}
        bill={payModal.bill}
        loading={busy}
        onClose={() => setPayModal({ open: false, bill: null })}
        onConfirm={submitPay}
      />

      <ConfirmDeleteModal
        open={unpayModal.open}
        loading={busy}
        title="Desmarcar pagamento"
        message={
          unpayModal.bill
            ? `Deseja desmarcar o pagamento de "${unpayModal.bill.name}" neste mês?`
            : ""
        }
        confirmText="Desmarcar"
        onClose={() => setUnpayModal({ open: false, bill: null })}
        onConfirm={submitUnpay}
      />

      <ConfirmDeleteModal
        open={deleteModal.open}
        loading={busy}
        title="Excluir conta fixa"
        message={
          deleteModal.bill
            ? `Deseja excluir "${deleteModal.bill.name}"? Essa ação remove a conta fixa do cadastro.`
            : ""
        }
        confirmText="Excluir"
        onClose={() => setDeleteModal({ open: false, bill: null })}
        onConfirm={submitDelete}
      />
    </section>
  );
}