import type { Paginated } from "../data";

export type TrimesterStatus = "ABERTO" | "FECHADO";

export type SchoolYearDetail = {
  id: string;
  ano_inicio: number;
  ano_fim: number;
};

export type Trimester = {
  id: string;
  school_year: string;
  school_year_detail: SchoolYearDetail;
  numero: number;
  status?: TrimesterStatus;
};

export type TrimesterListParams = {
  page?: number;
};

export type TrimesterPayload = {
  school_year: string;
  numero: number;
  status?: TrimesterStatus;
};

export type PaginatedTrimesters = Paginated<Trimester>;
