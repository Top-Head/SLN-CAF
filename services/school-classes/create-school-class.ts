import { API } from "../data";
import type { SchoolClass, SchoolClassPayload } from "./type";

export async function createSchoolClass(
  payload: SchoolClassPayload,
  accessToken?: string,
): Promise<SchoolClass> {
  const response = await API.post<SchoolClass>("/api/academico/school-classes/", payload, {
    accessToken,
  });

  return response.data;
}
