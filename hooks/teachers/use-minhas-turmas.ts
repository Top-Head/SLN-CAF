"use client";

import { useResourceAll } from "@/hooks/resources/use-resource";
import { minhasTurmasStore } from "@/stores/use-minhas-turmas.store";

/** Todas as turmas-disciplinas atribuídas ao professor. */
export function useMinhasTurmas(options?: { enabled?: boolean }) {
  return useResourceAll(minhasTurmasStore, options);
}
