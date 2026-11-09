"use client";

import { useResourceList } from "@/hooks/resources/use-resource";
import type { MiniPautaParams } from "@/services/mini-pautas";
import { miniPautasStore } from "@/stores/use-mini-pautas.store";

/** Mini-pauta de uma turma-disciplina; não pede nada sem `turma_disciplina_id`. */
export function useMiniPauta(params: MiniPautaParams | null) {
  const list = useResourceList(
    miniPautasStore,
    params ?? { turma_disciplina_id: "" },
    { enabled: Boolean(params?.turma_disciplina_id) },
  );
  return { ...list, miniPauta: params ? (list.items[0] ?? null) : null };
}
