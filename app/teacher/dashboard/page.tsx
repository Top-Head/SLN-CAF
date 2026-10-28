import { Suspense } from "react";

import { SummaryCards } from "@/components/shared/summary-cards";
import { WelcomeBanner } from "./_components/banner";
import { 
  TEACHER_DASHBOARD_MOCK, 
  TEACHER_SUMMARY_STATS, 
  MINI_PAUTAS_MOCK, 
  PROXIMOS_PRAZOS_MOCK 
} from "./_lib/mock-data";
import { MiniPautasCard } from "@/components/shared/mini-pautas-card";
import { ProximosPrazosCard } from "@/components/proximo-prazo-card";

export default function TeacherDashboardPage() {
  const { name, pendingStudents, pendingReports, nextDeadline, continueHref, classesHref } = TEACHER_DASHBOARD_MOCK;

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <WelcomeBanner
          name={name}
          pendingStudents={pendingStudents}
          pendingReports={pendingReports}
          nextDeadline={nextDeadline}
          continueHref={continueHref}
          classesHref={classesHref}
        />
      </Suspense>

      <SummaryCards stats={TEACHER_SUMMARY_STATS} />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <MiniPautasCard items={MINI_PAUTAS_MOCK} />
        <ProximosPrazosCard prazos={PROXIMOS_PRAZOS_MOCK} />
      </div>
    </div>
  );
}