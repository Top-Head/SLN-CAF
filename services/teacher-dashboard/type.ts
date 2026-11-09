import type { Paginated } from "../data";

/** Cards resumo do dashboard do professor. */
export type DashboardProfessor = {
  turmas: number;
  mini_pautas: number;
  /** Formato "concluídas/total", ex.: "2/5". */
  concluidas: string;
  por_completar: number;
  trimestre: number;
};

/** Registo de lançamento recente de uma nota. */
export type ActividadeRecente = {
  id: string;
  aluno: string;
  turma: string;
  disciplina: string;
  componente: string;
  valor: string;
  data: string;
};

export type TeacherDashboardListParams = {
  page?: number;
};

export type ActividadeRecenteListParams = {
  page?: number;
};

export type PaginatedDashboardProfessor = Paginated<DashboardProfessor>;

export type PaginatedActividadeRecente = Paginated<ActividadeRecente>;
