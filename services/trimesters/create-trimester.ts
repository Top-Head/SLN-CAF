import { API } from "../data";
import type { Trimester, TrimesterPayload } from "./type";

export async function createTrimester(
  payload: TrimesterPayload,
  accessToken?: string,
): Promise<Trimester> {
  const response = await API.post<Trimester>("/api/avaliacoes/trimesters/", payload, {
    accessToken,
  });

  return response.data;
}
