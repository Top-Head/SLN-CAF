import { API, withQuery } from "../data";
import type { TrimesterResult, TrimesterResultParams } from "./type";

/** `GET /api/avaliacoes/results/trimester/` — resultado de um trimestre. */
export async function getTrimesterResult(
  params: TrimesterResultParams,
  accessToken?: string,
): Promise<TrimesterResult> {
  const response = await API.get<TrimesterResult>(
    withQuery("/api/avaliacoes/results/trimester/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
