import { API } from "../data";

export async function deleteCurriculumSubject(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/curriculum-subjects/${encodeURIComponent(id)}/`, { accessToken });
}
