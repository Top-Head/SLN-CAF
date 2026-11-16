"use client";

import { getAllClassRules } from "@/services/class-rules";
import type { ClassRule, ClassRuleListParams } from "@/services/class-rules";
import { createResourceStore } from "@/stores/create-resource-store";

export const classRulesStore = createResourceStore<ClassRule, ClassRuleListParams>({
  fetchPage: getAllClassRules,
  errorMessage: "Não foi possível carregar as regras de classe.",
});
