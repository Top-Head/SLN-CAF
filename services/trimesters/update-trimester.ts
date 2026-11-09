import { API } from "../data";
import type { Trimester, TrimesterPayload } from "./type";

export async function updateTrimester(
  id: string,
  payload: TrimesterPayload,
  accessToken?: string,
): Promise<Trimester> {
  const response = await API.put<Trimester>(
    `/api/avaliacoes/trimesters/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
