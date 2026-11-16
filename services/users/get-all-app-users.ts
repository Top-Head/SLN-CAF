import { API, withQuery } from "../data";
import type { PaginatedAppUsers, AppUserListParams } from "./type";

export async function getAllAppUsers(
  params: AppUserListParams = {},
  accessToken?: string,
): Promise<PaginatedAppUsers> {
  const response = await API.get<PaginatedAppUsers>(
    withQuery("/api/auth/users/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
