import { API, withQuery } from "../data";
import type { PaginatedGrades, GradeListParams } from "./type";

export async function getAllGrades(
  params: GradeListParams = {},
  accessToken?: string,
): Promise<PaginatedGrades> {
  const response = await API.get<PaginatedGrades>(
    withQuery("/api/avaliacoes/grades/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
