import { API } from "../data";
import type { Student, StudentUpdatePayload } from "./type";

export async function patchStudent(
  id: string,
  payload: Partial<StudentUpdatePayload>,
  accessToken?: string,
): Promise<Student> {
  const response = await API.patch<Student>(
    `/api/academico/students/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
