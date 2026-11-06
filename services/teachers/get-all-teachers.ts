import { API } from "../data";
import type { PaginatedTeachers, TeacherListParams } from "./type";

export async function getAllTeachers(
  params: TeacherListParams = {},
  accessToken?: string,
): Promise<PaginatedTeachers> {
  const search = new URLSearchParams();

  if (params.page !== undefined) {
    search.set("page", String(params.page));
  }

  const query = search.toString();

  const response = await API.get<PaginatedTeachers>(
    `/api/auth/teachers/${query ? `?${query}` : ""}`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
