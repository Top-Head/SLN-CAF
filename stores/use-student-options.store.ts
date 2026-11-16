"use client";

import { getAllStudents } from "@/services/students";
import type { Student, StudentListParams } from "@/services/students";
import { createResourceStore } from "@/stores/create-resource-store";

/** Todos os estudantes, para selects (ex.: matrícula). */
export const studentOptionsStore = createResourceStore<Student, StudentListParams>({
  fetchPage: (params, token) => getAllStudents(params, token),
  errorMessage: "Não foi possível carregar os estudantes.",
});
