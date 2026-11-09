"use client";

import { getAllPromotionDecisions } from "@/services/promotion-decisions";
import type { PromotionDecision, PromotionDecisionListParams } from "@/services/promotion-decisions";
import { createResourceStore } from "@/stores/create-resource-store";

export const promotionDecisionsStore = createResourceStore<PromotionDecision, PromotionDecisionListParams>({
  fetchPage: getAllPromotionDecisions,
  errorMessage: "Não foi possível carregar as decisões de promoção.",
});
