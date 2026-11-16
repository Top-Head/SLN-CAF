"use client";

import { useResourceAll } from "@/hooks/resources/use-resource";
import { studentOptionsStore } from "@/stores/use-student-options.store";

/** Todos os estudantes (todas as páginas), para selects. */
export function useStudentOptions(options?: { enabled?: boolean }) {
  return useResourceAll(studentOptionsStore, options);
}
