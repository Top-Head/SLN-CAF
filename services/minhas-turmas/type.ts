import type { Paginated } from "../data";

/** Turma-disciplina atribuída ao professor autenticado. */
export type MinhaTurma = {
  id: string;
  turma: string;
  disciplina: string;
  classe: number;
  curso: string;
  ano_letivo: string;
  total_alunos: number;
  completos: number;
  /** Percentagem de alunos com notas lançadas (0–100). */
  progresso: number;
  estado: string;
  is_classe_exame: boolean;
};

export type MinhaTurmaListParams = {
  page?: number;
};

export type PaginatedMinhasTurmas = Paginated<MinhaTurma>;
