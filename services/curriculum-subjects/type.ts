import type { Paginated } from "../data";

/** Plano curricular: disciplina de um curso numa classe. */
export type CurriculumSubject = {
  id: string;
  course: string;
  course_nome: string;
  school_class: string;
  school_class_numero: number;
  subject: string;
  subject_nome: string;
};

export type CurriculumSubjectListParams = { page?: number };

export type CurriculumSubjectPayload = {
  course: string;
  school_class: string;
  subject: string;
};

export type PaginatedCurriculumSubjects = Paginated<CurriculumSubject>;
