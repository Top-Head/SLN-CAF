import { API, toPaginated, withQuery } from "../data";
import type { MiniPautaParams, PaginatedMiniPautas } from "./type";

/** `GET /api/teacher/mini-pautas/` — mini-pauta de uma turma-disciplina (só leitura). */
export async function getMiniPautas(
  params: MiniPautaParams,
  accessToken?: string,
): Promise<PaginatedMiniPautas> {
  const response = await API.get<unknown>(
    withQuery("/api/teacher/mini-pautas/", params),
    { accessToken, cache: "no-store" },
  );

  return toPaginated(response.data);
}
