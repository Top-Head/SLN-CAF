import type { Paginated } from "../data";

/** Disciplina leccionada numa turma por um professor. */
export type TurmaDisciplina = {
  id: string;
  turma: string;
  turma_nome: string;
  course: string;
  course_nome: string;
  school_class: string;
  school_class_numero: number;
  school_year: string;
  school_year_label: string;
  subject: string;
  subject_nome: string;
  teacher: string;
  teacher_nome: string;
};

export type TurmaDisciplinaListParams = {
  page?: number;
  turma?: string;
  teacher?: string;
};

/** `course`, `school_class` e `school_year` têm de ser os da turma. */
export type TurmaDisciplinaPayload = {
  turma: string;
  course: string;
  school_class: string;
  school_year: string;
  subject: string;
  teacher: string;
};

export type PaginatedTurmaDisciplinas = Paginated<TurmaDisciplina>;
