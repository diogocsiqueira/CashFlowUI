export default function ConfirmModal({
  open,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative w-full sm:max-w-md m-3 rounded-3xl border border-black/10 bg-(--surface) p-5 shadow-[0_30px_80px_rgba(0,0,0,.20)]">
        <div className="text-base font-bold text-[#111]">{title}</div>
        <div className="mt-2 text-sm text-gray-600 leading-relaxed">{message}</div>

        <div className="mt-5 flex gap-2 justify-end">
          <button
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-black/10 bg-(--surface) text-[#111] hover:bg-black/3 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={[
              "px-4 py-2 rounded-xl font-semibold text-white disabled:opacity-50",
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#111] hover:bg-black",
            ].join(" ")}
          >
            {loading ? "..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
