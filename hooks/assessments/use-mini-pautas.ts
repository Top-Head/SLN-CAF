"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { MiniPautaListParams } from "@/services/mini-pautas";
import { miniPautasQuadroStore } from "@/stores/use-mini-pautas-quadro.store";
import { miniPautasStore } from "@/stores/use-mini-pautas.store";

export function useMiniPautas(
  params: MiniPautaListParams,
  options?: { enabled?: boolean },
) {
  return useResourceList(miniPautasStore, params, options);
}

/** Quadro de turma-disciplinas do professor, para alimentar os selects. */
export function useMiniPautasQuadro(options?: { enabled?: boolean }) {
  return useResourceAll(miniPautasQuadroStore, options);
}
