import { API } from "../data";
import type { PromotionDecision, PromotionDecisionPayload } from "./type";

export async function createPromotionDecision(
  payload: PromotionDecisionPayload,
  accessToken?: string,
): Promise<PromotionDecision> {
  const response = await API.post<PromotionDecision>("/api/avaliacoes/promotion-decisions/", payload, {
    accessToken,
  });

  return response.data;
}
