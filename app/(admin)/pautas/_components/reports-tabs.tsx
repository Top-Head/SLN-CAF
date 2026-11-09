"use client";

import { PromotionDecisionsManager } from "@/components/shared/assessments/promotion-decisions-manager";
import { StudentResults } from "@/components/shared/assessments/student-results";
import { PageTabs } from "@/components/shared/page-tabs";

import { REPORT_STUDENTS } from "../_lib/mock-data";
import { ClassReport } from "./class-report";

/** Resultados e decisões da API; a pauta da turma continua com dados de exemplo. */
export function ReportsTabs() {
  return (
    <PageTabs
      label="Pautas"
      tabs={[
        {
          key: "resultados",
          label: "Resultados por aluno",
          render: () => <StudentResults canDecide />,
        },
        {
          key: "decisoes",
          label: "Decisões de promoção",
          render: () => <PromotionDecisionsManager />,
        },
        {
          key: "pauta",
          label: "Pauta trimestral",
          render: () => <ClassReport students={REPORT_STUDENTS} />,
        },
      ]}
    />
  );
}
