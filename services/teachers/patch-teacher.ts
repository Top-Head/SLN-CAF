import { API } from "../data";
import type { Teacher, TeacherUpdatePayload } from "./type";

export async function patchTeacher(
  id: string,
  payload: Partial<TeacherUpdatePayload>,
  accessToken?: string,
): Promise<Teacher> {
  const response = await API.patch<Teacher>(
    `/api/auth/teachers/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
