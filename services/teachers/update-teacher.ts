import { API } from "../data";
import type { Teacher, TeacherUpdatePayload } from "./type";

export async function updateTeacher(
  id: string,
  payload: TeacherUpdatePayload,
  accessToken?: string,
): Promise<Teacher> {
  const response = await API.put<Teacher>(
    `/api/auth/teachers/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
