import type { Paginated } from "../data";

/** MAC – avaliação contínua, PP – prova do professor, PT – prova trimestral. */
export type GradeComponent = "MAC" | "PP" | "PT";

/** Escala de avaliação vigente para a classe da nota. */
export type GradeScale = {
  min: number;
  max: number;
  passing: number;
  rounding: string;
};

export type Grade = {
  id: string;
  enrollment: string;
  student_nome: string;
  turma: string;
  turma_nome: string;
  school_year: string;
  turma_disciplina: string;
  subject_nome: string;
  trimester: string;
  trimester_numero: number;
  component?: GradeComponent;
  /** Decimal serializado como string, ex.: "14.50". */
  value: string;
  school_class_numero: number;
  scale: GradeScale;
  created_by_teacher: string;
  created_at: string;
  updated_at: string;
};

export type GradeListParams = {
  page?: number;
};

export type GradePayload = {
  enrollment: string;
  turma_disciplina: string;
  trimester: string;
  component: GradeComponent;
  value: string;
};

export type PaginatedGrades = Paginated<Grade>;
