import { API } from "../data";

export async function deleteSubjectExamRule(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/avaliacoes/subject-exam-rules/${encodeURIComponent(id)}/`, { accessToken });
}
