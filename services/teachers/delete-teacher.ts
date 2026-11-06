import { API } from "../data";

export async function deleteTeacher(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(`/api/auth/teachers/${encodeURIComponent(id)}/`, {
    accessToken,
  });
}
