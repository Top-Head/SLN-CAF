import type { Paginated } from "../data";

export type EnrollmentStatus = "ATIVA" | "TRANSFERIDA" | "CONCLUIDA" | "ANULADA";

/** Matrícula de um aluno numa turma e ano letivo. Só ATIVA entra nos cálculos. */
export type Enrollment = {
  id: string;
  student: string;
  student_nome: string;
  student_numero_processo: string;
  turma: string;
  turma_nome: string;
  school_class_numero: number;
  school_year: string;
  school_year_label: string;
  /** Número de ordem na pauta (manual). */
  numero_ordem: number | null;
  data_matricula: string;
  status?: EnrollmentStatus;
};

/**
 * O schema só documenta `page`; os filtros seguem o fluxo académico e são
 * ignorados pela API se não forem suportados.
 */
export type EnrollmentListParams = {
  page?: number;
  turma?: string;
  school_year?: string;
  status?: EnrollmentStatus;
};

export type EnrollmentPayload = {
  student: string;
  turma: string;
  /** Deve ser o ano letivo da turma. */
  school_year: string;
  numero_ordem?: number | null;
  status?: EnrollmentStatus;
};

export type PaginatedEnrollments = Paginated<Enrollment>;
