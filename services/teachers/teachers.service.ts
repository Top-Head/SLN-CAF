import { API } from "../data";
import type {
  PaginatedTeachers,
  Teacher,
  TeacherListParams,
} from "./type";

async function getAllTeachers(
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

async function getTeacherById(
  id: string,
  accessToken?: string,
): Promise<Teacher> {
  const response = await API.get<Teacher>(
    `/api/auth/teachers/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}

export const teachersService = {
  getAllTeachers,
  getTeacherById,
};
