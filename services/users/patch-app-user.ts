import { API } from "../data";
import type { AppUser, AppUserPayload } from "./type";

export async function patchAppUser(
  id: string,
  payload: Partial<AppUserPayload>,
  accessToken?: string,
): Promise<AppUser> {
  const response = await API.patch<AppUser>(
    `/api/auth/users/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
