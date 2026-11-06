"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { SchoolClassListParams } from "@/services/school-classes";
import { schoolClassesStore } from "@/stores/use-school-classes.store";

export function useSchoolClasses(
  params: SchoolClassListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(schoolClassesStore, params, options);
}

export function useAllSchoolClasses(options?: { enabled?: boolean }) {
  return useResourceAll(schoolClassesStore, options);
}
