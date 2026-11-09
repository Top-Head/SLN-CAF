"use client";

import { getMiniPautas } from "@/services/mini-pautas";
import type { MiniPauta, MiniPautaListParams } from "@/services/mini-pautas";
import { createResourceStore } from "@/stores/create-resource-store";

export const miniPautasStore = createResourceStore<
  MiniPauta,
  MiniPautaListParams
>({
  fetchPage: getMiniPautas,
  errorMessage: "Não foi possível carregar a mini-pauta.",
});
