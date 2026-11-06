"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { SubjectListParams } from "@/services/subjects";
import { subjectsStore } from "@/stores/use-subjects.store";

export function useSubjects(
  params: SubjectListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(subjectsStore, params, options);
}

export function useAllSubjects(options?: { enabled?: boolean }) {
  return useResourceAll(subjectsStore, options);
}
