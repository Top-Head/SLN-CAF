import { API, withQuery } from "../data";
import type { PaginatedSubjects, SubjectListParams } from "./type";

export async function getAllSubjects(
  params: SubjectListParams = {},
  accessToken?: string,
): Promise<PaginatedSubjects> {
  const response = await API.get<PaginatedSubjects>(
    withQuery("/api/academico/subjects/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
