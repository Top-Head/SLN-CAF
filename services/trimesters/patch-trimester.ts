import { API } from "../data";
import type { Trimester, TrimesterPayload } from "./type";

export async function patchTrimester(
  id: string,
  payload: Partial<TrimesterPayload>,
  accessToken?: string,
): Promise<Trimester> {
  const response = await API.patch<Trimester>(
    `/api/avaliacoes/trimesters/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
