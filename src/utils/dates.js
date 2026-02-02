export function currentMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // YYYY-MM
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function monthLabel(yyyyMM) {
  const [y, m] = yyyyMM.split("-").map(Number);
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
