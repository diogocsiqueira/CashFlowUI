import { useState } from "react";

export default function CreateCategoryModal({
  open,
  loading = false,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");

  const canSave = !loading && name.trim().length > 0;

  function reset() {
    setName("");
  }

  function close() {
    if (loading) return;
    reset();
    onClose?.();
  }

  async function submit(e) {
    e.preventDefault();
    if (!canSave) return;

    await onCreate?.({ name: name.trim() });
    reset();
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/35" onClick={close} />

      <div className="relative m-3 w-full rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-[0_30px_80px_rgba(0,0,0,.20)] sm:max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-bold text-(--text)">Nova categoria</div>
            <div className="mt-1 text-sm text-(--muted)">
              Crie uma categoria para organizar melhor transações e contas fixas.
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={close}
            className="rounded-xl border border-(--border) px-3 py-2 text-sm text-(--text) hover:bg-black/5 disabled:opacity-50"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 grid gap-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Alimentação"
            className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text) outline-none focus:ring-2 focus:ring-black/10"
          />

          <button
            disabled={!canSave}
            className="rounded-2xl bg-[#111] px-4 py-3 font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar categoria"}
          </button>
        </form>
      </div>
    </div>
  );
}
