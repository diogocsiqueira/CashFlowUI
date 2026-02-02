import { useMemo, useState } from "react";
import { todayISO } from "../utils/dates";

const CATEGORIES = [
  { value: "ALMOCO_TRABALHO", label: "Almoço trabalho" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "MERCADO", label: "Mercado" },
  { value: "TRANSPORTE", label: "Transporte" },
  { value: "LAZER", label: "Lazer" },
  { value: "OUTROS", label: "Outros" },
];

export default function NewTransactionModal({ open, loading, onClose, onSubmit }) {
  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("OUTROS");
  const [description, setDescription] = useState("");

  const numericAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  function reset() {
    setType("EXPENSE");
    setAmount("");
    setCategory("OUTROS");
    setDescription("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (numericAmount <= 0) return;

    await onSubmit({
      type,
      amount: Number(numericAmount.toFixed(2)),
      date: todayISO(),
      category,
      description: description.trim() || null,
    });

    reset();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/35"
        onClick={loading ? undefined : () => { reset(); onClose(); }}
      />

      <div className="relative w-full sm:max-w-md m-3 rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-[0_30px_80px_rgba(0,0,0,.20)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-bold text-(--text)">Nova transação</div>
            <div className="mt-1 text-sm text-(--muted)">
              Um lançamento rápido, sem bagunça.
            </div>
          </div>

          <button
            disabled={loading}
            onClick={() => { reset(); onClose(); }}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--text) hover:bg-black/3 disabled:opacity-50"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          {/* Tipo */}
          <div className="flex rounded-2xl border border-(--border) bg-(--surface) p-1">
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                type === "EXPENSE"
                  ? "bg-black/6 text-(--text)"
                  : "text-(--muted) hover:text-(--text)",
              ].join(" ")}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                type === "INCOME"
                  ? "bg-black/6 text-(--text)"
                  : "text-(--muted) hover:text-(--text)",
              ].join(" ")}
            >
              Ganho
            </button>
          </div>

          {/* Valor + Categoria */}
          <div className="grid grid-cols-2 gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="Valor"
              className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
          />

          {/* Botão salvar */}
          <button
            disabled={loading || numericAmount <= 0}
            className="rounded-2xl bg-[#111] px-4 py-3 font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

          <div className="text-xs text-(--muted)">
            Dica: você pode usar vírgula no valor (ex: 26,50).
          </div>
        </form>
      </div>
    </div>
  );
}
