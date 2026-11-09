"use client";

import { getAllExamGrades } from "@/services/exams";
import type { ExamGrade, ExamGradeListParams } from "@/services/exams";
import { createResourceStore } from "@/stores/create-resource-store";

export const examsStore = createResourceStore<ExamGrade, ExamGradeListParams>({
  fetchPage: getAllExamGrades,
  errorMessage: "Não foi possível carregar as notas de exame.",
});
