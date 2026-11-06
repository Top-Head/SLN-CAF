"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { SchoolYearListParams } from "@/services/school-years";
import { schoolYearsStore } from "@/stores/use-school-years.store";

export function useSchoolYears(
  params: SchoolYearListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(schoolYearsStore, params, options);
}

export function useAllSchoolYears(options?: { enabled?: boolean }) {
  return useResourceAll(schoolYearsStore, options);
}
