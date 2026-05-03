import { useEffect, useState } from "react";
import { todayISO } from "../utils/dates";

export default function GoalContributionModal({
  open,
  goal,
  type,
  categories,
  loading,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    contributionDate: todayISO(),
    createTransaction: false,
    transactionCategoryId: "",
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      amount: "",
      description: "",
      contributionDate: todayISO(),
      createTransaction: false,
      transactionCategoryId: "",
    });
  }, [open]);

  if (!open || !goal) return null;

  const isWithdraw = type === "WITHDRAW";

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    await onSubmit({
      type,
      amount: Number(form.amount),
      description: form.description || null,
      contributionDate: form.contributionDate || todayISO(),
      createTransaction: form.createTransaction,
      transactionCategoryId: form.createTransaction
        ? Number(form.transactionCategoryId)
        : null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-(--border) bg-(--surface) p-6 text-(--text) shadow-(--shadow)"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">
              {isWithdraw ? "Sacar da meta" : "Aportar na meta"}
            </h2>
            <p className="mt-1 text-sm text-(--muted)">
              {goal.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-(--border) px-3 py-2 text-sm font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase text-(--muted)">
              Valor
            </span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase text-(--muted)">
              Descrição
            </span>
            <input
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              placeholder={isWithdraw ? "Resgate parcial" : "Aporte mensal"}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase text-(--muted)">
              Data
            </span>
            <input
              type="date"
              value={form.contributionDate}
              onChange={(e) => update("contributionDate", e.target.value)}
              className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg) p-4">
            <input
              type="checkbox"
              checked={form.createTransaction}
              onChange={(e) => update("createTransaction", e.target.checked)}
            />
            <span className="text-sm font-bold">
              Criar transação automática no caixa
            </span>
          </label>

          {form.createTransaction && (
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-(--muted)">
                Categoria da transação
              </span>
              <select
                value={form.transactionCategoryId}
                onChange={(e) => update("transactionCategoryId", e.target.value)}
                className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
                required
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-(--muted)">
                {isWithdraw
                  ? "Saque da meta cria uma entrada no caixa."
                  : "Aporte na meta cria uma saída no caixa."}
              </p>
            </label>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-bold hover:opacity-75"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            className="rounded-2xl bg-(--btn-bg) px-5 py-3 text-sm font-bold text-(--btn-text) transition hover:opacity-85 disabled:opacity-50"
          >
            {loading ? "Salvando..." : isWithdraw ? "Sacar" : "Aportar"}
          </button>
        </div>
      </form>
    </div>
  );
}