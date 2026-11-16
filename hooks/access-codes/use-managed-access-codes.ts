"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { ManagedAccessCodeListParams } from "@/services/access-codes";
import { managedAccessCodesStore } from "@/stores/use-managed-access-codes.store";

export function useManagedAccessCodes(
  params: ManagedAccessCodeListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(managedAccessCodesStore, params, options);
}

export function useAllManagedAccessCodes(options?: { enabled?: boolean }) {
  return useResourceAll(managedAccessCodesStore, options);
}
