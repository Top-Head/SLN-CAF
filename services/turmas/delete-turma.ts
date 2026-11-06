import { API } from "../data";

export async function deleteTurma(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/turmas/${encodeURIComponent(id)}/`, { accessToken });
}
