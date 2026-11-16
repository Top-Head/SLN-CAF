"use client";

import { getAllSubjectExamRules } from "@/services/subject-exam-rules";
import type { SubjectExamRule, SubjectExamRuleListParams } from "@/services/subject-exam-rules";
import { createResourceStore } from "@/stores/create-resource-store";

export const subjectExamRulesStore = createResourceStore<SubjectExamRule, SubjectExamRuleListParams>({
  fetchPage: getAllSubjectExamRules,
  errorMessage: "Não foi possível carregar as regras de exame.",
});
