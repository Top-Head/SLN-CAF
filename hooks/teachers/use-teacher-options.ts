"use client";

import { useResourceAll } from "@/hooks/resources/use-resource";
import { teacherOptionsStore } from "@/stores/use-teacher-options.store";

/** Todos os professores (todas as páginas), para selects como o de diretor de turma. */
export function useTeacherOptions(options?: { enabled?: boolean }) {
  return useResourceAll(teacherOptionsStore, options);
}
