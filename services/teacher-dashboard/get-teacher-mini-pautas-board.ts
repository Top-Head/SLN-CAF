import { API, toPaginated, withQuery } from "../data";
import type { PaginatedTeacherMiniPautaBoard, TeacherPageParams } from "./type";

/** `GET /api/teacher/dashboard/mini-pautas-data/` — progresso por turma-disciplina. */
export async function getTeacherMiniPautasBoard(
  params: TeacherPageParams = {},
  accessToken?: string,
): Promise<PaginatedTeacherMiniPautaBoard> {
  const response = await API.get<unknown>(
    withQuery("/api/teacher/dashboard/mini-pautas-data/", params),
    { accessToken, cache: "no-store" },
  );

  return toPaginated(response.data);
}
