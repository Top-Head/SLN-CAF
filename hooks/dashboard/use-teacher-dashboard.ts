"use client";

import { useResourceList } from "@/hooks/resources/use-resource";
import { teacherActividadeStore } from "@/stores/use-teacher-actividade.store";
import { teacherDashboardStore } from "@/stores/use-teacher-dashboard.store";

/** Cards resumo do dashboard do professor. */
export function useTeacherDashboard(options?: { enabled?: boolean }) {
  return useResourceList(teacherDashboardStore, { page: 1 }, options);
}

/** Actividade recente de lançamento de notas do professor. */
export function useTeacherActividade(options?: { enabled?: boolean }) {
  return useResourceList(teacherActividadeStore, { page: 1 }, options);
}
