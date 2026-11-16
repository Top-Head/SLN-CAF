import { API } from "../data";
import type { AppUser, AppUserPayload } from "./type";

export async function updateAppUser(
  id: string,
  payload: AppUserPayload,
  accessToken?: string,
): Promise<AppUser> {
  const response = await API.put<AppUser>(
    `/api/auth/users/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
