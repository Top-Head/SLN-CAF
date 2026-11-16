"use client";

import { getAllCurriculumSubjects } from "@/services/curriculum-subjects";
import type { CurriculumSubject, CurriculumSubjectListParams } from "@/services/curriculum-subjects";
import { createResourceStore } from "@/stores/create-resource-store";

export const curriculumSubjectsStore = createResourceStore<CurriculumSubject, CurriculumSubjectListParams>({
  fetchPage: getAllCurriculumSubjects,
  errorMessage: "Não foi possível carregar o plano curricular.",
});
