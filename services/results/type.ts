import type { GradeComponent } from "../grades/type";
import type { PromotionStatus } from "../promotion-decisions/type";

/** Decimal serializado como string (ex.: "12.50"), ou `null` sem dados. */
export type Decimal = string | null;

export type ComponentValues = Record<GradeComponent, Decimal>;

export type TrimesterResultSubject = {
  turma_disciplina: string;
  subject: string;
  teacher: string;
  components: ComponentValues;
  required_components: string[];
  average: Decimal;
  is_complete: boolean;
};

export type TrimesterResult = {
  enrollment: string;
  student: string;
  turma: string;
  school_class: number;
  /** Número do trimestre (1–3). */
  trimester: number;
  scale_min: string;
  scale_max: string;
  passing_grade: string;
  is_initiation: boolean;
  subjects: TrimesterResultSubject[];
};

export type ExamDetail = {
  type: string;
  value?: Decimal;
  nee?: Decimal;
  neo?: Decimal;
};

export type AnnualResultSubject = {
  turma_disciplina: string;
  subject: string;
  mt1: Decimal;
  mt2: Decimal;
  mt3: Decimal;
  /** Média final da disciplina (antes do exame). */
  mfd: Decimal;
  exam_type: string;
  exam: ExamDetail | null;
  /** Média final. */
  mf: Decimal;
  negative: boolean;
  is_complete: boolean;
};

export type AnnualResult = {
  enrollment: string;
  student: string;
  turma: string;
  school_class: number;
  school_year: string;
  scale_min: string;
  scale_max: string;
  passing_grade: string;
  subjects: AnnualResultSubject[];
};

export type PromotionSubject = {
  subject: string;
  mfd: Decimal;
  mf: Decimal;
  negative: boolean;
};

export type PromotionDecisionDetail = {
  id: string;
  status: PromotionStatus;
  reason: string;
  details: unknown;
  decided_by: string;
  created_at: string;
};

export type PromotionResult = {
  enrollment: string;
  student: string;
  turma: string;
  school_class: number;
  school_year: string;
  status: string;
  suggested_status: string;
  negative_count: number;
  allowed_negative_count: number;
  is_complete: boolean;
  subjects: PromotionSubject[];
  decision: PromotionDecisionDetail | null;
};

export type TrimesterResultParams = {
  enrollment: string;
  trimester: string;
};

export type YearResultParams = {
  enrollment: string;
  school_year: string;
};
