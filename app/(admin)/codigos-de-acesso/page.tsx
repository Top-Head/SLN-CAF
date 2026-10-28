import { SummaryCards } from "@/components/shared/summary-cards";

import { AccessCodesWorkspace } from "./_components/access-codes-workspace";
import { ACCESS_SUMMARY } from "./_lib/mock-data";

export default function AccessCodesPage() {
  return (
    <div className="flex flex-col gap-6">
      <SummaryCards stats={ACCESS_SUMMARY} className="gap-6" />
      <AccessCodesWorkspace />
    </div>
  );
}
