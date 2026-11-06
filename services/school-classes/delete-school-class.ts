import { API } from "../data";

export async function deleteSchoolClass(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/academico/school-classes/${encodeURIComponent(id)}/`, { accessToken });
}
