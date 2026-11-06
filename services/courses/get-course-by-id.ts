import { API } from "../data";
import type { Course } from "./type";

export async function getCourseById(
  id: string,
  accessToken?: string,
): Promise<Course> {
  const response = await API.get<Course>(
    `/api/academico/courses/${encodeURIComponent(id)}/`,
    { accessToken, cache: "no-store" },
  );

  return response.data;
}
