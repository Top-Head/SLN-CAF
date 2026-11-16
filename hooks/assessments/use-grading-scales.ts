"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { GradingScaleListParams } from "@/services/grading-scales";
import { gradingScalesStore } from "@/stores/use-grading-scales.store";

export function useGradingScales(
  params: GradingScaleListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(gradingScalesStore, params, options);
}

export function useAllGradingScales(options?: { enabled?: boolean }) {
  return useResourceAll(gradingScalesStore, options);
}
