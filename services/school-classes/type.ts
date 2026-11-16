import type { Paginated } from "../data";

/** Classe (ano de escolaridade), ex.: 10 → "10.ª classe". */
export type SchoolClass = {
  id: string;
  numero: number;
  /** Classe de iniciação: não usa o sistema de notas. */
  is_initiation?: boolean;
};

export type SchoolClassListParams = {
  page?: number;
};

export type SchoolClassPayload = {
  numero: number;
  is_initiation?: boolean;
};

export type PaginatedSchoolClasses = Paginated<SchoolClass>;
