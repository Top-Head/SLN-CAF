"use client";

import { getAllSubjects } from "@/services/subjects";
import type { Subject, SubjectListParams } from "@/services/subjects";
import { createResourceStore } from "@/stores/create-resource-store";

export const subjectsStore = createResourceStore<Subject, SubjectListParams>({
  fetchPage: getAllSubjects,
  errorMessage: "Não foi possível carregar as disciplinas.",
});
