import { useMemo, useState } from "react";
import { todayISO } from "../utils/dates";

export default function QuickAddCard({
  onCreateTransaction,
  busy = false,
  categories = [],
}) {
  const [type, setType] = useState("EXPENSE");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const numericAmount = useMemo(() => {
    const n = Number(String(amount).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  async function submit(e) {
    e.preventDefault();
    if (numericAmount <= 0 || !name.trim()) return;

    await onCreateTransaction?.({
      name: name.trim(),
      type,
      amount: Number(numericAmount.toFixed(2)),
      date: todayISO(),
      categoryId: categoryId ? Number(categoryId) : null,
      description: description.trim() || null,
    });

    setName("");
    setAmount("");
    setDescription("");
    setCategoryId("");
  }

  return (
    <section className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-100">Novo lançamento</div>

        <div className="flex rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              type === "EXPENSE"
                ? "bg-sky-500/15 text-sky-100"
                : "text-slate-300 hover:text-slate-100",
            ].join(" ")}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              type === "INCOME"
                ? "bg-sky-500/15 text-sky-100"
                : "text-slate-300 hover:text-slate-100",
            ].join(" ")}
          >
            Ganho
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="mt-3 grid gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da transação"
          className="rounded-xl bg-white/5 px-3 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500/30 ring-1 ring-white/10"
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="Valor"
            className="rounded-xl bg-white/5 px-3 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500/30 ring-1 ring-white/10"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-xl bg-white/5 px-3 py-2.5 text-slate-100 outline-none focus:ring-2 focus:ring-sky-500/30 ring-1 ring-white/10"
          >
            <option value="" className="bg-slate-950">
              Sem categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-slate-950">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className="rounded-xl bg-white/5 px-3 py-2.5 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500/30 ring-1 ring-white/10"
        />

        <button
          disabled={busy || numericAmount <= 0 || !name.trim()}
          className="rounded-xl bg-sky-500/15 px-4 py-2.5 font-semibold text-sky-100 transition hover:bg-sky-500/20 disabled:opacity-50 ring-1 ring-sky-400/20"
        >
          {busy ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </section>
  );
}
