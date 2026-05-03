export default function ConfirmDeleteModal({
  open,
  loading = false,
  title = "Confirmar exclusão",
  message = "Tem certeza que deseja excluir este item?",
  confirmText = "Excluir",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={loading ? undefined : onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)]">
        <h2 className="text-xl font-extrabold text-(--text)">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-(--muted)">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-semibold text-(--text) transition hover:opacity-75 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Excluindo..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}