"use client";

import { StudentResults } from "@/components/shared/assessments/student-results";
import { PageTabs } from "@/components/shared/page-tabs";

import { ClassReportView } from "./class-report-view";

/** Resultados calculados pela API; a pauta da turma continua com dados de exemplo. */
export function DirectorReportTabs() {
  return (
    <PageTabs
      label="Pauta trimestral"
      tabs={[
        { key: "resultados", label: "Resultados por aluno", render: () => <StudentResults /> },
        { key: "pauta", label: "Pauta da turma", render: () => <ClassReportView /> },
      ]}
    />
  );
}
