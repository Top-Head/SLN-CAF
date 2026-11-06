import { API, withQuery } from "../data";
import type { PaginatedCourses, CourseListParams } from "./type";

export async function getAllCourses(
  params: CourseListParams = {},
  accessToken?: string,
): Promise<PaginatedCourses> {
  const response = await API.get<PaginatedCourses>(
    withQuery("/api/academico/courses/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
