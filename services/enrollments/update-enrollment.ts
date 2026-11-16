import { API } from "../data";
import type { Enrollment, EnrollmentPayload } from "./type";

export async function updateEnrollment(
  id: string,
  payload: EnrollmentPayload,
  accessToken?: string,
): Promise<Enrollment> {
  const response = await API.put<Enrollment>(
    `/api/academico/enrollments/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
