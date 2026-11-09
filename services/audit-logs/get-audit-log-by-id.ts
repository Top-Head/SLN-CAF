import { API } from "../data";
import type { AuditLog } from "./type";

export async function getAuditLogById(
  id: string,
  accessToken?: string,
): Promise<AuditLog> {
  const response = await API.get<AuditLog>(
    `/api/audit/logs/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
