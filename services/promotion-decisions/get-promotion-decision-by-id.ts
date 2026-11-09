import { API } from "../data";
import type { PromotionDecision } from "./type";

export async function getPromotionDecisionById(
  id: string,
  accessToken?: string,
): Promise<PromotionDecision> {
  const response = await API.get<PromotionDecision>(
    `/api/avaliacoes/promotion-decisions/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
