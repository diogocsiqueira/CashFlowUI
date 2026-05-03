const items = [
  { id: "overview", label: "Início", icon: "📊" },
  { id: "transactions", label: "Transações", icon: "💸" },
  { id: "fixedBills", label: "Contas", icon: "📌" },
  { id: "goals", label: "Metas", icon: "🎯" },
  { id: "stats", label: "Stats", icon: "📈" },
];

export default function MobileNav({ activePage, onChangePage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-(--border) bg-(--surface) px-3 py-2 shadow-(--shadow) xl:hidden">
  <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2">
    {items.map((item) => {
      const active = activePage === item.id;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onChangePage(item.id)}
          className={[
            "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-[11px] font-black transition",
            active
              ? "bg-(--btn-bg) text-(--btn-text)"
              : "text-(--muted) hover:bg-(--btn-muted-bg) hover:text-(--text)",
          ].join(" ")}
        >
          <span className="text-base">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </button>
      );
    })}
  </div>
</nav>
  );
}