import { API } from "../data";

export async function deleteSubject(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/subjects/${encodeURIComponent(id)}/`, { accessToken });
}
