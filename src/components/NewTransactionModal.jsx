import { useEffect, useMemo, useState } from "react";
import { todayISO } from "../utils/dates";

export default function NewTransactionModal({
  open,
  loading = false,
  onClose,
  onSubmit,
  categories = [],
  onOpenCreateCategory,
  transaction = null,
}) {
  const isEditing = Boolean(transaction?.id);

  const [type, setType] = useState("EXPENSE");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    if (!open) return;

    setType(transaction?.type || "EXPENSE");
    setName(transaction?.name || "");
    setAmount(
      transaction?.amount
        ? String(transaction.amount).replace(".", ",")
        : ""
    );
    setCategoryId(
      transaction?.categoryId ? String(transaction.categoryId) : ""
    );
    setDescription(transaction?.description || "");
    setDate(transaction?.date || todayISO());
    setShowDate(Boolean(transaction?.date));
  }, [open, transaction]);

  const numericAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canSave =
    !loading && numericAmount > 0 && name.trim().length > 0;

  function reset() {
    setType("EXPENSE");
    setName("");
    setAmount("");
    setCategoryId("");
    setDescription("");
    setDate(todayISO());
    setShowDate(false);
  }

  function handleClose() {
    if (loading) return;
    reset();
    onClose?.();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    await onSubmit?.({
      id: transaction?.id,
      name: name.trim(),
      type,
      amount: Number(numericAmount.toFixed(2)),
      date,
      categoryId: categoryId ? Number(categoryId) : null,
      description: description.trim() || null,
    });

    reset();
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      {/* overlay */}
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={handleClose}
        className="absolute inset-0"
      />

      {/* wrapper scrollável */}
      <div className="relative h-[100dvh] overflow-y-auto px-4 py-6">
        {/* modal */}
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)]">
          
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-(--text)">
                {isEditing ? "Editar transação" : "Nova transação"}
              </h2>
              <p className="mt-1 text-sm text-(--muted)">
                Informe os dados da movimentação financeira.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl border border-(--border) px-3 py-2 text-sm font-semibold text-(--text) transition hover:opacity-75 disabled:opacity-50"
            >
              Fechar
            </button>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            
            {/* tipo */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-(--border) p-1">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  type === "EXPENSE"
                    ? "bg-red-100 text-red-700"
                    : "text-(--muted) hover:text-(--text)"
                }`}
              >
                Gasto
              </button>

              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  type === "INCOME"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-(--muted) hover:text-(--text)"
                }`}
              >
                Ganho
              </button>
            </div>

            {/* inputs */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-(--muted)">
                  Nome
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mercado"
                  className="rounded-2xl border border-(--border) px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-(--muted)">
                  Valor
                </span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder="0,00"
                  className="rounded-2xl border border-(--border) px-4 py-3"
                />
              </label>
            </div>

            {/* categoria */}
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-(--muted)">
                  Categoria
                </span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="rounded-2xl border border-(--border) px-4 py-3"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                disabled={loading}
                onClick={() => onOpenCreateCategory?.()}
                className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-semibold"
              >
                + Categoria
              </button>
            </div>

            {/* descrição */}
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase text-(--muted)">
                Descrição
              </span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
                className="rounded-2xl border border-(--border) px-4 py-3"
              />
            </label>

            {/* data */}
            <div className="rounded-2xl border border-(--border) p-3">
              <button
                type="button"
                onClick={() => setShowDate((v) => !v)}
                className="text-xs font-semibold text-(--muted)"
              >
                {showDate ? `Data: ${date}` : "Alterar data"}
              </button>

              {showDate && (
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-(--border) px-4 py-3"
                />
              )}
            </div>

            {/* submit */}
            <button
              disabled={!canSave}
              className="rounded-2xl bg-black px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading
                ? "Salvando..."
                : isEditing
                ? "Salvar alterações"
                : "Salvar transação"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}