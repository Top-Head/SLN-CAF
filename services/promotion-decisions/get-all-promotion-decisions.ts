import { API, withQuery } from "../data";
import type { PaginatedPromotionDecisions, PromotionDecisionListParams } from "./type";

export async function getAllPromotionDecisions(
  params: PromotionDecisionListParams = {},
  accessToken?: string,
): Promise<PaginatedPromotionDecisions> {
  const response = await API.get<PaginatedPromotionDecisions>(
    withQuery("/api/avaliacoes/promotion-decisions/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
