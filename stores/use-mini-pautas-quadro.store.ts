"use client";

import { getMiniPautasQuadro } from "@/services/mini-pautas";
import type {
  QuadroMiniPauta,
  QuadroMiniPautaListParams,
} from "@/services/mini-pautas";
import { createResourceStore } from "@/stores/create-resource-store";

export const miniPautasQuadroStore = createResourceStore<
  QuadroMiniPauta,
  QuadroMiniPautaListParams
>({
  fetchPage: getMiniPautasQuadro,
  errorMessage: "Não foi possível carregar as mini-pautas.",
});
