import { API, ApiError, toPaginated, withQuery } from "../data";
import type { PaginatedTeacherDashboard, TeacherPageParams } from "./type";

/**
 * `GET /api/teacher/dashboard/` — cartões do dashboard do professor.
 * Sem trimestre aberto a API responde 200 com `{ detail }` em vez dos
 * cartões; nesse caso lança `ApiError` com a mensagem para a página a mostrar.
 */
export async function getTeacherDashboard(
  params: TeacherPageParams = {},
  accessToken?: string,
): Promise<PaginatedTeacherDashboard> {
  const response = await API.get<unknown>(
    withQuery("/api/teacher/dashboard/", params),
    { accessToken, cache: "no-store" },
  );
  const data = response.data;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "detail" in data &&
    !("turmas" in data) &&
    !("results" in data)
  ) {
    throw new ApiError(String((data as { detail: unknown }).detail), 200, data);
  }

  return toPaginated(data);
}
