import { averageOf, PASS_GRADE } from "@/lib/utils/format-grade";

export const SUBJECTS = [
  { key: "mat", short: "MAT", name: "Matemática" },
  { key: "port", short: "PORT", name: "Português" },
  { key: "fis", short: "FÍS", name: "Física" },
  { key: "qui", short: "QUÍ", name: "Química" },
  { key: "bio", short: "BIO", name: "Biologia" },
  { key: "ing", short: "ING", name: "Inglês" },
] as const;

export type SubjectKey = (typeof SUBJECTS)[number]["key"];

export type ReportStudent = {
  id: string;
  name: string;
  process: string;
  grades: Record<SubjectKey, number | null>;
};

export type ReportResult = "passed" | "failed" | "pending";
export type ReportView = "all" | ReportResult;

export const RESULTS: Record<
  ReportResult,
  { label: string; tone: "positive" | "primary" | "pending" }
> = {
  passed: { label: "Aprovado", tone: "positive" },
  failed: { label: "Reprovado", tone: "primary" },
  pending: { label: "Pendente", tone: "pending" },
};

export type StudentSummary = { mean: number | null; result: ReportResult };

export function summarizeStudent(student: ReportStudent): StudentSummary {
  const mean = averageOf(SUBJECTS.map(({ key }) => student.grades[key]));
  const result: ReportResult =
    mean === null ? "pending" : mean >= PASS_GRADE ? "passed" : "failed";
  return { mean, result };
}

export function summarizeReport(students: ReportStudent[]) {
  const summaries = new Map(students.map((s) => [s.id, summarizeStudent(s)]));
  const countOf = (result: ReportResult) =>
    students.filter((s) => summaries.get(s.id)!.result === result).length;
  const classMean = averageOf(
    students.map((s) => summaries.get(s.id)!.mean).filter((m) => m !== null),
  );
  return {
    summaries,
    counts: {
      passed: countOf("passed"),
      failed: countOf("failed"),
      pending: countOf("pending"),
    } satisfies Record<ReportResult, number>,
    classMean,
  };
}
