import { API } from "../data";
import type { Teacher } from "./type";

export async function getTeacherById(
  id: string,
  accessToken?: string,
): Promise<Teacher> {
  const response = await API.get<Teacher>(
    `/api/auth/teachers/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
