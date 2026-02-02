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

export default function QuickAddCard({ onCreateTransaction, busy }) {
  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("OUTROS");
  const [description, setDescription] = useState("");

  const numericAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  async function submit(e) {
    e.preventDefault();
    if (numericAmount <= 0) return;

    await onCreateTransaction({
      type,
      amount: Number(numericAmount.toFixed(2)),
      date: todayISO(),
      category,
      description: description.trim() || null,
    });

    setAmount("");
    setDescription("");
  }

  return (
    <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-100">Novo lançamento</div>

        <div className="flex rounded-xl bg-white/5 ring-1 ring-white/10 p-1">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition",
              type === "EXPENSE" ? "bg-sky-500/15 text-sky-100" : "text-slate-300 hover:text-slate-100",
            ].join(" ")}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={[
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition",
              type === "INCOME" ? "bg-sky-500/15 text-sky-100" : "text-slate-300 hover:text-slate-100",
            ].join(" ")}
          >
            Ganho
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="mt-3 grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Valor"
            className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-950">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500/30"
        />

        <button
          disabled={busy || numericAmount <= 0}
          className="rounded-xl bg-sky-500/15 ring-1 ring-sky-400/20 px-4 py-2.5 font-semibold text-sky-100 hover:bg-sky-500/20 disabled:opacity-50 transition"
        >
          {busy ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  );
}
