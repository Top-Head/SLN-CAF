"use client";

import { getAllSchoolYears } from "@/services/school-years";
import type { SchoolYear, SchoolYearListParams } from "@/services/school-years";
import { createResourceStore } from "@/stores/create-resource-store";

export const schoolYearsStore = createResourceStore<SchoolYear, SchoolYearListParams>({
  fetchPage: getAllSchoolYears,
  errorMessage: "Não foi possível carregar os anos letivos.",
});
