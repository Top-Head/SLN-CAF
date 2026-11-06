export type StudentGender = "Masculino" | "Feminino";

export type Student = {
  id: string;
  numero_processo: string;
  nome: string;
  genero: StudentGender | "" | null;
  created_at: string;
};

export type StudentListParams = {
  page?: number;
  search?: string;
};

export type CreateStudentPayload = {
  numero_processo: string;
  nome: string;
  genero?: StudentGender | "" | null;
};

export type StudentUpdatePayload = CreateStudentPayload;

export type PaginatedStudents = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
};

export type StudentsStatus = "idle" | "loading" | "success" | "error";

export type StudentsState = {
  students: Student[];
  count: number;
  page: number;
  search: string;
  next: string | null;
  previous: string | null;
  listStatus: StudentsStatus;
  listError: string | null;
  selectedStudent: Student | null;
  detailStudentId: string | null;
  detailStatus: StudentsStatus;
  detailError: string | null;
};
