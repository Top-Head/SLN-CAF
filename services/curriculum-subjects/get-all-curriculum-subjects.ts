import { API, withQuery } from "../data";
import type { PaginatedCurriculumSubjects, CurriculumSubjectListParams } from "./type";

export async function getAllCurriculumSubjects(
  params: CurriculumSubjectListParams = {},
  accessToken?: string,
): Promise<PaginatedCurriculumSubjects> {
  const response = await API.get<PaginatedCurriculumSubjects>(
    withQuery("/api/academico/curriculum-subjects/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
