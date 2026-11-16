import { API } from "../data";
import type { AppUser } from "./type";

export async function getAppUserById(
  id: string,
  accessToken?: string,
): Promise<AppUser> {
  const response = await API.get<AppUser>(
    `/api/auth/users/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
