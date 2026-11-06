import type { Paginated } from "../data";

export type Turma = {
  id: string;
  nome: string;
  course: string;
  school_class: string;
  school_year: string;
  /** Nome do diretor de turma (só leitura). */
  director_teacher: string | null;
  course_nome: string;
  school_class_nome: string;
  school_year_label: string;
};

/** Filtros suportados pela listagem: `?course=&school_class=&school_year=`. */
export type TurmaListParams = {
  page?: number;
  course?: string;
  school_class?: string;
  school_year?: string;
};

export type TurmaPayload = {
  nome: string;
  course: string;
  school_class: string;
  school_year: string;
  director_teacher_id?: string | null;
};

export type PaginatedTurmas = Paginated<Turma>;
