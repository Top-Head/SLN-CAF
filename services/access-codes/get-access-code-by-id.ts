import { API } from "../data";
import type { ManagedAccessCode } from "./type";

/** `GET /api/acess-code/codes/{id}/`. */
export async function getAccessCodeById(
  id: string,
  accessToken?: string,
): Promise<ManagedAccessCode> {
  const response = await API.get<ManagedAccessCode>(
    `/api/acess-code/codes/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
