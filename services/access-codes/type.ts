import type { Paginated } from "../data";
import type { GradeComponent } from "../grades/type";
import type { StudentGender } from "../students/type";

export type AccessCodeStudent = {
  id: string;
  numero_processo: string;
  nome: string;
  genero: StudentGender | "" | null;
};

export type StudentAccessCode = {
  student: AccessCodeStudent;
  code: string;
  expires_at: string;
};

export type TurmaAccessCodes = {
  count: number;
  turma: { id: string; nome: string };
  codes: StudentAccessCode[];
};

export type SchoolYearSummary = {
  id: string;
  ano_inicio: number;
  ano_fim: number;
};

export type StudentGrade = {
  id: string;
  subject: string;
  subject_id: string;
  turma: string;
  school_year: SchoolYearSummary;
  trimester: number;
  /** MAC, PP ou PT (substituiu `assessment_number`). */
  component: GradeComponent;
  /** Decimal serializado como string, ex.: "14.50". */
  value: string;
  teacher: string;
  created_at: string;
  updated_at: string;
};

export type AccessCodeValidation = {
  student: AccessCodeStudent;
  expires_at: string;
  grades: StudentGrade[];
};

export type ValidateAccessCodePayload = {
  codigo: string;
};

/** Código emitido (gestão): nunca inclui o código em claro. */
export type ManagedAccessCode = {
  id: string;
  student: string;
  student_nome: string;
  student_numero_processo: string;
  expires_at: string;
  revoked: boolean;
  created_at: string;
  last_used_at: string | null;
  created_by_username: string | null;
};

export type ManagedAccessCodeListParams = { page?: number };

export type PaginatedManagedAccessCodes = Paginated<ManagedAccessCode>;
