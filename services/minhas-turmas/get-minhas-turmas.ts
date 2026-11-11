import { API, withQuery } from "../data";
import type { MinhaTurmaListParams, PaginatedMinhasTurmas } from "./type";

export async function getMinhasTurmas(
  params: MinhaTurmaListParams = {},
  accessToken?: string,
): Promise<PaginatedMinhasTurmas> {
  const response = await API.get<PaginatedMinhasTurmas>(
    withQuery("/api/teacher/minhas-turmas/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
