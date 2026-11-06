import { API, withQuery } from "../data";
import type { PaginatedTurmas, TurmaListParams } from "./type";

export async function getAllTurmas(
  params: TurmaListParams = {},
  accessToken?: string,
): Promise<PaginatedTurmas> {
  const response = await API.get<PaginatedTurmas>(
    withQuery("/api/academico/turmas/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
