import type { Approval } from "@/components/shared/statistics/approval-donut";
import type { PerformanceRow } from "@/components/shared/statistics/performance-table";
import type { SubjectAverage } from "@/components/shared/statistics/subject-average-chart";
import type { SummaryStat } from "@/components/shared/summary-cards";

export const STATS_SUMMARY: SummaryStat[] = [
  { label: "Alunos", value: 120, icon: "/images/teacher-avatar.png", avatar: true },
  { label: "Avaliações registadas", value: 103, icon: "/icons/evaluations.svg", tone: "positive" },
  { label: "Aprovados", value: 50, icon: "/icons/thumbs-up.svg", tone: "positive", iconSize: 24 },
  { label: "Reprovados", value: 50, icon: "/icons/thumbs-down.svg", iconSize: 24 },
];

export const YEARS = ["2025/2026", "2024/2025"];
export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];
export const CLASS_OPTIONS = ["Todas as turmas", "10.ª IA", "10.ª IB", "11.ª IF", "12.ª IB", "12.ª ID"];
export const SUBJECT_OPTIONS = [
  "Todas as disciplinas", "Matemática", "Português", "Física", "Química",
  "Biologia", "Inglês", "História", "Ed. Física",
];

export const SUBJECT_AVERAGES: SubjectAverage[] = [
  { subject: "Matemática", average: 9.4 },
  { subject: "Português", average: 12.1 },
  { subject: "Física", average: 10.3 },
  { subject: "Química", average: 9.8 },
  { subject: "Biologia", average: 11.6 },
  { subject: "Inglês", average: 13.2 },
  { subject: "História", average: 12.4 },
  { subject: "Ed. Física", average: 15.1 },
];

export const APPROVAL: Approval = { passed: 50, failed: 50, other: 20 };

export const CLASS_PERFORMANCE: PerformanceRow[] = [
  { name: "10.ª IA", detail: "Ciências Físicas e Biológicas", students: 24, average: 11.8, passed: 12, failed: 8 },
  { name: "10.ª IB", detail: "Ciências Físicas e Biológicas", students: 24, average: 10.2, passed: 9, failed: 11 },
  { name: "11.ª IF", detail: "Ciências Económicas e Jurídicas", students: 24, average: 11.1, passed: 11, failed: 9 },
  { name: "12.ª IB", detail: "Ciências Físicas e Biológicas", students: 24, average: 9.6, passed: 8, failed: 12 },
  { name: "12.ª ID", detail: "Ciências Humanas", students: 24, average: 10.7, passed: 10, failed: 10 },
];
