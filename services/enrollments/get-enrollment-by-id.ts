import { API } from "../data";
import type { Enrollment } from "./type";

export async function getEnrollmentById(
  id: string,
  accessToken?: string,
): Promise<Enrollment> {
  const response = await API.get<Enrollment>(
    `/api/academico/enrollments/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
