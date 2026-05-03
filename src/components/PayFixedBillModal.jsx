import { useEffect, useMemo, useState } from "react";
import { formatBRL } from "../utils/money";

export default function PayFixedBillModal({
  open,
  bill,
  loading = false,
  onClose,
  onConfirm,
}) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open || !bill) return;

    const initial = bill.defaultAmount ?? bill.amount ?? "";
    setAmount(String(initial).replace(".", ","));
  }, [open, bill]);

  const parsedAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canSave = !loading && parsedAmount > 0;

  function close() {
    if (loading) return;
    onClose?.();
  }

  async function submit(e) {
    e.preventDefault();
    if (!canSave || !bill) return;

    await onConfirm?.({
      amount: Number(parsedAmount.toFixed(2)),
    });
  }

  if (!open || !bill) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-6">
      <button
        type="button"
        onClick={close}
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)]">
        <h2 className="text-xl font-extrabold">Pagar conta fixa</h2>

        <div className="mt-4 rounded-2xl border border-(--border) p-4">
          <div className="font-bold">{bill.name}</div>

          <div className="mt-2 text-sm text-(--muted)">
            Vence dia {bill.dueDay}
          </div>

          <div className="mt-1 text-sm text-(--muted)">
            Valor padrão: {formatBRL(bill.defaultAmount ?? bill.amount)}
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Valor pago
            </span>
            <input
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-semibold"
            >
              Cancelar
            </button>

            <button
              disabled={!canSave}
              className="rounded-2xl bg-[#111] px-4 py-3 text-sm font-bold text-white"
            >
              {loading ? "Salvando..." : "Confirmar pagamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}