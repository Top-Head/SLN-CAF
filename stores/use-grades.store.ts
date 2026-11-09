"use client";

import { getAllGrades } from "@/services/grades";
import type { Grade, GradeListParams } from "@/services/grades";
import { createResourceStore } from "@/stores/create-resource-store";

export const gradesStore = createResourceStore<Grade, GradeListParams>({
  fetchPage: getAllGrades,
  errorMessage: "Não foi possível carregar as notas.",
});
