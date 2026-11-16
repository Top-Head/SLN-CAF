import { API } from "../data";
import type { Enrollment, EnrollmentPayload } from "./type";

export async function createEnrollment(
  payload: EnrollmentPayload,
  accessToken?: string,
): Promise<Enrollment> {
  const response = await API.post<Enrollment>("/api/academico/enrollments/", payload, {
    accessToken,
  });

  return response.data;
}
