import type { SummaryStat } from "@/components/shared/summary-cards";

export const SUMMARY_STATS: SummaryStat[] = [
  {
    label: "Professores",
    value: 120,
    icon: "/images/teacher-avatar.png",
    avatar: true,
  },
  { label: "Estudantes", value: 1298, icon: "/icons/students.svg" },
  { label: "Turmas", value: 18, icon: "/icons/classes.svg" },
  { label: "Disciplinas", value: 50, icon: "/icons/subjects.svg" },
];

export type PerformancePoint = {
  month: string;
  bar: number;
  line: number;
};

export const PERFORMANCE_DATA: PerformancePoint[] = [
  { month: "Jan", bar: -100, line: 0 },
  { month: "Fev", bar: 55, line: 32 },
  { month: "Mar", bar: -20, line: -8 },
  { month: "Abr", bar: 35, line: 20 },
  { month: "Mai", bar: 75, line: 40 },
  { month: "Jun", bar: 55, line: 15 },
];

export type PendingStatus = "pending" | "closed";

export type PendingItem = {
  id: number;
  teacher: string;
  className: string;
  launched: { done: number; total: number } | null;
  status: PendingStatus;
};

export const PENDING_ITEMS: PendingItem[] = [
  {
    id: 1,
    teacher: "Joaquim Mbala",
    className: "12.ª ID",
    launched: { done: 0, total: 18 },
    status: "closed",
  },
  {
    id: 2,
    teacher: "Edmildo Felipe",
    className: "11.ª IF",
    launched: null,
    status: "pending",
  },
  {
    id: 3,
    teacher: "Paulo Sanguli",
    className: "10.ª IB",
    launched: null,
    status: "pending",
  },
  {
    id: 4,
    teacher: "António Banga",
    className: "12.ª IB",
    launched: null,
    status: "pending",
  },
];

export const PENDING_TOTAL = 12;
