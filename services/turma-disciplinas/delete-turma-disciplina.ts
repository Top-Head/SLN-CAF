import { API } from "../data";

export async function deleteTurmaDisciplina(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/turma-disciplinas/${encodeURIComponent(id)}/`, { accessToken });
}
