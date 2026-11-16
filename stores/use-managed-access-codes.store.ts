"use client";

import { getAccessCodes } from "@/services/access-codes";
import type { ManagedAccessCode, ManagedAccessCodeListParams } from "@/services/access-codes";
import { createResourceStore } from "@/stores/create-resource-store";

export const managedAccessCodesStore = createResourceStore<ManagedAccessCode, ManagedAccessCodeListParams>({
  fetchPage: getAccessCodes,
  errorMessage: "Não foi possível carregar os códigos emitidos.",
});
