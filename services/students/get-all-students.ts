import { API } from "../data";
import type { PaginatedStudents, StudentListParams } from "./type";

export async function getAllStudents(
  params: StudentListParams = {},
  accessToken?: string,
): Promise<PaginatedStudents> {
  const search = new URLSearchParams();

  if (params.page !== undefined) {
    search.set("page", String(params.page));
  }

  if (params.search?.trim()) {
    search.set("search", params.search.trim());
  }

  const query = search.toString();
  const response = await API.get<PaginatedStudents>(
    `/api/academico/students/${query ? `?${query}` : ""}`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
