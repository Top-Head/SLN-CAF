import type { Paginated } from "../data";

export type PromotionStatus =
  | "APROVADO"
  | "REPROVADO"
  | "RECURSO"
  | "EXAME_ESPECIAL"
  | "PENDENTE_DECISAO";

export type PromotionDecision = {
  id: string;
  enrollment: string;
  school_year: string;
  status: PromotionStatus;
  reason: string;
  details: unknown;
  created_at: string;
};

export type PromotionDecisionListParams = {
  page?: number;
};

export type PromotionDecisionPayload = {
  enrollment: string;
  school_year: string;
  status: PromotionStatus;
  reason: string;
};

export type PaginatedPromotionDecisions = Paginated<PromotionDecision>;
