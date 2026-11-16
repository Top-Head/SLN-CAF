"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { EnrollmentListParams } from "@/services/enrollments";
import { enrollmentsStore } from "@/stores/use-enrollments.store";

export function useEnrollments(
  params: EnrollmentListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(enrollmentsStore, params, options);
}

export function useAllEnrollments(options?: { enabled?: boolean }) {
  return useResourceAll(enrollmentsStore, options);
}
