import { API, withQuery } from "../data";
import type { PaginatedTrimesters, TrimesterListParams } from "./type";

export async function getAllTrimesters(
  params: TrimesterListParams = {},
  accessToken?: string,
): Promise<PaginatedTrimesters> {
  const response = await API.get<PaginatedTrimesters>(
    withQuery("/api/avaliacoes/trimesters/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
