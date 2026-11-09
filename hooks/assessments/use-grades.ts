"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { GradeListParams } from "@/services/grades";
import { gradesStore } from "@/stores/use-grades.store";

export function useGrades(
  params: GradeListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(gradesStore, params, options);
}

export function useAllGrades(options?: { enabled?: boolean }) {
  return useResourceAll(gradesStore, options);
}
