import { useEffect, useMemo, useState } from "react";
import { caixaApi } from "../api/caixaApi";
import MonthPicker from "../components/MonthPicker";
import SummaryCard from "../components/SummaryCard";
import FixedBillsCard from "../components/FixedBillsCard";
import TransactionsCard from "../components/TransactionsCard";
import { currentMonth } from "../utils/dates";
import NewTransactionModal from "../components/NewTransactionModal";
import FixedBillsStatusCard from "../components/FixedBillsStatusCard";
import CreateCategoryModal from "../components/CreateCategoryModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import ReportsStats from "../components/ReportsStats";
import { authApi } from "../api/authApi";
import { useTheme } from "../hooks/useTheme";
import GoalsPage from "../components/GoalsPage";

const pageTitles = {
  overview: "Visão geral",
  transactions: "Transações",
  fixedBills: "Contas fixas",
  goals: "Metas",
  categories: "Categorias",
  stats: "Estatísticas",
};

function monthRange(month) {
  const [year, monthNumber] = month.split("-").map(Number);

  const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
  const lastDay = new Date(year, monthNumber, 0).getDate();
  const endDate = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
    lastDay
  ).padStart(2, "0")}`;

  return { startDate, endDate };
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getTransactionValue(transaction) {
  return (
    transaction.amount ??
    transaction.value ??
    transaction.valor ??
    transaction.total ??
    0
  );
}

function getTransactionName(transaction) {
  return (
    transaction.name ??
    transaction.description ??
    transaction.title ??
    transaction.categoryName ??
    "Transação"
  );
}

function getTransactionType(transaction) {
  return transaction.type ?? transaction.kind ?? transaction.transactionType;
}

function isIncome(transaction) {
  const type = String(getTransactionType(transaction) || "").toUpperCase();
  return type === "INCOME" || type === "ENTRADA" || type === "RECEITA";
}

function getBillName(bill) {
  return bill.name ?? bill.description ?? bill.title ?? "Conta fixa";
}

function getBillValue(bill) {
  return bill.amount ?? bill.value ?? bill.valor ?? 0;
}

function getBillDueDay(bill) {
  return bill.dueDay ?? bill.day ?? bill.vencimento ?? bill.dueDate;
}

function isBillPaid(bill) {
  return Boolean(bill.paid ?? bill.isPaid ?? bill.paymentId ?? bill.paidAt);
}

function MiniListCard({
  title,
  subtitle,
  count,
  emptyText,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <section className="min-h-[260px] rounded-3xl border border-(--border) bg-(--surface) shadow-(--shadow)">
      <div className="flex items-start justify-between gap-4 border-b border-(--border) p-5">
        <div>
          <h2 className="text-lg font-extrabold">{title}</h2>
          <p className="mt-1 text-sm text-(--muted)">{subtitle}</p>
        </div>

        <span className="rounded-full border border-(--border) px-3 py-1 text-xs font-bold text-(--muted)">
          {count}
        </span>
      </div>

      <div className="p-5">
        {children || (
          <div className="flex min-h-[130px] items-center justify-center rounded-2xl border border-dashed border-(--border) text-center text-sm text-(--muted)">
            {emptyText}
          </div>
        )}

        {onAction && (
          <button
            onClick={onAction}
            className="mt-4 w-full rounded-2xl border border-(--border) bg-(--btn-muted-bg) px-4 py-3 text-sm font-bold text-(--btn-muted-text) transition hover:opacity-80"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}

function OverviewTransactions({ transactions, onGoToTransactions }) {
  const latestTransactions = useMemo(() => {
    return [...transactions].slice(0, 5);
  }, [transactions]);

  return (
    <MiniListCard
      title="Últimas transações"
      subtitle="Resumo rápido do mês."
      count={`${transactions.length} itens`}
      emptyText="Nenhuma transação neste mês."
      actionLabel="Ver todas as transações"
      onAction={onGoToTransactions}
    >
      {latestTransactions.length > 0 && (
        <div className="grid gap-3">
          {latestTransactions.map((transaction) => {
            const income = isIncome(transaction);
            const value = getTransactionValue(transaction);

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-(--border) p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">
                    {getTransactionName(transaction)}
                  </p>
                  <p className="mt-1 text-xs text-(--muted)">
                    {transaction.categoryName ||
                      transaction.category?.name ||
                      "Sem categoria"}
                  </p>
                </div>

                <strong
                  className={
                    income
                      ? "shrink-0 text-sm text-emerald-500"
                      : "shrink-0 text-sm text-red-500"
                  }
                >
                  {income ? "+" : "-"} {money(value)}
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </MiniListCard>
  );
}

function OverviewBills({ bills, onGoToBills }) {
  const pendingBills = useMemo(() => {
    return bills.filter((bill) => !isBillPaid(bill)).slice(0, 4);
  }, [bills]);

  const paidCount = bills.filter(isBillPaid).length;
  const totalCount = bills.length;
  const totalPending = bills
    .filter((bill) => !isBillPaid(bill))
    .reduce((acc, bill) => acc + Number(getBillValue(bill) || 0), 0);

  return (
    <MiniListCard
      title="Contas a vencer"
      subtitle={`${paidCount}/${totalCount} pagas neste mês.`}
      count={money(totalPending)}
      emptyText="Nenhuma conta pendente."
      actionLabel="Gerenciar contas fixas"
      onAction={onGoToBills}
    >
      {pendingBills.length > 0 && (
        <div className="grid gap-3">
          {pendingBills.map((bill) => (
            <div
              key={bill.fixedBillId ?? bill.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-(--border) p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">
                  {getBillName(bill)}
                </p>
                <p className="mt-1 text-xs text-(--muted)">
                  Vence dia {getBillDueDay(bill) || "-"}
                </p>
              </div>

              <strong className="shrink-0 text-sm">
                {money(getBillValue(bill))}
              </strong>
            </div>
          ))}
        </div>
      )}
    </MiniListCard>
  );
}

function OverviewStats({ summary, transactions, bills, onGoToStats }) {
  const expense = Number(summary.totalExpense || 0);
  const income = Number(summary.totalIncome || 0);
  const balance = Number(summary.balance || 0);
  const paidBills = bills.filter(isBillPaid).length;

  const expensePercent =
    income > 0 ? Math.min(100, Math.round((expense / income) * 100)) : 0;

  return (
    <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold">Leitura rápida</h2>
          <p className="mt-1 text-sm text-(--muted)">
            Sinais principais do mês.
          </p>
        </div>

        <button
          onClick={onGoToStats}
          className="rounded-2xl border border-(--border) px-4 py-2 text-sm font-bold transition hover:opacity-75"
        >
          Estatísticas
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        <div className="rounded-2xl border border-(--border) p-4">
          <p className="text-xs font-bold uppercase text-(--muted)">
            Uso da receita
          </p>
          <p className="mt-2 text-2xl font-black">{expensePercent}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-(--btn-muted-bg)">
            <div
              className="h-full rounded-full bg-red-500"
              style={{ width: `${expensePercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-(--border) p-4">
          <p className="text-xs font-bold uppercase text-(--muted)">
            Movimentações
          </p>
          <p className="mt-2 text-2xl font-black">{transactions.length}</p>
          <p className="mt-1 text-xs text-(--muted)">transações no mês</p>
        </div>

        <div className="rounded-2xl border border-(--border) p-4">
          <p className="text-xs font-bold uppercase text-(--muted)">
            Contas pagas
          </p>
          <p className="mt-2 text-2xl font-black">
            {paidBills}/{bills.length}
          </p>
          <p
            className={
              balance >= 0
                ? "mt-1 text-xs font-bold text-emerald-500"
                : "mt-1 text-xs font-bold text-red-500"
            }
          >
            Saldo: {money(balance)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [month, setMonth] = useState(currentMonth());

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [report, setReport] = useState(null);

  const [activePage, setActivePage] = useState("overview");

  const [newTxOpen, setNewTxOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { toggleTheme } = useTheme();

  async function reload(selectedMonth = month) {
    setLoading(true);
    setError("");

    try {
      const { startDate, endDate } = monthRange(selectedMonth);

      const [summaryRes, billsRes, txRes, catsRes, reportRes] =
        await Promise.allSettled([
          caixaApi.getSummary(selectedMonth),
          caixaApi.listFixedBillsChecklist(selectedMonth),
          caixaApi.listTransactions(selectedMonth),
          caixaApi.listCategories(),
          caixaApi.getReportsOverview({ startDate, endDate }),
        ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value);
      if (billsRes.status === "fulfilled") setBills(billsRes.value);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);
      if (catsRes.status === "fulfilled") setCategories(catsRes.value);
      if (reportRes.status === "fulfilled") setReport(reportRes.value);

      if (reportRes.status === "rejected") {
        console.error("Erro ao carregar relatórios:", reportRes.reason);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload(month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function onLogout() {
    try {
      await authApi.logout();
    } finally {
      window.location.href = "/login";
    }
  }

  function openCreateTransaction() {
    setEditingTransaction(null);
    setNewTxOpen(true);
  }

  function openEditTransaction(transaction) {
    setEditingTransaction(transaction);
    setNewTxOpen(true);
  }

  function closeTransactionModal() {
    setNewTxOpen(false);
    setEditingTransaction(null);
  }

  async function onSaveTransaction(payload) {
    setBusy(true);
    setError("");

    try {
      if (payload.id) {
        await caixaApi.updateTransaction(payload.id, payload);
      } else {
        await caixaApi.createTransaction(payload);
      }

      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao salvar transação");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  function askDeleteTransaction(transaction) {
    setTransactionToDelete(transaction);
  }

  async function confirmDeleteTransaction() {
    if (!transactionToDelete) return;

    setBusy(true);
    setError("");

    try {
      await caixaApi.deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao excluir transação");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateCategory(payload) {
    setBusy(true);
    setError("");

    try {
      const created = await caixaApi.createCategory(payload);
      await reload(month);
      setNewCategoryOpen(false);
      return created;
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao criar categoria");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function onPayFixedBill(bill, paymentPayload) {
    setBusy(true);
    setError("");

    try {
      const billId = bill.fixedBillId ?? bill.id;
      await caixaApi.payFixedBill(month, billId, paymentPayload);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao pagar conta fixa");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function onUnpayFixedBill(bill) {
    setBusy(true);
    setError("");

    try {
      const billId = bill.fixedBillId ?? bill.id;
      await caixaApi.unpayFixedBill(month, billId);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao desmarcar pagamento");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function onCreateFixedBill(payload) {
    setBusy(true);
    setError("");

    try {
      await caixaApi.createFixedBill(payload);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao criar conta fixa");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function onUpdateFixedBill(id, payload) {
    setBusy(true);
    setError("");

    try {
      await caixaApi.updateFixedBill(id, payload);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao editar conta fixa");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteFixedBill(bill) {
    setBusy(true);
    setError("");

    try {
      const billId = bill.fixedBillId ?? bill.id;
      await caixaApi.deleteFixedBill(billId);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao excluir conta fixa");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  function renderFixedBillsArea() {
    return (
      <>
        <FixedBillsStatusCard bills={bills} />

        <FixedBillsCard
          bills={bills}
          categories={categories}
          onPay={onPayFixedBill}
          onUnpay={onUnpayFixedBill}
          onCreate={onCreateFixedBill}
          onUpdate={onUpdateFixedBill}
          onDelete={onDeleteFixedBill}
          onOpenCreateCategory={() => setNewCategoryOpen(true)}
          busy={busy}
        />
      </>
    );
  }

  function renderOverview() {
    return (
      <div className="grid gap-6">
        <SummaryCard summary={summary} />

        <OverviewStats
          summary={summary}
          transactions={transactions}
          bills={bills}
          onGoToStats={() => setActivePage("stats")}
        />

        <div className="grid gap-6 2xl:grid-cols-2">
          <OverviewTransactions
            transactions={transactions}
            onGoToTransactions={() => setActivePage("transactions")}
          />

          <OverviewBills
            bills={bills}
            onGoToBills={() => setActivePage("fixedBills")}
          />
        </div>
      </div>
    );
  }

  function renderContent() {
    if (activePage === "overview") {
      return renderOverview();
    }

    if (activePage === "transactions") {
      return (
        <TransactionsCard
          transactions={transactions}
          loading={loading}
          onEdit={openEditTransaction}
          onDelete={askDeleteTransaction}
        />
      );
    }

    if (activePage === "fixedBills") {
      return (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          {renderFixedBillsArea()}
        </div>
      );
    }

    if (activePage === "goals") {
      return <GoalsPage categories={categories} />;
    }

    if (activePage === "categories") {
      return (
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">Categorias</h2>
              <p className="mt-1 text-sm text-(--muted)">
                Gerencie suas categorias de gastos e ganhos.
              </p>
            </div>

            <button
              onClick={() => setNewCategoryOpen(true)}
              className="rounded-2xl bg-(--btn-bg) px-4 py-3 text-sm font-bold text-(--btn-text) transition hover:opacity-85"
            >
              + Nova categoria
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.length === 0 ? (
              <div className="rounded-2xl border border-(--border) p-4 text-sm text-(--muted)">
                Nenhuma categoria cadastrada.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-(--border) p-4"
                >
                  <div className="font-bold">{category.name}</div>
                  <div className="mt-1 text-xs text-(--muted)">
                    Categoria cadastrada
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      );
    }

    if (activePage === "stats") {
      return <ReportsStats report={report} loading={loading} />;
    }

    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-(--bg) text-(--text)">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />
      <MobileNav activePage={activePage} onChangePage={setActivePage} />

      <div className="min-h-screen min-w-0 p-4 pb-32 xl:ml-[280px] xl:p-6">
        <header className="mb-6 rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow) xl:p-6">
          <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-(--muted)">
                {pageTitles[activePage]}
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
                Painel financeiro
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-(--muted)">
                Controle mensal de ganhos, gastos, contas fixas, metas e movimentações.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MonthPicker month={month} setMonth={setMonth} />

              <button
                onClick={openCreateTransaction}
                className="rounded-2xl bg-(--btn-bg) px-4 py-3 text-sm font-bold text-(--btn-text) transition hover:opacity-85"
              >
                + Nova transação
              </button>

              <button
                onClick={() => setNewCategoryOpen(true)}
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-semibold transition hover:opacity-75"
              >
                Categoria
              </button>

              <button
                onClick={toggleTheme}
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-semibold transition hover:opacity-75"
                title="Alternar tema"
              >
                🌓
              </button>

              <button
                onClick={onLogout}
                className="rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-semibold transition hover:opacity-75"
              >
                Sair
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
        </header>

        <main className="min-w-0">{renderContent()}</main>

        <footer className="mt-6 flex items-center justify-between text-xs text-(--muted) opacity-70">
          <span>{loading ? "Sincronizando..." : "Sincronizado"}</span>
          <span>© 2026 Ascenda · by Diogo</span>
        </footer>
      </div>

      <NewTransactionModal
        open={newTxOpen}
        loading={busy}
        categories={categories}
        transaction={editingTransaction}
        onOpenCreateCategory={() => setNewCategoryOpen(true)}
        onClose={closeTransactionModal}
        onSubmit={onSaveTransaction}
      />

      <CreateCategoryModal
        open={newCategoryOpen}
        loading={busy}
        onClose={() => setNewCategoryOpen(false)}
        onCreate={onCreateCategory}
      />

      <ConfirmDeleteModal
        open={Boolean(transactionToDelete)}
        loading={busy}
        title="Excluir transação"
        message={
          transactionToDelete
            ? `Tem certeza que deseja excluir "${transactionToDelete.name}"? Essa ação não poderá ser desfeita.`
            : ""
        }
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDeleteTransaction}
      />
    </div>
  );
}