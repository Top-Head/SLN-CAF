"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { CourseListParams } from "@/services/courses";
import { coursesStore } from "@/stores/use-courses.store";

export function useCourses(
  params: CourseListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(coursesStore, params, options);
}

export function useAllCourses(options?: { enabled?: boolean }) {
  return useResourceAll(coursesStore, options);
}
