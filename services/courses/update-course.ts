import { API } from "../data";
import type { Course, CoursePayload } from "./type";

export async function updateCourse(
  id: string,
  payload: CoursePayload,
  accessToken?: string,
): Promise<Course> {
  const response = await API.put<Course>(
    `/api/academico/courses/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
