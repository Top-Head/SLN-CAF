import { API } from "../data";
import type { Student, StudentUpdatePayload } from "./type";

export async function updateStudent(
  id: string,
  payload: StudentUpdatePayload,
  accessToken?: string,
): Promise<Student> {
  const response = await API.put<Student>(
    `/api/academico/students/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
