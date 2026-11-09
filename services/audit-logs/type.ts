import type { Paginated } from "../data";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REFRESH"
  | "REGISTER"
  | "PASSWORD_RESET"
  | "VALIDATE"
  | "OTHER";

export type AuditLog = {
  id: string;
  user: string | null;
  user_username: string;
  user_role: string;
  action: AuditAction;
  entity: string;
  entity_id: string;
  description: string;
  /** Diferenças registadas pela API (formato livre). */
  changes: unknown;
  method: string;
  path: string;
  status_code: number | null;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
};

export type AuditLogListParams = {
  page?: number;
  action?: string;
  entity?: string;
  entity_id?: string;
  user?: string;
  status_code?: number;
  search?: string;
  /** Data inicial (AAAA-MM-DD). */
  date_from?: string;
  /** Data final (AAAA-MM-DD). */
  date_to?: string;
};

export type PaginatedAuditLogs = Paginated<AuditLog>;
