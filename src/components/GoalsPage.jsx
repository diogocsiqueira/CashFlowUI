import { useEffect, useMemo, useState } from "react";
import { caixaApi } from "../api/caixaApi";
import { formatBRL } from "../utils/money";
import GoalModal from "./GoalModal";
import GoalContributionModal from "./GoalContributionModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function progressOf(goal) {
  return Math.min(100, Number(goal.progressPercentage || 0));
}

function statusLabel(status) {
  const labels = {
    ACTIVE: "Ativa",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };

  return labels[status] || status;
}

function GoalCard({ goal, selected, onSelect }) {
  const progress = progressOf(goal);

  return (
    <button
      type="button"
      onClick={() => onSelect(goal)}
      className={[
        "rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-(--shadow)",
        selected
          ? "border-(--text) bg-(--surface)"
          : "border-(--border) bg-(--surface)",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
            <h3 className="truncate text-lg font-black">{goal.name}</h3>

            {goal.description && (
            <p className="mt-1 line-clamp-2 text-sm text-(--muted)">
                {goal.description}
            </p>
            )}
        </div>

        <span className="rounded-full border border-(--border) px-3 py-1 text-xs font-bold text-(--muted)">
          {statusLabel(goal.status)}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{formatBRL(goal.currentAmount)}</span>
          <span className="text-(--muted)">{formatBRL(goal.targetAmount)}</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-(--btn-muted-bg)">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs font-bold text-(--muted)">
          <span>{progress.toFixed(0)}%</span>
          <span>Faltam {formatBRL(goal.remainingAmount)}</span>
        </div>
      </div>
    </button>
  );
}

export default function GoalsPage({ categories }) {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributions, setContributions] = useState([]);

  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [contributionModalOpen, setContributionModalOpen] = useState(false);
  const [contributionType, setContributionType] = useState("DEPOSIT");

  const [goalToDelete, setGoalToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    const active = goals.filter((goal) => goal.status === "ACTIVE");
    const completed = goals.filter((goal) => goal.status === "COMPLETED");

    const totalCurrent = goals.reduce(
      (acc, goal) => acc + Number(goal.currentAmount || 0),
      0
    );

    const totalTarget = goals.reduce(
      (acc, goal) => acc + Number(goal.targetAmount || 0),
      0
    );

    const totalProgress =
      totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;

    return {
      activeCount: active.length,
      completedCount: completed.length,
      totalCurrent,
      totalTarget,
      totalProgress,
    };
  }, [goals]);

  async function reloadGoals(keepSelectedId = selectedGoal?.id) {
    setLoading(true);
    setError("");

    try {
      const data = await caixaApi.listGoals();
      setGoals(data);

      const nextSelected =
        data.find((goal) => goal.id === keepSelectedId) || data[0] || null;

      setSelectedGoal(nextSelected);

      if (nextSelected) {
        const contributionData = await caixaApi.listGoalContributions(nextSelected.id);
        setContributions(contributionData);
      } else {
        setContributions([]);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao carregar metas");
    } finally {
      setLoading(false);
    }
  }

  async function selectGoal(goal) {
    setSelectedGoal(goal);
    setLoading(true);
    setError("");

    try {
      const data = await caixaApi.listGoalContributions(goal.id);
      setContributions(data);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao carregar aportes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadGoals(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateGoal() {
    setEditingGoal(null);
    setGoalModalOpen(true);
  }

  function openEditGoal(goal) {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  }

  function openContribution(type) {
    setContributionType(type);
    setContributionModalOpen(true);
  }

  async function saveGoal(payload) {
    setBusy(true);
    setError("");

    try {
      if (editingGoal) {
        await caixaApi.updateGoal(editingGoal.id, payload);
      } else {
        await caixaApi.createGoal(payload);
      }

      setGoalModalOpen(false);
      setEditingGoal(null);
      await reloadGoals(editingGoal?.id);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao salvar meta");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function saveContribution(payload) {
    if (!selectedGoal) return;

    setBusy(true);
    setError("");

    try {
      await caixaApi.createGoalContribution(selectedGoal.id, payload);
      setContributionModalOpen(false);
      await reloadGoals(selectedGoal.id);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao salvar aporte");
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function confirmDeleteGoal() {
    if (!goalToDelete) return;

    setBusy(true);
    setError("");

    try {
      await caixaApi.deleteGoal(goalToDelete.id);
      setGoalToDelete(null);
      await reloadGoals(null);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erro ao excluir meta");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black">Metas financeiras</h2>
            <p className="mt-1 text-sm text-(--muted)">
              Acompanhe objetivos, aportes, saques e progresso.
            </p>
          </div>

          <button
            onClick={openCreateGoal}
            className="rounded-2xl bg-(--btn-bg) px-5 py-3 text-sm font-bold text-(--btn-text) transition hover:opacity-85"
          >
            + Nova meta
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-(--border) p-4">
            <p className="text-xs font-bold uppercase text-(--muted)">
              Total em metas
            </p>
            <p className="mt-2 text-2xl font-black">
              {formatBRL(summary.totalCurrent)}
            </p>
            <p className="mt-1 text-xs text-(--muted)">
              de {formatBRL(summary.totalTarget)}
            </p>
          </div>

          <div className="rounded-2xl border border-(--border) p-4">
            <p className="text-xs font-bold uppercase text-(--muted)">
              Progresso geral
            </p>
            <p className="mt-2 text-2xl font-black">
              {summary.totalProgress.toFixed(0)}%
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-(--btn-muted-bg)">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${summary.totalProgress}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-(--border) p-4">
            <p className="text-xs font-bold uppercase text-(--muted)">
              Status
            </p>
            <p className="mt-2 text-2xl font-black">
              {summary.activeCount} ativas
            </p>
            <p className="mt-1 text-xs text-(--muted)">
              {summary.completedCount} concluídas
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 2xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-(--border) bg-(--surface) p-5 shadow-(--shadow)">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black">Suas metas</h3>
            <span className="text-xs font-bold text-(--muted)">
              {loading ? "Carregando..." : `${goals.length} metas`}
            </span>
          </div>

          <div className="grid gap-4">
            {goals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-(--border) p-8 text-center">
                <p className="text-sm font-bold">Nenhuma meta criada ainda.</p>
                <p className="mt-1 text-sm text-(--muted)">
                  Cria a primeira e começa a acompanhar direito.
                </p>
                <button
                  onClick={openCreateGoal}
                  className="mt-5 rounded-2xl bg-(--btn-bg) px-5 py-3 text-sm font-bold text-(--btn-text)"
                >
                  Criar primeira meta
                </button>
              </div>
            ) : (
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  selected={selectedGoal?.id === goal.id}
                  onSelect={selectGoal}
                />
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
          {!selectedGoal ? (
            <div className="grid min-h-[360px] place-items-center text-center text-(--muted)">
              Selecione uma meta para ver detalhes.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-sm font-bold text-(--muted)">
                    {statusLabel(selectedGoal.status)}
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    {selectedGoal.name}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm text-(--muted)">
                    {selectedGoal.description || "Sem descrição."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openContribution("DEPOSIT")}
                    className="rounded-2xl bg-(--btn-bg) px-4 py-3 text-sm font-bold text-(--btn-text) transition hover:opacity-85"
                  >
                    + Aportar
                  </button>

                  <button
                    onClick={() => openContribution("WITHDRAW")}
                    className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-bold transition hover:opacity-75"
                  >
                    Sacar
                  </button>

                  <button
                    onClick={() => openEditGoal(selectedGoal)}
                    className="rounded-2xl border border-(--border) px-4 py-3 text-sm font-bold transition hover:opacity-75"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setGoalToDelete(selectedGoal)}
                    className="rounded-2xl border border-red-300 px-4 py-3 text-sm font-bold text-red-500 transition hover:opacity-75"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-(--border) p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-(--muted)">Progresso</p>
                    <p className="mt-1 text-3xl font-black">
                      {formatBRL(selectedGoal.currentAmount)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-(--muted)">Objetivo</p>
                    <p className="mt-1 text-xl font-black">
                      {formatBRL(selectedGoal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-(--btn-muted-bg)">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${progressOf(selectedGoal)}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap justify-between gap-3 text-sm font-bold text-(--muted)">
                  <span>{progressOf(selectedGoal).toFixed(0)}% concluído</span>
                  <span>Faltam {formatBRL(selectedGoal.remainingAmount)}</span>
                  {selectedGoal.deadlineDate && (
                    <span>Prazo: {selectedGoal.deadlineDate}</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-black">Histórico</h3>

                <div className="mt-4 grid gap-3">
                  {contributions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-(--border) p-8 text-center text-sm text-(--muted)">
                      Nenhum aporte ou saque registrado nessa meta.
                    </div>
                  ) : (
                    contributions.map((item) => {
                      const deposit = item.type === "DEPOSIT";

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-(--border) p-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black">
                              {item.description ||
                                (deposit ? "Aporte" : "Saque")}
                            </p>
                            <p className="mt-1 text-xs text-(--muted)">
                              {item.contributionDate}
                            </p>
                          </div>

                          <strong
                            className={
                              deposit
                                ? "shrink-0 text-sm text-emerald-500"
                                : "shrink-0 text-sm text-red-500"
                            }
                          >
                            {deposit ? "+" : "-"} {formatBRL(item.amount)}
                          </strong>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <GoalModal
        open={goalModalOpen}
        goal={editingGoal}
        loading={busy}
        onClose={() => {
          setGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={saveGoal}
      />

      <GoalContributionModal
        open={contributionModalOpen}
        goal={selectedGoal}
        type={contributionType}
        categories={categories}
        loading={busy}
        onClose={() => setContributionModalOpen(false)}
        onSubmit={saveContribution}
      />

      <ConfirmDeleteModal
        open={Boolean(goalToDelete)}
        loading={busy}
        title="Excluir meta"
        message={
          goalToDelete
            ? `Tem certeza que deseja excluir "${goalToDelete.name}"? Os aportes dessa meta também serão removidos.`
            : ""
        }
        onClose={() => setGoalToDelete(null)}
        onConfirm={confirmDeleteGoal}
      />
    </div>
  );
}