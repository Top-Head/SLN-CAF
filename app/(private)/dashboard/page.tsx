import { PendingTable } from "./_components/pending-table";
import { PerformanceChart } from "./_components/performance-chart";
import { SummaryCards } from "./_components/summary-cards";
import {
  PENDING_ITEMS,
  PENDING_TOTAL,
  PERFORMANCE_DATA,
  SUMMARY_STATS,
} from "./_lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <SummaryCards stats={SUMMARY_STATS} />
      <div className="mt-15.5">
        <PerformanceChart data={PERFORMANCE_DATA} />
      </div>
      <div className="mt-7">
        <PendingTable items={PENDING_ITEMS} total={PENDING_TOTAL} />
      </div>
    </div>
  );
}
