"use client";

import { getTeacherDashboard } from "@/services/teacher-dashboard";
import type {
  DashboardProfessor,
  TeacherDashboardListParams,
} from "@/services/teacher-dashboard";
import { createResourceStore } from "@/stores/create-resource-store";

export const teacherDashboardStore = createResourceStore<
  DashboardProfessor,
  TeacherDashboardListParams
>({
  fetchPage: getTeacherDashboard,
  errorMessage: "Não foi possível carregar os dados do dashboard.",
});
