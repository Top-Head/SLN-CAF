import { API } from "../data";

export async function deleteGradingScale(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/grading-scales/${encodeURIComponent(id)}/`, { accessToken });
}
