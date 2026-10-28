import { averageOf, PASS_GRADE } from "@/lib/utils/format-grade";

import type { GradeKey, Grades, SheetMode, SheetStudent } from "./mock-data";

export type Assessment = { key: GradeKey; label: string; description: string };

export const ASSESSMENTS: Record<SheetMode, Assessment[]> = {
  regular: [
    { key: "mac", label: "MAC", description: "Aval. contínua" },
    { key: "pp", label: "PP", description: "Prova professor" },
    { key: "pt", label: "PT", description: "Prova trimestre" },
  ],
  exam: [
    { key: "mac", label: "MAC", description: "Aval. contínua" },
    { key: "pp", label: "PP", description: "Prova professor" },
    { key: "exam", label: "EXAME", description: "Prova final" },
  ],
};

/** Coluna da média do trimestre. */
export const AVERAGE_COLUMN: Record<SheetMode, { label: string; description: string }> = {
  regular: { label: "MT", description: "Automática" },
  exam: { label: "MT3", description: "(MAC+PP) ÷ 2" },
};

/** Arredondamento oficial: décimas ≥ 0,5 sobem. */
export const roundHalfUp = (value: number) => Math.floor(value + 0.5 + 1e-9);

export type Evaluation = {
  /** Siglas das notas em falta ("PP", "Exame"…). */
  missing: string[];
  /** MT (1 casa decimal) ou MT3 (arredondada) nas classes de exame. */
  average: number | null;
  /** Só nas classes de exame. */
  mfd: number | null;
  /** Nota que conta para aprovação: MT ou MF. */
  final: number | null;
};

const missingLabel = (label: string) => (label === "EXAME" ? "Exame" : label);

export function evaluate(student: SheetStudent, grades: Grades, mode: SheetMode): Evaluation {
  const missing = ASSESSMENTS[mode]
    .filter(({ key }) => grades[key] == null)
    .map(({ label }) => missingLabel(label));

  if (mode === "regular") {
    const average = averageOf([grades.mac ?? null, grades.pp ?? null, grades.pt ?? null]);
    return { missing, average, mfd: null, final: missing.length === 0 ? average : null };
  }

  // MT3 = (MAC + PP) ÷ 2 · MFD = (MT1 + MT2 + MT3) ÷ 3 · MF = 0,4 × MFD + 0,6 × Exame
  const { mac, pp, exam } = grades;
  const average = mac != null && pp != null ? roundHalfUp((mac + pp) / 2) : null;
  const mfd =
    average !== null && student.previous
      ? roundHalfUp((student.previous[0] + student.previous[1] + average) / 3)
      : null;
  const final = mfd !== null && exam != null ? roundHalfUp(0.4 * mfd + 0.6 * exam) : null;
  return { missing, average, mfd, final };
}

export const isPositive = (grade: number) => grade >= PASS_GRADE;

/** Resumo da turma para o diálogo de conclusão. */
export function summarize(evaluations: Evaluation[]) {
  const finals = evaluations.flatMap((e) => (e.final === null ? [] : [e.final]));
  const positives = finals.filter(isPositive).length;
  return {
    complete: evaluations.filter((e) => e.missing.length === 0).length,
    positives,
    negatives: finals.length - positives,
    average: finals.length === 0 ? null : finals.reduce((sum, v) => sum + v, 0) / finals.length,
  };
}
