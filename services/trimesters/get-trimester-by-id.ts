import { API } from "../data";
import type { Trimester } from "./type";

export async function getTrimesterById(
  id: string,
  accessToken?: string,
): Promise<Trimester> {
  const response = await API.get<Trimester>(
    `/api/avaliacoes/trimesters/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
