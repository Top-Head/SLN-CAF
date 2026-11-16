import { API, withQuery } from "../data";
import type { PaginatedEnrollments, EnrollmentListParams } from "./type";

export async function getAllEnrollments(
  params: EnrollmentListParams = {},
  accessToken?: string,
): Promise<PaginatedEnrollments> {
  const response = await API.get<PaginatedEnrollments>(
    withQuery("/api/academico/enrollments/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
