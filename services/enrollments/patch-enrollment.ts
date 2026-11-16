import { API } from "../data";
import type { Enrollment, EnrollmentPayload } from "./type";

export async function patchEnrollment(
  id: string,
  payload: Partial<EnrollmentPayload>,
  accessToken?: string,
): Promise<Enrollment> {
  const response = await API.patch<Enrollment>(
    `/api/academico/enrollments/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
