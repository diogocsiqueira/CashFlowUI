import { useEffect, useMemo, useState } from "react";

export default function FixedBillModal({
  open,
  loading = false,
  bill = null,
  categories = [],
  onClose,
  onSubmit,
  onOpenCreateCategory,
}) {
  const isEditing = Boolean(bill?.fixedBillId ?? bill?.id);

  const [name, setName] = useState("");
  const [defaultAmount, setDefaultAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(bill?.name || "");
    setDefaultAmount(
      bill?.defaultAmount != null
        ? String(bill.defaultAmount).replace(".", ",")
        : bill?.amount != null
          ? String(bill.amount).replace(".", ",")
          : ""
    );
    setDueDay(bill?.dueDay ? String(bill.dueDay) : "");
    setCategoryId(bill?.categoryId ? String(bill.categoryId) : "");
  }, [open, bill]);

  const parsedAmount = useMemo(() => {
    const n = Number(String(defaultAmount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [defaultAmount]);

  const parsedDueDay = Number(dueDay);

  const canSave =
    !loading &&
    name.trim().length > 0 &&
    parsedAmount > 0 &&
    parsedDueDay >= 1 &&
    parsedDueDay <= 31;

  function close() {
    if (loading) return;
    onClose?.();
  }

  async function submit(e) {
    e.preventDefault();
    if (!canSave) return;

    await onSubmit?.({
      id: bill?.fixedBillId ?? bill?.id,
      name: name.trim(),
      amount: Number(parsedAmount.toFixed(2)),
      dueDay: parsedDueDay,
      categoryId: categoryId ? Number(categoryId) : null,
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-6">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={close}
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-xl rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">
              {isEditing ? "Editar conta fixa" : "Nova conta fixa"}
            </h2>
            <p className="mt-1 text-sm text-(--muted)">
              Cadastre uma despesa recorrente do mês.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm font-semibold hover:opacity-75 disabled:opacity-50"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
              Nome
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Internet"
              className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                Valor padrão
              </span>
              <input
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                Vencimento
              </span>
              <input
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                inputMode="numeric"
                placeholder="Dia do mês"
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                Categoria
              </span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
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
              onClick={onOpenCreateCategory}
              className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-semibold hover:opacity-75 disabled:opacity-50"
            >
              + Categoria
            </button>
          </div>

          <button
            disabled={!canSave}
            className="rounded-2xl bg-[#111] px-4 py-3 font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar conta fixa"}
          </button>
        </form>
      </div>
    </div>
  );
}