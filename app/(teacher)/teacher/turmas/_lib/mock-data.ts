export type ClassStatus = "in_progress" | "not_started" | "completed";

export type TeacherClass = {
  id: string;
  grade: string;
  subGroup: string;
  subject: string;
  course: string;
  status: ClassStatus;
  students: number;
  scale: string;
  trimester: string;
  completed: number;
  total: number;
  deadline: string;
  badge?: string;
  /** Ano letivo (ex.: "2025/2026"); sem ele a turma aparece em todos os anos. */
  year?: string;
  /** Links da turma-disciplina; por omissão, as páginas gerais. */
  launchHref?: string;
  miniPautaHref?: string;
};

export const ACADEMIC_YEARS = ["2025/2026", "2024/2025"];

export const TRIMESTERS = ["1.º Trimestre", "2.º Trimestre", "3.º Trimestre"];

export const STATUS_LABEL: Record<ClassStatus, string> = {
  in_progress: "Em curso",
  not_started: "Por iniciar",
  completed: "Concluído",
};
