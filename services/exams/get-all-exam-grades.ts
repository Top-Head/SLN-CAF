import { API, withQuery } from "../data";
import type { PaginatedExamGrades, ExamGradeListParams } from "./type";

export async function getAllExamGrades(
  params: ExamGradeListParams = {},
  accessToken?: string,
): Promise<PaginatedExamGrades> {
  const response = await API.get<PaginatedExamGrades>(
    withQuery("/api/avaliacoes/exams/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
