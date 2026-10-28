import { day } from "@/lib/utils/format-date";

/** "Hoje" fixo dos dados de exemplo, para as contas de dias serem estáveis. */
export const TODAY = day(2026, 10, 18);

export const SYSTEM = {
  trimester: "1.º trimestre",
  year: "2026/2027",
  openedBy: "Edilson Capa",
  openedAt: "06/10/2026, 08:00",
  opensOn: day(2026, 10, 6),
  closesOn: day(2026, 10, 24),
  gradesLaunched: 68,
  gradesTotal: 4320,
  teachersWithPending: 7,
  teachersTotal: 31,
};

export type SubjectPeriod = {
  id: string;
  subject: string;
  scope: string;
  start: Date;
  end: Date;
  /** Dias acrescentados ao prazo original. */
  extendedBy: number;
  /** Percentagem de notas lançadas. */
  launched: number;
  /** Encerrado à mão antes do fim do prazo. */
  closedManually: boolean;
};

const OPEN = day(2026, 10, 6);
const CLOSE = day(2026, 10, 24);

export const PERIODS: SubjectPeriod[] = [
  { id: "mat", subject: "Matemática", scope: "7.ª – 12.ª classe · 14 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 72, closedManually: false },
  { id: "fis", subject: "Física", scope: "10.ª – 12.ª classe · 6 turmas", start: OPEN, end: day(2026, 10, 19), extendedBy: 0, launched: 54, closedManually: false },
  { id: "qui", subject: "Química", scope: "10.ª – 12.ª classe · 6 turmas", start: OPEN, end: day(2026, 10, 20), extendedBy: 3, launched: 63, closedManually: false },
  { id: "ef", subject: "Educação Física", scope: "1.ª – 12.ª classe · 31 turmas", start: OPEN, end: day(2026, 10, 15), extendedBy: 0, launched: 100, closedManually: false },
  { id: "ing", subject: "Inglês", scope: "7.ª – 12.ª classe · 14 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 47, closedManually: false },
  { id: "pt", subject: "Projecto Tecnológico", scope: "12.ª classe · 2 turmas", start: day(2026, 10, 27), end: day(2026, 11, 7), extendedBy: 0, launched: 0, closedManually: false },
  { id: "lp", subject: "Língua Portuguesa", scope: "7.ª – 12.ª classe · 14 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 81, closedManually: false },
  { id: "bio", subject: "Biologia", scope: "7.ª – 10.ª classe · 10 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 66, closedManually: false },
  { id: "his", subject: "História", scope: "7.ª – 12.ª classe · 12 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 58, closedManually: false },
  { id: "geo", subject: "Geografia", scope: "7.ª – 12.ª classe · 12 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 70, closedManually: false },
  { id: "tlp", subject: "Técnicas de Programação", scope: "10.ª – 12.ª classe · 6 turmas", start: OPEN, end: CLOSE, extendedBy: 0, launched: 44, closedManually: false },
  { id: "fil", subject: "Filosofia", scope: "10.ª – 12.ª classe · 8 turmas", start: OPEN, end: day(2026, 10, 14), extendedBy: 0, launched: 100, closedManually: false },
];

export type HistoryEvent = {
  id: string;
  author: string;
  initials: string;
  tone: "primary" | "info" | "neutral";
  action: string;
  when: string;
};

export const HISTORY: HistoryEvent[] = [
  { id: "h1", author: "Edilson Capa", initials: "EC", tone: "primary", action: "prolongou o prazo de Química até 20 Out (+3 dias)", when: "há 2 horas" },
  { id: "h2", author: "Otávio", initials: "OT", tone: "info", action: "agendou Projecto Tecnológico para 27 Out – 07 Nov", when: "ontem, 16:20" },
  { id: "h3", author: "Paulo", initials: "PA", tone: "neutral", action: "encerrou Educação Física no fim do prazo", when: "15 Out, 23:59" },
];

export const RULES = [
  "Terminado o prazo, os professores deixam de lançar notas nessa disciplina.",
  "Fechar o sistema bloqueia todos os lançamentos, mesmo com prazos activos.",
  "Correções de provas fora do prazo só podem ser feitas pelos directores.",
];

export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];
export const GRADE_FILTERS = ["Todas as classes", "1.ª – 6.ª classe", "7.ª – 9.ª classe", "10.ª – 12.ª classe"];
