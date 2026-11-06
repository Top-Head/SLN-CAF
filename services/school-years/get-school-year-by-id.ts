import { API } from "../data";
import type { SchoolYear } from "./type";

export async function getSchoolYearById(
  id: string,
  accessToken?: string,
): Promise<SchoolYear> {
  const response = await API.get<SchoolYear>(
    `/api/academico/school-years/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
