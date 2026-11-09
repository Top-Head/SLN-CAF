"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import {
  teacherActivityStore,
  teacherClassesStore,
  teacherDashboardStore,
  teacherMiniPautasBoardStore,
} from "@/stores/use-teacher-dashboard.store";

/** Cartões do dashboard (a API devolve uma lista com um único resumo). */
export function useTeacherDashboardSummary() {
  const list = useResourceList(teacherDashboardStore, {});
  return { ...list, summary: list.items[0] ?? null };
}

/** Primeira página da actividade recente. */
export function useTeacherActivity() {
  return useResourceList(teacherActivityStore, {});
}

/** Todas as mini-pautas do professor, com o progresso de lançamento. */
export function useTeacherMiniPautasBoard() {
  return useResourceAll(teacherMiniPautasBoardStore);
}

/** Todas as turmas-disciplina do professor. */
export function useTeacherClasses() {
  return useResourceAll(teacherClassesStore);
}
