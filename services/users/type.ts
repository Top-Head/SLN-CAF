import type { Paginated } from "../data";

export type UserRole = "ADMIN" | "TEACHER";

/** Conta de utilizador (gestão: papel e estado). */
export type AppUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  active?: boolean;
  created_at: string;
};

export type AppUserListParams = { page?: number };

export type AppUserPayload = {
  username: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export type PaginatedAppUsers = Paginated<AppUser>;
