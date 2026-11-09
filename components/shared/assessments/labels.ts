import type { AuditAction } from "@/services/audit-logs";
import type { ExamType } from "@/services/exams";
import type { GradeComponent } from "@/services/grades";
import type { PromotionStatus } from "@/services/promotion-decisions";
import type { TrimesterStatus } from "@/services/trimesters";

export const COMPONENT_LABELS: Record<GradeComponent, string> = {
  MAC: "MAC · Média das avaliações contínuas",
  PP: "PP · Prova do professor",
  PT: "PT · Prova trimestral",
};

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  SIMPLE: "Exame simples",
  MEC: "Exame escrito e oral (MEC)",
  SPECIAL: "Exame especial",
};

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  RECURSO: "Recurso",
  EXAME_ESPECIAL: "Exame especial",
  PENDENTE_DECISAO: "Pendente de decisão",
};

export const TRIMESTER_STATUS_LABELS: Record<TrimesterStatus, string> = {
  ABERTO: "Aberto",
  FECHADO: "Fechado",
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Eliminação",
  LOGIN: "Início de sessão",
  LOGIN_FAILED: "Início de sessão falhado",
  LOGOUT: "Fim de sessão",
  REFRESH: "Renovação de token",
  REGISTER: "Registo",
  PASSWORD_RESET: "Recuperação de palavra-passe",
  VALIDATE: "Validação",
  OTHER: "Outra ação",
};

export const optionsOf = <K extends string>(labels: Record<K, string>) =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({
    value,
    label,
  }));

/** Rótulo do estado de promoção, aceitando valores fora do enum. */
export function promotionLabel(status?: string | null) {
  if (!status) return "—";
  return PROMOTION_STATUS_LABELS[status as PromotionStatus] ?? status;
}

/** "12.50" → "12,5"; `null`/vazio → "—". */
export function formatDecimal(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("pt-PT", { maximumFractionDigits: 2 })
    : String(value);
}

/** Converte o texto do formulário ("12,5") para o decimal da API ("12.5"). */
export function toDecimal(value: string) {
  const text = value.trim().replace(",", ".");
  return text === "" ? null : text;
}

export function isDecimal(value: string) {
  return /^\d{1,2}([.,]\d{1,2})?$/.test(value.trim());
}

export const trimesterLabel = (t: {
  numero: number;
  school_year_detail?: { ano_inicio: number; ano_fim: number } | null;
}) =>
  t.school_year_detail
    ? `${t.numero}.º trimestre · ${t.school_year_detail.ano_inicio}/${t.school_year_detail.ano_fim}`
    : `${t.numero}.º trimestre`;
