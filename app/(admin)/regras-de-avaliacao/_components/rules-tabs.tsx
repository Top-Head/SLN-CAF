"use client";

import {
  ClassRulesManager,
  GradingScalesManager,
  SubjectExamRulesManager,
} from "@/components/shared/assessments/rules-managers";
import { PageTabs } from "@/components/shared/page-tabs";

/** Regras de avaliação versionadas por ano letivo (escala, classe, exame). */
export function RulesTabs() {
  return (
    <PageTabs
      label="Regras de avaliação"
      tabs={[
        { key: "classes", label: "Regras por classe", render: () => <ClassRulesManager /> },
        { key: "escalas", label: "Escalas", render: () => <GradingScalesManager /> },
        { key: "exames", label: "Exame por disciplina", render: () => <SubjectExamRulesManager /> },
      ]}
    />
  );
}
