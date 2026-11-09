import { API } from "../data";

export async function deleteExamGrade(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/exams/${encodeURIComponent(id)}/`, { accessToken });
}
