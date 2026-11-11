"use client";

import { getTeacherActividade } from "@/services/teacher-dashboard";
import type {
  ActividadeRecente,
  ActividadeRecenteListParams,
} from "@/services/teacher-dashboard";
import { createResourceStore } from "@/stores/create-resource-store";

export const teacherActividadeStore = createResourceStore<
  ActividadeRecente,
  ActividadeRecenteListParams
>({
  fetchPage: getTeacherActividade,
  errorMessage: "Não foi possível carregar a actividade recente.",
});
