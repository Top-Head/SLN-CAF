import { API } from "../data";

export async function deleteEnrollment(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/enrollments/${encodeURIComponent(id)}/`, { accessToken });
}
