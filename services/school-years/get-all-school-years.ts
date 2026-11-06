import { API, withQuery } from "../data";
import type { PaginatedSchoolYears, SchoolYearListParams } from "./type";

export async function getAllSchoolYears(
  params: SchoolYearListParams = {},
  accessToken?: string,
): Promise<PaginatedSchoolYears> {
  const response = await API.get<PaginatedSchoolYears>(
    withQuery("/api/academico/school-years/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
