import { API, toPaginated, withQuery } from "../data";
import type { PaginatedTeacherClasses, TeacherPageParams } from "./type";

/** `GET /api/teacher/minhas-turmas/` — turmas e disciplinas do professor. */
export async function getTeacherClasses(
  params: TeacherPageParams = {},
  accessToken?: string,
): Promise<PaginatedTeacherClasses> {
  const response = await API.get<unknown>(
    withQuery("/api/teacher/minhas-turmas/", params),
    { accessToken, cache: "no-store" },
  );

  return toPaginated(response.data);
}
