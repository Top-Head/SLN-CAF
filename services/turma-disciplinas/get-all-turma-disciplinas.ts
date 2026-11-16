import { API, withQuery } from "../data";
import type { PaginatedTurmaDisciplinas, TurmaDisciplinaListParams } from "./type";

export async function getAllTurmaDisciplinas(
  params: TurmaDisciplinaListParams = {},
  accessToken?: string,
): Promise<PaginatedTurmaDisciplinas> {
  const response = await API.get<PaginatedTurmaDisciplinas>(
    withQuery("/api/avaliacoes/turma-disciplinas/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
