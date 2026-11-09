"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { PromotionDecisionListParams } from "@/services/promotion-decisions";
import { promotionDecisionsStore } from "@/stores/use-promotion-decisions.store";

export function usePromotionDecisions(
  params: PromotionDecisionListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(promotionDecisionsStore, params, options);
}

export function useAllPromotionDecisions(options?: { enabled?: boolean }) {
  return useResourceAll(promotionDecisionsStore, options);
}
