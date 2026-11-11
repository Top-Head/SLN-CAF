import { API, toPaginated, withQuery } from "../data";
import type { PaginatedTeacherActivity, TeacherPageParams } from "./type";

/** `GET /api/teacher/dashboard/actividade/` — notas lançadas recentemente. */
export async function getTeacherActivity(
  params: TeacherPageParams = {},
  accessToken?: string,
): Promise<PaginatedTeacherActivity> {
  const response = await API.get<unknown>(
    withQuery("/api/teacher/dashboard/actividade/", params),
    { accessToken, cache: "no-store" },
  );

  return toPaginated(response.data);
}
