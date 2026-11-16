import { API } from "../data";

export async function deleteClassRule(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/class-rules/${encodeURIComponent(id)}/`, { accessToken });
}
