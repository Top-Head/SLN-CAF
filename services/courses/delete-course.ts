import { API } from "../data";

export async function deleteCourse(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/courses/${encodeURIComponent(id)}/`, { accessToken });
}
