import { API } from "../data";

export async function deleteTrimester(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/trimesters/${encodeURIComponent(id)}/`, { accessToken });
}
