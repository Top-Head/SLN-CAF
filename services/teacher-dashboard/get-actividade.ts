import { API, withQuery } from "../data";
import type {
  ActividadeRecenteListParams,
  PaginatedActividadeRecente,
} from "./type";

export async function getTeacherActividade(
  params: ActividadeRecenteListParams = {},
  accessToken?: string,
): Promise<PaginatedActividadeRecente> {
  const response = await API.get<PaginatedActividadeRecente>(
    withQuery("/api/teacher/dashboard/actividade/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
