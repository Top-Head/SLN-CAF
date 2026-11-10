import type { Paginated } from "../data";

/** Cartões do dashboard do professor (`GET /api/teacher/dashboard/`). */
export type TeacherDashboardSummary = {
  turmas: number;
  mini_pautas: number;
  /** Ex.: "2/5". */
  concluidas: string;
  /** Estudantes com notas em falta. */
  por_completar: number;
  /** Trimestre em lançamento (1–3). */
  trimestre: number;
};

/** Nota lançada recentemente (`GET /api/teacher/dashboard/actividade/`). */
export type TeacherActivity = {
  id: string;
  aluno: string;
  turma: string;
  disciplina: string;
  componente: string;
  /** Decimal serializado como string. */
  valor: string;
  data: string;
};

/** Linha do quadro de mini-pautas (`GET /api/teacher/dashboard/mini-pautas-data/`). */
export type TeacherMiniPautaBoardItem = {
  /** ID da turma-disciplina. */
  id: string;
  turma: string;
  disciplina: string;
  classe: number;
  curso: string;
  ano_letivo: string;
  total_alunos: number;
  lancadas: number;
  esperado: number;
  /** Percentagem (0–100). */
  progresso: number;
  estado: string;
};

/** Turma-disciplina do professor (`GET /api/teacher/minhas-turmas/`). */
export type TeacherClass = {
  /** ID da turma-disciplina. */
  id: string;
  turma: string;
  disciplina: string;
  classe: number;
  curso: string;
  ano_letivo: string;
  total_alunos: number;
  completos: number;
  progresso: number;
  estado: string;
  is_classe_exame: boolean;
};

export type TeacherPageParams = { page?: number };

export type PaginatedTeacherDashboard = Paginated<TeacherDashboardSummary>;
export type PaginatedTeacherActivity = Paginated<TeacherActivity>;
export type PaginatedTeacherMiniPautaBoard = Paginated<TeacherMiniPautaBoardItem>;
export type PaginatedTeacherClasses = Paginated<TeacherClass>;
