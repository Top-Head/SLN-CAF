"use client";

import { getAllCourses } from "@/services/courses";
import type { Course, CourseListParams } from "@/services/courses";
import { createResourceStore } from "@/stores/create-resource-store";

export const coursesStore = createResourceStore<Course, CourseListParams>({
  fetchPage: getAllCourses,
  errorMessage: "Não foi possível carregar os cursos.",
});
