import { API } from "../data";
import type { SchoolClass, SchoolClassPayload } from "./type";

export async function updateSchoolClass(
  id: string,
  payload: SchoolClassPayload,
  accessToken?: string,
): Promise<SchoolClass> {
  const response = await API.put<SchoolClass>(
    `/api/academico/school-classes/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
