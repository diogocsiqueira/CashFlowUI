import { useMemo, useState } from "react";

export default function CreateFixedBillModal({
  open,
  loading = false,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState(10);

  const parsedAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const dueOk = Number(dueDay) >= 1 && Number(dueDay) <= 31;
  const nameOk = name.trim().length >= 2;
  const amountOk = parsedAmount > 0;
  const canSave = nameOk && amountOk && dueOk && !loading;

  function reset() {
    setName("");
    setAmount("");
    setDueDay(10);
  }

  function close() {
    if (loading) return;
    reset();
    onClose();
  }

  async function submit(e) {
    e.preventDefault();
    if (!canSave) return;

    await onCreate({
      name: name.trim(),
      amount: Number(parsedAmount.toFixed(2)),
      dueDay: Number(dueDay),
    });

    reset();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={close} />

      <div className="relative w-full sm:max-w-md m-3 rounded-3xl
                      border border-(--border)
                      bg-(--surface)
                      p-5 shadow-[0_30px_80px_rgba(0,0,0,.20)">

        <div className="text-base font-bold text-(--text)">
          Nova conta fixa
        </div>

        <div className="mt-1 text-sm text-(--muted)">
          Preencha e salve. Ela vai aparecer no checklist do mês.
        </div>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs text-(--muted)">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Internet"
              className="rounded-xl border border-(--border)
                         bg-transparent px-3 py-2.5
                         text-sm text-(--text)
                         outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-xs text-(--muted)">Valor</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="120,00"
                className="rounded-xl border border-(--border)
                           bg-transparent px-3 py-2.5
                           text-sm text-(--text)
                           outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-xs text-(--muted)">Vencimento</label>
              <input
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                inputMode="numeric"
                placeholder="10"
                className="rounded-xl border border-(--border)
                           bg-transparent px-3 py-2.5
                           text-sm text-(--text)
                           outline-none focus:ring-2 focus:ring-black/10"
              />
              <div className="text-[11px] text-(--muted)">Dia 1 a 31</div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 justify-end">
            {/* Cancelar */}
            <button
              type="button"
              disabled={loading}
              onClick={close}
              className="px-4 py-2 rounded-xl
                         border border-(--border)
                         bg-(--btn-muted-bg)
                         text-(--btn-muted-text)
                         hover:opacity-90 disabled:opacity-50">
              Cancelar
            </button>

            {/* Salvar */}
            <button
              disabled={!canSave}
              className="px-4 py-2 rounded-xl font-semibold
                         bg-(--btn-bg)
                         text-(--btn-text)
                         hover:opacity-90 disabled:opacity-50">
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {!nameOk && name.length > 0 && (
            <div className="text-xs text-red-600">Nome muito curto.</div>
          )}
          {!amountOk && amount.length > 0 && (
            <div className="text-xs text-red-600">Valor inválido.</div>
          )}
          {!dueOk && String(dueDay).length > 0 && (
            <div className="text-xs text-red-600">
              Vencimento precisa ser 1 a 31.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
