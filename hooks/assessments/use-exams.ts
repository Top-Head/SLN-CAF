"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { ExamGradeListParams } from "@/services/exams";
import { examsStore } from "@/stores/use-exams.store";

export function useExamGrades(
  params: ExamGradeListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(examsStore, params, options);
}

export function useAllExamGrades(options?: { enabled?: boolean }) {
  return useResourceAll(examsStore, options);
}
