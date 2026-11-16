import type { Paginated } from "../data";

export type RoundingMode = "HALF_UP" | "HALF_DOWN" | "UP" | "DOWN";

/** Escala de avaliação por intervalo de classes. */
export type GradingScale = {
  id: string;
  class_min: number;
  class_max: number;
  /** Decimais serializados como string. */
  min_value?: string;
  max_value: string;
  passing_value: string;
  rounding_mode?: RoundingMode;
  /** Ano de início letivo a partir do qual se aplica. */
  effective_from?: number;
};

export type GradingScaleListParams = { page?: number };

export type GradingScalePayload = {
  class_min: number;
  class_max: number;
  min_value: string;
  max_value: string;
  passing_value: string;
  rounding_mode: RoundingMode;
  effective_from: number;
};

export type PaginatedGradingScales = Paginated<GradingScale>;
