import { API } from "../data";

export async function deleteStudent(
  id: string,
  accessToken?: string,
): Promise<void> {
  await API.delete<void>(
    `/api/academico/students/${encodeURIComponent(id)}/`,
    { accessToken },
  );
}
