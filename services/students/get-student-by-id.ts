import { API } from "../data";
import type { Student } from "./type";

export async function getStudentById(
  id: string,
  accessToken?: string,
): Promise<Student> {
  const response = await API.get<Student>(
    `/api/academico/students/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
