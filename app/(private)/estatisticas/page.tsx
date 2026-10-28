import { ApprovalDonut } from "@/components/shared/statistics/approval-donut";
import { PerformanceTable } from "@/components/shared/statistics/performance-table";
import { SubjectAverageChart } from "@/components/shared/statistics/subject-average-chart";
import { SummaryCards } from "@/components/shared/summary-cards";

import { StatisticsFilters } from "./_components/statistics-filters";
import {
  APPROVAL,
  CLASS_PERFORMANCE,
  STATS_SUMMARY,
  SUBJECT_AVERAGES,
} from "./_lib/mock-data";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SummaryCards stats={STATS_SUMMARY} className="gap-[30px]" />
      <StatisticsFilters />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <SubjectAverageChart data={SUBJECT_AVERAGES} />
        <ApprovalDonut approval={APPROVAL} />
      </div>
      <PerformanceTable
        title="Desempenho por turma"
        description="Média geral e taxa de aprovação de cada turma no 1.º trimestre"
        rows={CLASS_PERFORMANCE}
        labels={{
          name: "Turma",
          average: "Média geral",
          passed: "Aprovados",
          failed: "Reprovados",
          rate: "Taxa de aprovação",
        }}
        link={{ href: "/pautas", label: "Ver pautas" }}
      />
    </div>
  );
}
