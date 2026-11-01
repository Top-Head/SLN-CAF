import { Suspense } from "react";

import { MiniPautasCard } from "@/components/shared/mini-pautas-card";
import { ProximosPrazosCard } from "@/components/proximo-prazo-card";
import { SummaryCards } from "@/components/shared/summary-cards";

import { ActivityCard } from "./_components/activity-card";
import { WelcomeBanner } from "./_components/banner";
import {
  MINI_PAUTAS_MOCK,
  PROXIMOS_PRAZOS_MOCK,
  TEACHER_DASHBOARD_MOCK,
  TEACHER_SUMMARY_STATS,
} from "./_lib/mock-data";

export default function TeacherDashboardPage() {
  const { name, pendingStudents, pendingReports, nextDeadline, continueHref, classesHref } =
    TEACHER_DASHBOARD_MOCK;

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

      <SummaryCards stats={TEACHER_SUMMARY_STATS} className="gap-4" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MiniPautasCard items={MINI_PAUTAS_MOCK} />
        </div>

        <div className="space-y-6">
          <ProximosPrazosCard prazos={PROXIMOS_PRAZOS_MOCK} />
          <ActivityCard />
        </div>
      </div>
    </div>
  );
}