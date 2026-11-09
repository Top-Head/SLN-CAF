import { API, withQuery } from "../data";
import type { MiniPautaListParams, PaginatedMiniPautas } from "./type";

export async function getMiniPautas(
  params: MiniPautaListParams,
  accessToken?: string,
): Promise<PaginatedMiniPautas> {
  const response = await API.get<PaginatedMiniPautas>(
    withQuery("/api/teacher/mini-pautas/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
