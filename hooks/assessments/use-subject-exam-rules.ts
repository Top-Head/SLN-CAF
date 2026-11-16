"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { SubjectExamRuleListParams } from "@/services/subject-exam-rules";
import { subjectExamRulesStore } from "@/stores/use-subject-exam-rules.store";

export function useSubjectExamRules(
  params: SubjectExamRuleListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(subjectExamRulesStore, params, options);
}

export function useAllSubjectExamRules(options?: { enabled?: boolean }) {
  return useResourceAll(subjectExamRulesStore, options);
}
