import { API, withQuery } from "../data";
import type { PromotionResult, YearResultParams } from "./type";

/** `GET /api/avaliacoes/results/promotion/` — situação de transição/reprovação. */
export async function getPromotionResult(
  params: YearResultParams,
  accessToken?: string,
): Promise<PromotionResult> {
  const response = await API.get<PromotionResult>(
    withQuery("/api/avaliacoes/results/promotion/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
