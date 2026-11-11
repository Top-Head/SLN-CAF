"use client";

import { CheckCircle2, Clock, FileText, GraduationCap } from "lucide-react";

import { ProximosPrazosCard } from "@/components/proximo-prazo-card";
import {
  MiniPautasCard,
  type MiniPautaItem,
} from "@/components/shared/mini-pautas-card";
import { formatDecimal } from "@/components/shared/assessments/labels";
import { SummaryCards, type SummaryStat } from "@/components/shared/summary-cards";
import { useAuth } from "@/hooks/auth/use-auth";
import {
  useTeacherActivity,
  useTeacherDashboardSummary,
  useTeacherMiniPautasBoard,
} from "@/hooks/teacher-dashboard/use-teacher-dashboard";
import { formatDateTime } from "@/lib/utils/format-date";

import { launchStatusOf, miniPautaHref, trimesterLabel } from "../../_lib/teacher-api";
import { NEXT_DEADLINE_MOCK, PROXIMOS_PRAZOS_MOCK } from "../_lib/mock-data";
import { ActivityCard, type ActivityItem } from "./activity-card";
import { WelcomeBanner } from "./banner";

const ESTADO: Record<ReturnType<typeof launchStatusOf>, MiniPautaItem["estado"]> = {
  completed: "concluido",
  in_progress: "em_curso",
  not_started: "por_iniciar",
};

/** "2/5" → 40 (%); texto inválido → null. */
function ratioPercent(text?: string | null) {
  if (typeof text !== "string") return null;
  const [done, total] = text.split("/").map(Number);
  return total > 0 && Number.isFinite(done) ? Math.round((done / total) * 100) : null;
}

/** Dashboard do professor com os dados de `/api/teacher/dashboard/*`. */
export function TeacherDashboardView() {
  const { user } = useAuth();
  const { summary, status: summaryStatus, error: summaryError } = useTeacherDashboardSummary();
  const board = useTeacherMiniPautasBoard();
  const activity = useTeacherActivity();

  const loading = summaryStatus === "loading" || summaryStatus === "idle";
  const subjects = new Set(board.items.map((item) => item.disciplina)).size;
  const pendingReports = board.items.filter(
    (item) => launchStatusOf(item.estado, item.progresso) !== "completed",
  ).length;
  const concludedPercent = summary ? ratioPercent(summary.concluidas) : null;
  const firstName = (user?.name ?? user?.nome ?? user?.username ?? "").split(" ")[0];

  const stats: SummaryStat[] = [
    {
      label: "Turmas",
      value: summary?.turmas ?? "—",
      icon: GraduationCap,
      hint: `${subjects} ${subjects === 1 ? "disciplina leccionada" : "disciplinas leccionadas"}`,
    },
    {
      label: "Mini-pautas",
      value: summary?.mini_pautas ?? "—",
      icon: FileText,
      hint: summary ? trimesterLabel(summary.trimestre) : "Sem trimestre aberto",
    },
    {
      label: "Concluídas",
      value: summary?.concluidas ?? "—",
      icon: CheckCircle2,
      hint: concludedPercent === null ? "do trimestre" : `${concludedPercent}% do trimestre`,
    },
    {
      label: "Por completar",
      value: summary?.por_completar ?? "—",
      icon: Clock,
      tone: "pending",
      hint: "estudantes com notas em falta",
    },
  ];

  const miniPautas: MiniPautaItem[] = board.items.map((item) => ({
    id: item.id,
    turma: { name: item.turma, description: item.curso },
    disciplina: item.disciplina,
    alunos: item.total_alunos,
    // Notas lançadas / esperadas (MAC, PP e PT de cada aluno).
    completedStudents: item.lancadas,
    totalStudents: item.esperado,
    // A API ainda não devolve prazos por disciplina.
    prazo: { date: item.ano_letivo || "—", subLabel: `${item.progresso}% lançado` },
    estado: ESTADO[launchStatusOf(item.estado, item.progresso)],
    href: miniPautaHref(item.id),
  }));

  const activities: ActivityItem[] = activity.items.map((item) => ({
    id: item.id,
    type: "pencil",
    title: `Lançou ${item.componente} ${formatDecimal(item.valor)} a ${item.aluno}`,
    subtitle: `${item.turma} · ${item.disciplina} · ${formatDateTime(item.data)}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      {summary && (
        <WelcomeBanner
          name={firstName || "professor"}
          pendingStudents={summary.por_completar}
          pendingReports={pendingReports}
          nextDeadline={NEXT_DEADLINE_MOCK}
        />
      )}

      {summaryError && (
        // Ex.: "Nenhum trimestre aberto" — informação, não falha do pedido.
        <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {summaryError}. Os resumos do trimestre aparecem quando a direcção abrir um trimestre.
        </p>
      )}

      <SummaryCards stats={loading ? stats.map((s) => ({ ...s, value: "…" })) : stats} className="gap-4" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MiniPautasCard items={miniPautas} />
          {board.status === "success" && miniPautas.length === 0 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Ainda não tem mini-pautas atribuídas.
            </p>
          )}
          {board.error && (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {board.error}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <ProximosPrazosCard prazos={PROXIMOS_PRAZOS_MOCK} />
          <ActivityCard
            items={activities}
            emptyMessage={
              activity.status === "loading" || activity.status === "idle"
                ? "A carregar..."
                : (activity.error ?? "Ainda não lançou notas.")
            }
          />
        </div>
      </div>
    </div>
  );
}
