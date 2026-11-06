"use client";

import { getAllTurmas } from "@/services/turmas";
import type { Turma, TurmaListParams } from "@/services/turmas";
import { createResourceStore } from "@/stores/create-resource-store";

export const turmasStore = createResourceStore<Turma, TurmaListParams>({
  fetchPage: getAllTurmas,
  errorMessage: "Não foi possível carregar as turmas.",
});
