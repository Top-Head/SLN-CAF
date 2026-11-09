import { API, withQuery } from "../data";
import type { TrimesterResult, TrimesterResultParams } from "./type";

/** `GET /api/avaliacoes/results/` — lista de resultados trimestrais da matrícula. */
export async function getResults(
  params: TrimesterResultParams,
  accessToken?: string,
): Promise<TrimesterResult[]> {
  const response = await API.get<TrimesterResult[]>(
    withQuery("/api/avaliacoes/results/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
