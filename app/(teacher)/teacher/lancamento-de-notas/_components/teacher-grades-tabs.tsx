"use client";

import { ExamsManager } from "@/components/shared/assessments/exams-manager";
import { GradesManager } from "@/components/shared/assessments/grades-manager";
import { PageTabs } from "@/components/shared/page-tabs";

import { GradeLaunchWorkspace } from "./grade-launch-workspace";

/** Notas e exames da API; a mini-pauta continua com dados de exemplo. */
export function TeacherGradesTabs() {
  return (
    <PageTabs
      label="Lançamento de notas"
      tabs={[
        { key: "notas", label: "Notas lançadas", render: () => <GradesManager /> },
        { key: "exames", label: "Exames", render: () => <ExamsManager /> },
        { key: "folha", label: "Mini-pauta", render: () => <GradeLaunchWorkspace /> },
      ]}
    />
  );
}
