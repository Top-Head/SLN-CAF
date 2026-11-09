"use client";

import { getMiniPautas } from "@/services/mini-pautas";
import type { MiniPauta, MiniPautaParams } from "@/services/mini-pautas";
import { createResourceStore } from "@/stores/create-resource-store";

export const miniPautasStore = createResourceStore<MiniPauta, MiniPautaParams>({
  fetchPage: getMiniPautas,
  errorMessage: "Não foi possível carregar a mini-pauta.",
});
