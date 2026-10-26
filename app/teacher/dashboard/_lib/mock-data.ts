import type { SummaryStat } from "@/components/shared/summary-cards";

export const TEACHER_SUMMARY_STATS: SummaryStat[] = [
  { label: "Turmas", value: 4, icon: "/icons/classes.svg" },
  { label: "Mini-pautas", value: 6, icon: "/icons/subjects.svg" },
  { label: "Concluídas", value: "2/5", icon: "/icons/subjects.svg" },
  { label: "Por completar", value: 3, icon: "/icons/subjects.svg" },
];

export const TEACHER_DASHBOARD_MOCK = {
  name: "Paulo",
  pendingStudents: 55,
  pendingReports: 3,
  nextDeadline: {
    subject: "Física · 10.ª IB",
    label: "Física · 08 Dez, 23:59",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  continueHref: "/teacher/lancamento-de-notas",
  classesHref: "/teacher/turmas",
};
