"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { CurriculumSubjectListParams } from "@/services/curriculum-subjects";
import { curriculumSubjectsStore } from "@/stores/use-curriculum-subjects.store";

export function useCurriculumSubjects(
  params: CurriculumSubjectListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(curriculumSubjectsStore, params, options);
}

export function useAllCurriculumSubjects(options?: { enabled?: boolean }) {
  return useResourceAll(curriculumSubjectsStore, options);
}
