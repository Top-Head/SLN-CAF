export type TeacherGender = "MASCULINO" | "FEMENINO";

export type Teacher = {
  id: string;
  username: string;
  email: string;
  nome: string;
  telefone: string;
  bi: string;
  genero: TeacherGender;
};

export type TeacherListParams = {
  page?: number;
};

export type CreateTeacherPayload = {
  username: string;
  email: string;
  password: string;
  nome: string;
  telefone: string;
  bi: string;
  genero: TeacherGender;
};

export type TeacherUpdatePayload = {
  username: string;
  email: string;
  nome: string;
  telefone: string;
  bi: string;
  genero: TeacherGender;
};

export type PaginatedTeachers = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Teacher[];
};

export type TeachersStatus = "idle" | "loading" | "success" | "error";

export type TeachersState = {
  teachers: Teacher[];
  count: number;
  page: number;
  next: string | null;
  previous: string | null;
  listStatus: TeachersStatus;
  listError: string | null;
  selectedTeacher: Teacher | null;
  detailTeacherId: string | null;
  detailStatus: TeachersStatus;
  detailError: string | null;
};
