"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { ClassRuleListParams } from "@/services/class-rules";
import { classRulesStore } from "@/stores/use-class-rules.store";

export function useClassRules(
  params: ClassRuleListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(classRulesStore, params, options);
}

export function useAllClassRules(options?: { enabled?: boolean }) {
  return useResourceAll(classRulesStore, options);
}
