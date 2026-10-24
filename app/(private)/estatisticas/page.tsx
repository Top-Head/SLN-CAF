import { SummaryCards } from "@/components/shared/summary-cards";

import { ApprovalDonut } from "./_components/approval-donut";
import { ClassPerformanceTable } from "./_components/class-performance-table";
import { StatisticsFilters } from "./_components/statistics-filters";
import { SubjectAverageChart } from "./_components/subject-average-chart";
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
      <ClassPerformanceTable rows={CLASS_PERFORMANCE} />
    </div>
  );
}
