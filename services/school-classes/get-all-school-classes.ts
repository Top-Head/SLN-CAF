import { API, withQuery } from "../data";
import type { PaginatedSchoolClasses, SchoolClassListParams } from "./type";

export async function getAllSchoolClasses(
  params: SchoolClassListParams = {},
  accessToken?: string,
): Promise<PaginatedSchoolClasses> {
  const response = await API.get<PaginatedSchoolClasses>(
    withQuery("/api/academico/school-classes/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
