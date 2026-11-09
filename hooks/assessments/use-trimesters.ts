"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { TrimesterListParams } from "@/services/trimesters";
import { trimestersStore } from "@/stores/use-trimesters.store";

export function useTrimesters(
  params: TrimesterListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(trimestersStore, params, options);
}

export function useAllTrimesters(options?: { enabled?: boolean }) {
  return useResourceAll(trimestersStore, options);
}
