import { useEffect, useState } from "react";
import { caixaApi } from "../api/caixaApi";
import MonthPicker from "../components/MonthPicker";
import SummaryCard from "../components/SummaryCard";
import FixedBillsCard from "../components/FixedBillsCard";
import TransactionsCard from "../components/TransactionsCard";
import { currentMonth } from "../utils/dates";
import NewTransactionModal from "../components/NewTransactionModal";


export default function Dashboard() {
  const [month, setMonth] = useState(currentMonth());

  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newTxOpen, setNewTxOpen] = useState(false);


  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload(selectedMonth = month) {
    setLoading(true);
    setError("");
    try {
      const [s, fb, tx] = await Promise.all([
        caixaApi.getSummary(selectedMonth),
        caixaApi.listFixedBillsChecklist(selectedMonth),
        caixaApi.listTransactions(selectedMonth),
      ]);

      setSummary(s);
      setBills(fb);
      setTransactions(tx);
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

  async function onCreateTransaction(payload) {
    setBusy(true);
    setError("");
    try {
      await caixaApi.createTransaction(payload);
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao salvar transação");
    } finally {
      setBusy(false);
    }
  }

  async function onToggleBill(bill) {
    setBusy(true);
    setError("");
    try {
      if (bill.paid) {
        await caixaApi.unpayFixedBill(month, bill.fixedBillId);
      } else {
        await caixaApi.payFixedBill(month, bill.fixedBillId);
      }
      await reload(month);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao atualizar conta fixa");
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
  } finally {
    setBusy(false);
  }
}


 return (
  <div className="min-h-screen bg-(--bg) text-(--text)">
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <MonthPicker month={month} setMonth={setMonth} />

      {error && (
        <div className="mt-4 rounded-2xl border border-(--border) bg-(--surface) p-3 text-sm text-red-600 shadow-(--shadow)">
          {error}
        </div>
      )}

      <div className="mt-5 grid gap-4">
        <SummaryCard summary={summary} />

        <div className="grid gap-4 md:grid-cols-2">
          <FixedBillsCard bills={bills} onToggle={onToggleBill} onCreate={onCreateFixedBill} busy={busy} />
          {/* se você tiver o form de lançamento, pode colocar aqui depois */}
        </div>

        <TransactionsCard transactions={transactions} loading={loading} />
      </div>

      <div className="mt-6 text-xs text-(--muted)">
        {loading ? "Sincronizando..." : "Sincronizado"}
      </div>
    </div>

    <NewTransactionModal
      open={newTxOpen}
      loading={busy}
      onClose={() => setNewTxOpen(false)}
      onSubmit={onCreateTransaction}
    />

    <button
      onClick={() => setNewTxOpen(true)}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 h-14 w-14 rounded-full bg-[#111] text-white shadow-lg
                hover:bg-black active:scale-95 transition flex items-center justify-center text-3xl leading-none"
      aria-label="Adicionar transação"
      title="Adicionar transação"
    >
      +
    </button>

  </div>
);

}
