"use client";

import { useAllExamGrades } from "@/hooks/assessments/use-exams";
import { useAllGrades } from "@/hooks/assessments/use-grades";
import { useAllPromotionDecisions } from "@/hooks/assessments/use-promotion-decisions";
import { useAllTrimesters } from "@/hooks/assessments/use-trimesters";
import { useAllEnrollments } from "@/hooks/academic/use-enrollments";
import { useAllSchoolYears } from "@/hooks/academic/use-school-years";
import { useAllTurmaDisciplinas } from "@/hooks/academic/use-turma-disciplinas";
import type { SelectOption } from "@/components/shared/resource/resource-form-dialog";

import { trimesterLabel } from "./labels";

const byLabel = (a: SelectOption, b: SelectOption) =>
  a.label.localeCompare(b.label, "pt", { numeric: true });

function addOption(map: Map<string, string>, value: string, label: string) {
  if (value && !map.has(value)) map.set(value, label);
}

const toOptions = (map: Map<string, string>) =>
  [...map].map(([value, label]) => ({ value, label })).sort(byLabel);

/**
 * Opções para os formulários de avaliação.
 *
 * As matrículas e as disciplinas por turma vêm de
 * `/api/academico/enrollments/` e `/api/avaliacoes/turma-disciplinas/`.
 * As notas, exames e decisões já registados completam a lista (por exemplo,
 * matrículas antigas ou sem permissão de leitura). Sem nenhuma opção, os
 * formulários pedem o identificador à mão.
 */
export function useAssessmentOptions(options?: { decisions?: boolean }) {
  const grades = useAllGrades();
  const exams = useAllExamGrades();
  const decisions = useAllPromotionDecisions({
    enabled: options?.decisions ?? false,
  });
  const trimesters = useAllTrimesters();
  const enrollmentList = useAllEnrollments();
  const turmaDisciplinas = useAllTurmaDisciplinas();
  const years = useAllSchoolYears();

  const enrollments = new Map<string, string>();
  const subjects = new Map<string, string>();
  // Ano letivo de cada matrícula, para preencher as consultas anuais.
  const enrollmentYear = new Map<string, string>();

  // Fontes principais: matrículas ativas primeiro e disciplinas por turma.
  for (const e of [...enrollmentList.items].sort((a, b) =>
    (a.status ?? "ATIVA") === "ATIVA" ? -1 : (b.status ?? "ATIVA") === "ATIVA" ? 1 : 0,
  )) {
    const inactive = (e.status ?? "ATIVA") !== "ATIVA" ? ` (${(e.status ?? "").toLowerCase()})` : "";
    addOption(enrollments, e.id, `${e.student_nome} · ${e.turma_nome}${inactive}`);
    enrollmentYear.set(e.id, e.school_year);
  }
  for (const td of turmaDisciplinas.items) {
    addOption(subjects, td.id, `${td.subject_nome} · ${td.turma_nome} · ${td.teacher_nome}`);
  }

  for (const g of grades.items) {
    addOption(enrollments, g.enrollment, `${g.student_nome} · ${g.turma_nome}`);
    addOption(subjects, g.turma_disciplina, `${g.subject_nome} · ${g.turma_nome}`);
    if (g.school_year) enrollmentYear.set(g.enrollment, g.school_year);
  }
  for (const e of exams.items) {
    addOption(
      enrollments,
      e.enrollment,
      `${e.student_nome} · ${e.school_class_numero}.ª classe`,
    );
    addOption(
      subjects,
      e.turma_disciplina,
      `${e.subject_nome} · ${e.school_class_numero}.ª classe`,
    );
    if (e.school_year) enrollmentYear.set(e.enrollment, e.school_year);
  }
  for (const d of decisions.items) {
    addOption(enrollments, d.enrollment, `Matrícula ${d.enrollment.slice(0, 8)}`);
    enrollmentYear.set(d.enrollment, d.school_year);
  }

  const trimesterOptions = [...trimesters.items]
    .sort(
      (a, b) =>
        (b.school_year_detail?.ano_inicio ?? 0) -
          (a.school_year_detail?.ano_inicio ?? 0) || a.numero - b.numero,
    )
    .map((t) => ({ value: t.id, label: trimesterLabel(t) }));

  const schoolYearOptions = [...years.items]
    .sort((a, b) => b.ano_inicio - a.ano_inicio)
    .map((y) => ({ value: y.id, label: `${y.ano_inicio}/${y.ano_fim}` }));

  return {
    enrollmentOptions: toOptions(enrollments),
    subjectOptions: toOptions(subjects),
    trimesterOptions,
    schoolYearOptions,
    enrollmentYear,
    trimesters: trimesters.items,
    loading:
      enrollmentList.status === "loading" ||
      turmaDisciplinas.status === "loading" ||
      grades.status === "loading" ||
      exams.status === "loading" ||
      trimesters.status === "loading",
  };
}
