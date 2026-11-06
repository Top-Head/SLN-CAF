"use client";

import { getAllSchoolClasses } from "@/services/school-classes";
import type { SchoolClass, SchoolClassListParams } from "@/services/school-classes";
import { createResourceStore } from "@/stores/create-resource-store";

export const schoolClassesStore = createResourceStore<SchoolClass, SchoolClassListParams>({
  fetchPage: getAllSchoolClasses,
  errorMessage: "Não foi possível carregar as classes.",
});
