import { API, withQuery } from "../data";
import type {
  PaginatedDashboardProfessor,
  TeacherDashboardListParams,
} from "./type";

export async function getTeacherDashboard(
  params: TeacherDashboardListParams = {},
  accessToken?: string,
): Promise<PaginatedDashboardProfessor> {
  const response = await API.get<PaginatedDashboardProfessor>(
    withQuery("/api/teacher/dashboard/", params),
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
