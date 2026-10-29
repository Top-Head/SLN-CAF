import { REPORT_INFO, REPORT_STUDENTS } from "@/app/(admin)/pautas/_lib/mock-data";

// TODO: substituir pela turma do director da sessão quando houver API.
export const CLASS_INFO = {
  name: REPORT_INFO.className,
  course: REPORT_INFO.course,
  director: REPORT_INFO.director,
  period: REPORT_INFO.period,
  year: "2025/2026",
  female: 13,
  male: 11,
  /** Média geral de todas as notas lançadas. */
  average: 11.7,
  positiveGrades: 142,
  negativeGrades: 50,
  /** A partir da 12.ª, regra usada nos "Estudantes em atenção". */
  transitionRule: "12.ª classe: só transita com até 1 negativa",
};

/** Os mesmos estudantes da pauta trimestral da turma. */
export const CLASS_STUDENTS = REPORT_STUDENTS;

export type SubjectStatus = "done" | "ongoing" | "not-started";

export type ClassSubject = {
  name: string;
  teacher: string;
  /** Estudantes com as notas do trimestre lançadas. */
  launched: number;
  average: number | null;
  passed: number;
  failed: number;
};

export const CLASS_SIZE = 24;

export const CLASS_SUBJECTS: ClassSubject[] = [
  { name: "Matemática", teacher: "Paulo Sanguli", launched: 18, average: 12.1, passed: 18, failed: 4 },
  { name: "Português", teacher: "Edmildo Felipe", launched: 24, average: 9.8, passed: 11, failed: 13 },
  { name: "Física", teacher: "Paulo Sanguli", launched: 24, average: 10.3, passed: 13, failed: 11 },
  { name: "Química", teacher: "Joaquim Mbala", launched: 20, average: 9.4, passed: 9, failed: 15 },
  { name: "Biologia", teacher: "António Banga", launched: 24, average: 11.6, passed: 17, failed: 7 },
  { name: "Inglês", teacher: "Marta Kiala", launched: 0, average: null, passed: 0, failed: 0 },
  { name: "Filosofia", teacher: "Rosa Domingos", launched: 24, average: 12.4, passed: 19, failed: 5 },
  { name: "Ed. Física", teacher: "João Neto", launched: 22, average: 15.1, passed: 20, failed: 2 },
];

export function subjectStatus({ launched }: ClassSubject): SubjectStatus {
  if (launched === 0) return "not-started";
  return launched >= CLASS_SIZE ? "done" : "ongoing";
}
