"use client";

import { getAllGradingScales } from "@/services/grading-scales";
import type { GradingScale, GradingScaleListParams } from "@/services/grading-scales";
import { createResourceStore } from "@/stores/create-resource-store";

export const gradingScalesStore = createResourceStore<GradingScale, GradingScaleListParams>({
  fetchPage: getAllGradingScales,
  errorMessage: "Não foi possível carregar as escalas de avaliação.",
});
