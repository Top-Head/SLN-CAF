import type { Paginated } from "../data";
import type { GradeScale } from "../grades/type";

/**
 * SIMPLE – exame simples; MEC – média de exame escrito (NEE) e oral (NEO);
 * SPECIAL – exame especial (substitui a média final).
 */
export type ExamType = "SIMPLE" | "MEC" | "SPECIAL";

export type ExamGrade = {
  id: string;
  enrollment: string;
  student_nome: string;
  turma: string;
  school_year: string;
  turma_disciplina: string;
  subject_nome: string;
  school_class_numero: number;
  exam_type?: ExamType;
  exam_value?: string | null;
  nee?: string | null;
  neo?: string | null;
  scale: GradeScale;
  created_by_teacher: string;
  created_at: string;
  updated_at: string;
};

export type ExamGradeListParams = {
  page?: number;
};

export type ExamGradePayload = {
  enrollment: string;
  turma_disciplina: string;
  exam_type: ExamType;
  exam_value?: string | null;
  nee?: string | null;
  neo?: string | null;
};

export type PaginatedExamGrades = Paginated<ExamGrade>;
