import type { Paginated } from "../data";

export type Subject = {
  id: string;
  nome: string;
};

export type SubjectListParams = {
  page?: number;
};

export type SubjectPayload = {
  nome: string;
};

export type PaginatedSubjects = Paginated<Subject>;
