// ./_lib/mock-data.ts
import {
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
} from "lucide-react";

import type { SummaryStat } from "@/components/shared/summary-cards";
import type { MiniPautaItem } from "./types";

export const TEACHER_SUMMARY_STATS: SummaryStat[] = [
  {
    label: "Turmas",
    value: 4,
    icon: GraduationCap,
    hint: "2 disciplinas leccionadas",
  },
  {
    label: "Mini-pautas",
    value: 5,
    icon: FileText,
    hint: "1.º Trimestre",
  },
  {
    label: "Concluídas",
    value: "2/5",
    icon: CheckCircle2,
    hint: "40% do trimestre",
  },
  {
    label: "Por completar",
    value: 55,
    icon: Clock,
    tone: "pending",
    hint: "estudantes com notas em falta",
  },
];

export const TEACHER_DASHBOARD_MOCK = {
  name: "Paulo",
  pendingStudents: 55,
  pendingReports: 3,
  nextDeadline: {
    subject: "Física · 10.ª IB",
    label: "Física · 08 Dez, 23:59",
    date: "2026-12-08T23:59:00",
  },
  continueHref: "/teacher/lancamento-de-notas",
  classesHref: "/teacher/turmas",
};

// Dados da tabela "As minhas mini-pautas"
export const MINI_PAUTAS_MOCK: MiniPautaItem[] = [
  {
    id: "1",
    turma: {
      name: "12.ª IB",
      description: "Ciências Físicas e Biológicas",
    },
    disciplina: "Matemática",
    alunos: 24,
    completedStudents: 18,
    totalStudents: 24,
    prazo: {
      date: "12 Dez",
    },
    estado: "em_curso",
    href: `/teacher/mini-pautas?classId=12-ib&subject=${encodeURIComponent("Matemática")}&trimester=1`,
  },
  {
    id: "2",
    turma: {
      name: "11.ª IF",
      description: "Ciências Físicas e Biológicas",
    },
    disciplina: "Matemática",
    alunos: 28,
    completedStudents: 28,
    totalStudents: 28,
    prazo: {
      date: "12 Dez",
    },
    estado: "concluido",
    href: `/teacher/mini-pautas?classId=11-if&subject=${encodeURIComponent("Matemática")}&trimester=1`,
  },
  {
    id: "3",
    turma: {
      name: "10.ª IB",
      description: "Ciências Físicas e Biológicas",
    },
    disciplina: "Física",
    alunos: 35,
    completedStudents: 0,
    totalStudents: 35,
    prazo: {
      date: "08 Dez",
      subLabel: "fecha em 2 dias",
    },
    estado: "por_iniciar",
    href: `/teacher/mini-pautas?classId=10-ib&subject=${encodeURIComponent("Física")}&trimester=1`,
  },
  {
    id: "4",
    turma: {
      name: "12.ª IB",
      description: "Ciências Físicas e Biológicas",
    },
    disciplina: "Física",
    alunos: 24,
    completedStudents: 24,
    totalStudents: 24,
    prazo: {
      date: "08 Dez",
    },
    estado: "concluido",
    href: `/teacher/mini-pautas?classId=12-ib&subject=${encodeURIComponent("Física")}&trimester=1`,
  },
  {
    id: "5",
    turma: {
      name: "9.ª A",
      description: "Ensino geral · Classe de exame",
    },
    disciplina: "Matemática",
    alunos: 20,
    completedStudents: 6,
    totalStudents: 20,
    prazo: {
      date: "12 Dez",
    },
    estado: "em_curso",
    href: `/teacher/mini-pautas?classId=9-a&subject=${encodeURIComponent("Matemática")}&trimester=1`,
  },
];

// Dados do card "Próximos prazos"
export const PROXIMOS_PRAZOS_MOCK = [
  {
    id: "1",
    day: "08",
    month: "DEZ",
    title: "Física",
    subtitle: "10.ª IB · 12.ª IB",
    daysLeftText: "2 dias",
    variant: "urgent" as const,
  },
  {
    id: "2",
    day: "12",
    month: "DEZ",
    title: "Matemática",
    subtitle: "12.ª IB · 11.ª IF · 9.ª A",
    daysLeftText: "4 dias",
    variant: "warning" as const,
  },
  {
    id: "3",
    day: "15",
    month: "DEZ",
    title: "Fecho do sistema",
    subtitle: "Fim do lançamento do 1.º trimestre",
    daysLeftText: "7 dias",
    variant: "neutral" as const,
  },
];

// Dados do card "Actividade recente" (caso queiras adicionar também)
export const ACTIVIDADE_RECENTE_MOCK = [
  {
    id: "1",
    type: "pencil" as const,
    title: "Guardou 6 notas em 12.ª IB · Matemática",
    subtitle: "Hoje, 10:42",
  },
  {
    id: "2",
    type: "eye" as const,
    title: "A direcção acompanhou a mini-pauta de 12.ª IB",
    subtitle: "Hoje, 10:15",
  },
  {
    id: "3",
    type: "check" as const,
    title: "Concluiu 11.ª IF · Matemática",
    subtitle: "Ontem, 16:20",
  },
  {
    id: "4",
    type: "lock" as const,
    title: "Lançamento do 1.º trimestre aberto",
    subtitle: "01 Dez · Direcção pedagógica",
  },
];