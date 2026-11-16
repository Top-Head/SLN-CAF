import { API } from "../data";
import type { ManagedAccessCode } from "./type";

/** `POST /api/acess-code/codes/{id}/revoke/` — impede o uso do código. */
export async function revokeAccessCode(
  id: string,
  accessToken?: string,
): Promise<ManagedAccessCode> {
  const response = await API.post<ManagedAccessCode>(
    `/api/acess-code/codes/${encodeURIComponent(id)}/revoke/`,
    undefined,
    { accessToken },
  );

  return response.data;
}
