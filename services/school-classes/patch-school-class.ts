import { API } from "../data";
import type { SchoolClass, SchoolClassPayload } from "./type";

export async function patchSchoolClass(
  id: string,
  payload: Partial<SchoolClassPayload>,
  accessToken?: string,
): Promise<SchoolClass> {
  const response = await API.patch<SchoolClass>(
    `/api/academico/school-classes/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
