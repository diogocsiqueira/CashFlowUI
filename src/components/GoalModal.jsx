import { useEffect, useState } from "react";
import { todayISO } from "../utils/dates";

export default function GoalModal({ open, goal, loading, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetAmount: "",
    initialAmount: "0",
    deadlineDate: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!open) return;

    if (goal) {
      setForm({
        name: goal.name || "",
        description: goal.description || "",
        targetAmount: goal.targetAmount ?? "",
        initialAmount: goal.initialAmount ?? "0",
        deadlineDate: goal.deadlineDate || "",
        status: goal.status || "ACTIVE",
      });
    } else {
      setForm({
        name: "",
        description: "",
        targetAmount: "",
        initialAmount: "0",
        deadlineDate: "",
        status: "ACTIVE",
      });
    }
  }, [open, goal]);

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    await onSubmit({
      name: form.name,
      description: form.description || null,
      targetAmount: Number(form.targetAmount),
      initialAmount: Number(form.initialAmount || 0),
      deadlineDate: form.deadlineDate || null,
      ...(goal ? { status: form.status } : {}),
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-3xl border border-(--border) bg-(--surface) p-6 text-(--text) shadow-(--shadow)"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black">
              {goal ? "Editar meta" : "Nova meta"}
            </h2>
            <p className="mt-1 text-sm text-(--muted)">
              Defina um objetivo financeiro e acompanhe o progresso.
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
              Nome
            </span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              placeholder="Reserva de emergência"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-bold uppercase text-(--muted)">
              Descrição
            </span>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[90px] resize-none rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              placeholder="Ex: juntar dinheiro para 6 meses de custo fixo"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-(--muted)">
                Valor objetivo
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.targetAmount}
                onChange={(e) => update("targetAmount", e.target.value)}
                className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-(--muted)">
                Valor inicial
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.initialAmount}
                onChange={(e) => update("initialAmount", e.target.value)}
                className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase text-(--muted)">
                Data limite
              </span>
              <input
                type="date"
                min={todayISO()}
                value={form.deadlineDate}
                onChange={(e) => update("deadlineDate", e.target.value)}
                className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
              />
            </label>

            {goal && (
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase text-(--muted)">
                  Status
                </span>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="rounded-2xl border border-(--border) bg-(--bg) px-4 py-3 outline-none"
                >
                  <option value="ACTIVE">Ativa</option>
                  <option value="COMPLETED">Concluída</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </label>
            )}
          </div>
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
            {loading ? "Salvando..." : "Salvar meta"}
          </button>
        </div>
      </form>
    </div>
  );
}