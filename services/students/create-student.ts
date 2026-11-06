import { API } from "../data";
import type { CreateStudentPayload, Student } from "./type";

export async function createStudent(
  payload: CreateStudentPayload,
  accessToken?: string,
): Promise<Student> {
  const response = await API.post<Student>(
    "/api/academico/students/",
    payload,
    { accessToken },
  );

  return response.data;
}
