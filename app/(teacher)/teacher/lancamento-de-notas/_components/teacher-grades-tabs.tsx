"use client";

import { useSearchParams } from "next/navigation";

import { ExamsManager } from "@/components/shared/assessments/exams-manager";
import { GradesManager } from "@/components/shared/assessments/grades-manager";
import { PageTabs } from "@/components/shared/page-tabs";

import { GradeLaunchWorkspace } from "./grade-launch-workspace";
import { TeacherGradeSheet } from "./teacher-grade-sheet";

/**
 * Folha por turma (alunos da mini-pauta da API), notas e exames da API;
 * a mini-pauta antiga continua com dados de exemplo.
 */
export function TeacherGradesTabs() {
  const turmaDisciplina = useSearchParams().get("turmaDisciplina") ?? undefined;

  return (
    <PageTabs
      label="Lançamento de notas"
      tabs={[
        {
          key: "folha",
          label: "Lançar por turma",
          render: () => <TeacherGradeSheet initialTurmaDisciplina={turmaDisciplina} />,
        },
        { key: "notas", label: "Notas lançadas", render: () => <GradesManager /> },
        { key: "exames", label: "Exames", render: () => <ExamsManager /> },
        { key: "exemplo", label: "Mini-pauta (exemplo)", render: () => <GradeLaunchWorkspace /> },
      ]}
    />
  );
}
