"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { TurmaDisciplinaListParams } from "@/services/turma-disciplinas";
import { turmaDisciplinasStore } from "@/stores/use-turma-disciplinas.store";

export function useTurmaDisciplinas(
  params: TurmaDisciplinaListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(turmaDisciplinasStore, params, options);
}

export function useAllTurmaDisciplinas(options?: { enabled?: boolean }) {
  return useResourceAll(turmaDisciplinasStore, options);
}
