import { API, withQuery } from "../data";
import type { PaginatedAuditLogs, AuditLogListParams } from "./type";

export async function getAllAuditLogs(
  params: AuditLogListParams = {},
  accessToken?: string,
): Promise<PaginatedAuditLogs> {
  const response = await API.get<PaginatedAuditLogs>(
    withQuery("/api/audit/logs/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
