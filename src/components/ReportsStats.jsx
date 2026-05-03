import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#38BDF8",
  "#A78BFA",
  "#22C55E",
  "#FACC15",
  "#FB7185",
  "#F97316",
  "#2DD4BF",
  "#C084FC",
];

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatMonth(item) {
  return `${item.year}-${String(item.month).padStart(2, "0")}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text) shadow-(--shadow)">
      <p className="mb-2 font-bold">{label}</p>

      {payload.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-5">
          <span className="text-(--muted)">{item.name || item.dataKey}</span>
          <strong>{money(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function Card({ title, value, description, tone = "sky" }) {
  const tones = {
    sky: "from-sky-500/20 to-cyan-400/5 ring-sky-400/20",
    green: "from-emerald-500/20 to-green-400/5 ring-emerald-400/20",
    red: "from-rose-500/20 to-red-400/5 ring-rose-400/20",
    violet: "from-violet-500/20 to-fuchsia-400/5 ring-violet-400/20",
  };

  return (
    <div
      className={`rounded-3xl border border-(--border) bg-gradient-to-br ${tones[tone]} p-5 shadow-(--shadow) ring-1`}
    >
      <p className="text-sm font-semibold text-(--muted)">{title}</p>

      <div className="mt-2 text-2xl font-black tracking-tight text-(--text)">
        {money(value)}
      </div>

      {description && (
        <p className="mt-2 text-xs leading-relaxed text-(--muted)">
          {description}
        </p>
      )}
    </div>
  );
}

function ChartBox({ title, description, children }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-(--text)">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-(--muted)">{description}</p>
          )}
        </div>
      </div>

      <div className="h-[330px]">{children}</div>
    </section>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-(--border) bg-(--surface-muted) text-sm text-(--muted)">
      {text}
    </div>
  );
}

function CustomPieLabel({ name, percent }) {
  return `${name} ${(percent * 100).toFixed(0)}%`;
}

export default function ReportsStats({ report, loading }) {
  if (loading && !report) {
    return (
      <section className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <p className="text-sm font-semibold text-(--muted)">
          Carregando relatórios...
        </p>
      </section>
    );
  }

  if (!report) {
    return (
      <section className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <h2 className="text-xl font-black text-(--text)">Estatísticas</h2>
        <p className="mt-1 text-sm text-(--muted)">
          Nenhum dado encontrado para esse período.
        </p>
      </section>
    );
  }

  const expensesByCategory = report.expensesByCategory || [];

  const monthlyBalance = (report.monthlyBalance || []).map((item) => ({
    ...item,
    label: formatMonth(item),
  }));

  const incomeVsExpense = (report.incomeVsExpense || []).map((item) => ({
    ...item,
    label: formatMonth(item),
  }));

  const axisTick = {
    fill: "var(--muted)",
    fontSize: 12,
    fontWeight: 700,
  };

  const axisTickSoft = {
    fill: "var(--muted)",
    fontSize: 12,
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-(--text)">
              Estatísticas
            </h2>

            <p className="mt-1 text-sm text-(--muted)">
              Relatórios calculados no backend e renderizados no front.
            </p>
          </div>

          {loading && (
            <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-bold text-sky-500 ring-1 ring-sky-400/20">
              Atualizando...
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card title="Receitas" value={report.totalIncome} description="Total de entradas no período" tone="green" />
          <Card title="Despesas" value={report.totalExpense} description="Total de saídas no período" tone="red" />
          <Card title="Saldo" value={report.balance} description="Receitas menos despesas" tone="sky" />
          <Card title="Pendências" value={report.pendingAmount} description="Contas fixas não pagas" tone="violet" />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartBox title="Gastos por categoria" description="Ranking das categorias com maior saída.">
          {expensesByCategory.length === 0 ? (
            <EmptyChart text="Sem despesas por categoria nesse período." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expensesByCategory} barCategoryGap={28}>
                <CartesianGrid stroke="var(--border)" vertical={false} />

                <XAxis dataKey="category" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickSoft} axisLine={false} tickLine={false} />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="amount" name="Valor" radius={[12, 12, 0, 0]}>
                  {expensesByCategory.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}

                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) => money(value)}
                    fill="var(--text)"
                    fontSize={11}
                    fontWeight={800}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartBox>

        <ChartBox title="Distribuição dos gastos" description="Participação visual de cada categoria.">
          {expensesByCategory.length === 0 ? (
            <EmptyChart text="Sem dados para gerar pizza." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={72}
                  outerRadius={118}
                  paddingAngle={3}
                  label={CustomPieLabel}
                  labelLine={false}
                >
                  {expensesByCategory.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="var(--surface)"
                      strokeWidth={4}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartBox>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartBox title="Evolução do saldo" description="Saldo mensal dentro do intervalo selecionado.">
          {monthlyBalance.length === 0 ? (
            <EmptyChart text="Sem evolução mensal nesse período." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBalance}>
                <CartesianGrid stroke="var(--border)" vertical={false} />

                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickSoft} axisLine={false} tickLine={false} />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Saldo"
                  stroke="#38BDF8"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#38BDF8",
                    strokeWidth: 3,
                    stroke: "var(--surface)",
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartBox>

        <ChartBox title="Receitas x despesas" description="Comparativo mensal entre entrada e saída.">
          {incomeVsExpense.length === 0 ? (
            <EmptyChart text="Sem comparativo nesse período." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpense} barCategoryGap={30}>
                <CartesianGrid stroke="var(--border)" vertical={false} />

                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickSoft} axisLine={false} tickLine={false} />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="income" name="Receitas" fill="#22C55E" radius={[12, 12, 0, 0]}>
                  <LabelList
                    dataKey="income"
                    position="top"
                    formatter={(value) => money(value)}
                    fill="var(--text)"
                    fontSize={11}
                    fontWeight={800}
                  />
                </Bar>

                <Bar dataKey="expense" name="Despesas" fill="#FB7185" radius={[12, 12, 0, 0]}>
                  <LabelList
                    dataKey="expense"
                    position="top"
                    formatter={(value) => money(value)}
                    fill="var(--text)"
                    fontSize={11}
                    fontWeight={800}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartBox>
      </div>
    </div>
  );
}