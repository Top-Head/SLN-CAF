import { API, withQuery } from "../data";
import type { PaginatedGradingScales, GradingScaleListParams } from "./type";

export async function getAllGradingScales(
  params: GradingScaleListParams = {},
  accessToken?: string,
): Promise<PaginatedGradingScales> {
  const response = await API.get<PaginatedGradingScales>(
    withQuery("/api/avaliacoes/grading-scales/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
