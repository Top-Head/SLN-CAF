import type { Paginated } from "../data";

/** Linha de aluno dentro de uma mini-pauta (notas como decimal em string). */
export type MiniPautaAluno = {
  enrollment_id: string;
  numero: number;
  aluno: string;
  numero_processo: string;
  sexo: string;
  mac: string | null;
  pp: string | null;
  pt: string | null;
  mt: string | null;
  resultado: string;
};

/** Mini-pauta de uma turma-disciplina num trimestre. */
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
  alunos: MiniPautaAluno[];
};

/** Filtro de resultado aceite pela API. */
export type MiniPautaResultado =
  | "todos"
  | "positivas"
  | "negativas"
  | "pendentes";

export type MiniPautaListParams = {
  page?: number;
  /** Obrigatório: id da turma-disciplina. */
  turma_disciplina_id: string;
  /** 1, 2 ou 3. Se vazio, a API usa o trimestre aberto. */
  trimestre?: number;
  resultado?: MiniPautaResultado;
  /** Nome ou nº de processo do aluno. */
  search?: string;
};

/** Item do quadro de mini-pautas do professor (turma-disciplina). */
export type QuadroMiniPauta = {
  id: string;
  turma: string;
  disciplina: string;
  classe: number;
  curso: string;
  ano_letivo: string;
  total_alunos: number;
  lancadas: number;
  esperado: number;
  progresso: number;
  estado: string;
};

export type QuadroMiniPautaListParams = {
  page?: number;
};

export type PaginatedMiniPautas = Paginated<MiniPauta>;

export type PaginatedQuadroMiniPauta = Paginated<QuadroMiniPauta>;
