"use client";

import { TrimestersManager } from "@/components/shared/assessments/trimesters-manager";
import { PageTabs } from "@/components/shared/page-tabs";

import { PeriodsWorkspace } from "./periods-workspace";

/** Trimestres da API; os prazos por disciplina continuam com dados de exemplo. */
export function PeriodsTabs() {
  return (
    <PageTabs
      label="Períodos de lançamento"
      tabs={[
        { key: "trimestres", label: "Trimestres", render: () => <TrimestersManager /> },
        { key: "prazos", label: "Prazos por disciplina", render: () => <PeriodsWorkspace /> },
      ]}
    />
  );
}
