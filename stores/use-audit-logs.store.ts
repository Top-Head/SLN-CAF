"use client";

import { getAllAuditLogs } from "@/services/audit-logs";
import type { AuditLog, AuditLogListParams } from "@/services/audit-logs";
import { createResourceStore } from "@/stores/create-resource-store";

export const auditLogsStore = createResourceStore<AuditLog, AuditLogListParams>({
  fetchPage: getAllAuditLogs,
  errorMessage: "Não foi possível carregar o histórico de alterações.",
});
