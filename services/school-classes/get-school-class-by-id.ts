import { API } from "../data";
import type { SchoolClass } from "./type";

export async function getSchoolClassById(
  id: string,
  accessToken?: string,
): Promise<SchoolClass> {
  const response = await API.get<SchoolClass>(
    `/api/academico/school-classes/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
