const items = [
  { id: "overview", label: "Visão geral", icon: "📊" },
  { id: "transactions", label: "Transações", icon: "💸" },
  { id: "fixedBills", label: "Contas fixas", icon: "📌" },
  { id: "goals", label: "Metas", icon: "🎯" },
  { id: "categories", label: "Categorias", icon: "🏷️" },
  { id: "stats", label: "Estatísticas", icon: "📈" },
];

export default function Sidebar({ activePage, onChangePage }) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] border-r border-(--border) bg-(--surface) px-4 py-5 xl:flex xl:flex-col">
      <div className="mb-8 rounded-3xl bg-(--surface-soft) px-5 py-5">
        <div className="text-xl font-black tracking-tight text-(--text)">
          Ascenda
        </div>
        <div className="mt-1 text-xs font-semibold text-(--muted)">
          Controle financeiro
        </div>
      </div>

      <nav className="grid gap-2">
        {items.map((item) => {
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangePage(item.id)}
              className={[
                "group flex h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm font-extrabold transition",
                active
                  ? "bg-(--btn-bg) text-(--btn-text) shadow-(--shadow)"
                  : "text-(--muted) hover:bg-(--surface-soft) hover:text-(--text)",
              ].join(" ")}
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-(--surface-muted)">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}