"use client";

import { getAllTurmaDisciplinas } from "@/services/turma-disciplinas";
import type { TurmaDisciplina, TurmaDisciplinaListParams } from "@/services/turma-disciplinas";
import { createResourceStore } from "@/stores/create-resource-store";

export const turmaDisciplinasStore = createResourceStore<TurmaDisciplina, TurmaDisciplinaListParams>({
  fetchPage: getAllTurmaDisciplinas,
  errorMessage: "Não foi possível carregar as disciplinas por turma.",
});
