"use client";

import {
  MiniPautasCard,
} from "@/components/shared/mini-pautas-card";
import { SummaryCards } from "@/components/shared/summary-cards";
import {
  ACTIVIDADE_RECENTE_MOCK,
  MINI_PAUTAS_MOCK,
  TEACHER_DASHBOARD_MOCK,
  TEACHER_SUMMARY_STATS,
} from "../_lib/mock-data";
import { ActivityCard } from "./activity-card";
import { WelcomeBanner } from "./banner";

export function TeacherDashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        name={TEACHER_DASHBOARD_MOCK.name}
        pendingStudents={TEACHER_DASHBOARD_MOCK.pendingStudents}
        pendingReports={TEACHER_DASHBOARD_MOCK.pendingReports}
        trimester={TEACHER_DASHBOARD_MOCK.trimester}
      />

      <SummaryCards stats={TEACHER_SUMMARY_STATS} className="gap-4" />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MiniPautasCard items={MINI_PAUTAS_MOCK} />
        </div>

        <div className="space-y-6">
          <ActivityCard items={ACTIVIDADE_RECENTE_MOCK} />
        </div>
      </div>
    </div>
  );
}
