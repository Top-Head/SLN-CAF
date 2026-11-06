import type { Paginated } from "../data";

export type SchoolYear = {
  id: string;
  ano_inicio: number;
  ano_fim: number;
};

export type SchoolYearListParams = {
  page?: number;
};

export type SchoolYearPayload = {
  ano_inicio: number;
  ano_fim: number;
};

export type PaginatedSchoolYears = Paginated<SchoolYear>;
