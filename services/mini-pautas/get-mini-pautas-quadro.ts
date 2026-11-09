import { API, withQuery } from "../data";
import type {
  PaginatedQuadroMiniPauta,
  QuadroMiniPautaListParams,
} from "./type";

export async function getMiniPautasQuadro(
  params: QuadroMiniPautaListParams = {},
  accessToken?: string,
): Promise<PaginatedQuadroMiniPauta> {
  const response = await API.get<PaginatedQuadroMiniPauta>(
    withQuery("/api/teacher/dashboard/mini-pautas-data/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
