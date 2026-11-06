import { API } from "../data";
import type { SchoolYear, SchoolYearPayload } from "./type";

export async function createSchoolYear(
  payload: SchoolYearPayload,
  accessToken?: string,
): Promise<SchoolYear> {
  const response = await API.post<SchoolYear>("/api/academico/school-years/", payload, {
    accessToken,
  });

  return response.data;
}
