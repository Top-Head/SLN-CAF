"use client";

import { useResourceAll, useResourceList } from "@/hooks/resources/use-resource";
import type { AuditLogListParams } from "@/services/audit-logs";
import { auditLogsStore } from "@/stores/use-audit-logs.store";

export function useAuditLogs(
  params: AuditLogListParams = {},
  options?: { enabled?: boolean },
) {
  return useResourceList(auditLogsStore, params, options);
}

export function useAllAuditLogs(options?: { enabled?: boolean }) {
  return useResourceAll(auditLogsStore, options);
}
