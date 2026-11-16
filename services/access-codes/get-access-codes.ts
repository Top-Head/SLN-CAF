import { API, withQuery } from "../data";
import type { ManagedAccessCodeListParams, PaginatedManagedAccessCodes } from "./type";

/** `GET /api/acess-code/codes/` — códigos emitidos (sem o código em claro). */
export async function getAccessCodes(
  params: ManagedAccessCodeListParams = {},
  accessToken?: string,
): Promise<PaginatedManagedAccessCodes> {
  const response = await API.get<PaginatedManagedAccessCodes>(
    withQuery("/api/acess-code/codes/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
