import type { Paginated } from "../data";

export type MiniPautaResultFilter = "todos" | "positivas" | "negativas" | "pendentes";

export type MiniPautaStudent = {
  enrollment_id: string;
  numero: number;
  aluno: string;
  numero_processo: string;
  sexo: string;
  /** Decimais serializados como string, ou `null` sem nota. */
  mac: string | null;
  pp: string | null;
  pt: string | null;
  /** Média trimestral. */
  mt: string | null;
  resultado: string;
};

export type MiniPauta = {
  turma_disciplina_id: string;
  titulo: string;
  turma: string;
  curso: string;
  disciplina: string;
  periodo: string;
  ano_letivo: string;
  media_turma: string | null;
  estado: string;
  total: number;
  positivas: number;
  negativas: number;
  pendentes: number;
  alunos: MiniPautaStudent[];
};

/**
 * Filtros da mini-pauta. O schema só documenta `page` na listagem, mas o PDF
 * usa os mesmos filtros; a listagem recebe-os também.
 */
export type MiniPautaParams = {
  turma_disciplina_id: string;
  /** 1, 2 ou 3. Vazio: o trimestre aberto. */
  trimestre?: number;
  resultado?: MiniPautaResultFilter;
  /** Nome ou n.º de processo do aluno. */
  search?: string;
  page?: number;
};

export type PaginatedMiniPautas = Paginated<MiniPauta>;
