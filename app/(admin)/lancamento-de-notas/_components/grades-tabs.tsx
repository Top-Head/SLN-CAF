"use client";

import { ExamsManager } from "@/components/shared/assessments/exams-manager";
import { GradesManager } from "@/components/shared/assessments/grades-manager";
import { PageTabs } from "@/components/shared/page-tabs";

import { STUDENTS } from "../_lib/mock-data";
import { GradeEntry } from "./grade-entry";

/** Notas e exames da API; a folha de lançamento continua com dados de exemplo. */
export function GradesTabs() {
  return (
    <PageTabs
      label="Lançamento de notas"
      tabs={[
        { key: "notas", label: "Notas lançadas", render: () => <GradesManager /> },
        { key: "exames", label: "Exames", render: () => <ExamsManager /> },
        {
          key: "folha",
          label: "Folha de lançamento",
          render: () => <GradeEntry students={STUDENTS} />,
        },
      ]}
    />
  );
}
