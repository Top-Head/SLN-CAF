import type { Paginated } from "../data";

/** Regra de avaliação de uma classe (componentes, pesos, exame, transição). */
export type ClassRule = {
  id: string;
  school_class_numero: number;
  approved_max_negatives?: number;
  recourse_max_negatives?: number | null;
  direct_fail_min_negatives?: number | null;
  has_final_exam?: boolean;
  /** Decimais serializados como string (ex.: "0.40"). */
  exam_weight?: string;
  mfd_weight?: string;
  /** Trimestre em que o PT não se aplica (ex.: 3 na 6.ª e 9.ª). */
  pt_disabled_trimester?: number | null;
  allowed_negative_subject?: string | null;
  allowed_negative_subject_nome: string;
  notes?: string;
  effective_from?: number;
};

export type ClassRuleListParams = { page?: number };

export type ClassRulePayload = Omit<ClassRule, "id" | "allowed_negative_subject_nome">;

export type PaginatedClassRules = Paginated<ClassRule>;
