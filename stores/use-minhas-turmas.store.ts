"use client";

import { getMinhasTurmas } from "@/services/minhas-turmas";
import type { MinhaTurma, MinhaTurmaListParams } from "@/services/minhas-turmas";
import { createResourceStore } from "@/stores/create-resource-store";

export const minhasTurmasStore = createResourceStore<
  MinhaTurma,
  MinhaTurmaListParams
>({
  fetchPage: getMinhasTurmas,
  errorMessage: "Não foi possível carregar as suas turmas.",
});
