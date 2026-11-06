"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { TurmaListParams } from "@/services/turmas";
import { turmasStore } from "@/stores/use-turmas.store";

export function useTurmas(
  params: TurmaListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(turmasStore, params, options);
}

export function useAllTurmas(options?: { enabled?: boolean }) {
  return useResourceAll(turmasStore, options);
}
