import type { Paginated } from "../data";

/** Classe (ano de escolaridade), ex.: 10 → "10.ª classe". */
export type SchoolClass = {
  id: string;
  numero: number;
};

export type SchoolClassListParams = {
  page?: number;
};

export type SchoolClassPayload = {
  numero: number;
};

export type PaginatedSchoolClasses = Paginated<SchoolClass>;
