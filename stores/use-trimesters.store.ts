"use client";

import { getAllTrimesters } from "@/services/trimesters";
import type { Trimester, TrimesterListParams } from "@/services/trimesters";
import { createResourceStore } from "@/stores/create-resource-store";

export const trimestersStore = createResourceStore<Trimester, TrimesterListParams>({
  fetchPage: getAllTrimesters,
  errorMessage: "Não foi possível carregar os trimestres.",
});
