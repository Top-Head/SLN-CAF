import { API, withQuery } from "../data";
import type { AnnualResult, YearResultParams } from "./type";

/** `GET /api/avaliacoes/results/annual/` — resultado anual por disciplina. */
export async function getAnnualResult(
  params: YearResultParams,
  accessToken?: string,
): Promise<AnnualResult> {
  const response = await API.get<AnnualResult>(
    withQuery("/api/avaliacoes/results/annual/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
