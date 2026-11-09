import { API } from "../data";

export async function deleteGrade(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/grades/${encodeURIComponent(id)}/`, { accessToken });
}
