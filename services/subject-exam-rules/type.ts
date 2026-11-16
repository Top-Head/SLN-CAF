import type { Paginated } from "../data";

export type SubjectExamType = "SIMPLE" | "MEC" | "EXEMPT";

/** Tipo de exame de uma disciplina numa classe. */
export type SubjectExamRule = {
  id: string;
  school_class_numero: number;
  subject: string;
  subject_nome: string;
  exam_type?: SubjectExamType;
  effective_from?: number;
};

export type SubjectExamRuleListParams = { page?: number };

export type SubjectExamRulePayload = {
  school_class_numero: number;
  subject: string;
  exam_type: SubjectExamType;
  effective_from: number;
};

export type PaginatedSubjectExamRules = Paginated<SubjectExamRule>;
